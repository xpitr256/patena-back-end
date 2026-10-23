"""Unit tests for patena.py (mutation engine, scoring helpers) and an end to end run of the CLI."""
import json
import os
import random
import shutil
import subprocess
import sys

import pytest

import patena
import tool_functions

PATENA_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
AMINO_ACIDS = "ARNDCQEGHILKMFPSTWYV"


class TestGlobalScore:
    def test_sums_every_position(self):
        assert patena.get_global_score([1, 2, 3.5]) == 6.5

    def test_empty_scores_sum_zero(self):
        assert patena.get_global_score([]) == 0.0

    def test_returns_a_float(self):
        assert isinstance(patena.get_global_score([1, 2]), float)


class TestMutation:
    def test_to_dict_exposes_every_field(self):
        mutation = patena.Mutation("AKC", 1, "G", "K")
        assert mutation.to_dict() == {"mutated_sequence": "AKC", "mutated_position": 1, "previous_residue": "G", "replacement_aa": "K"}


class TestWeightedChoice:
    def test_only_items_with_weight_can_be_chosen(self):
        for _ in range(50):
            assert patena.weighted_choice([("A", 0), ("B", 3)]) == "B"

    def test_follows_weights(self):
        random.seed(1)
        picks = [patena.weighted_choice([("A", 1), ("B", 9)]) for _ in range(2000)]
        assert picks.count("B") > picks.count("A") * 4


class TestMutationAttempt:
    SEQUENCE = "AAAAAA"
    FREQUENCIES = [("A", 5), ("C", 5), ("D", 5)]

    def test_changes_exactly_one_residue(self):
        random.seed(3)
        weights = [(i, 1) for i in range(len(self.SEQUENCE))]
        mutation = patena.mutation_attempt(self.SEQUENCE, weights, self.FREQUENCIES, "EVAL1", 1, 1, False)
        differences = [i for i, (a, b) in enumerate(zip(self.SEQUENCE, mutation.sequence)) if a != b]
        assert differences == [mutation.mutated_position]
        assert len(mutation.sequence) == len(self.SEQUENCE)

    def test_never_replaces_a_residue_with_itself(self):
        weights = [(i, 1) for i in range(len(self.SEQUENCE))]
        for seed in range(100):
            random.seed(seed)
            mutation = patena.mutation_attempt(self.SEQUENCE, weights, self.FREQUENCIES, "EVAL1", 1, 1, False)
            assert mutation.prev_aa != mutation.replacement_aa

    def test_only_positions_with_weight_are_mutated(self):
        weights = [(2, 1)]
        for seed in range(20):
            random.seed(seed)
            mutation = patena.mutation_attempt(self.SEQUENCE, weights, self.FREQUENCIES, "EVAL1", 1, 1, False)
            assert mutation.mutated_position == 2

    def test_verbose_prints_the_step(self, capsys):
        patena.mutation_attempt(self.SEQUENCE, [(0, 1)], self.FREQUENCIES, "EVAL2", 7, 3, True)
        out = capsys.readouterr().out
        assert "MUTATION ATTEMPT" in out
        assert "NEW-SEQ" in out


class TestMonteCarloEvaluation:
    def test_always_accepts_a_better_score(self, monkeypatch):
        monkeypatch.setattr(patena.random, "random", lambda: 0.999)
        # previous 10 -> mutated 2: diff positive, e^(8/0.5) is huge
        assert patena.mc_evaluation(0.5, 10, 2, "EVAL1", 1, 1, False) is True

    def test_worse_score_is_accepted_only_when_random_is_below_the_probability(self, monkeypatch):
        # previous 2 -> mutated 3: e^(-1/1) = 0.367
        monkeypatch.setattr(patena.random, "random", lambda: 0.2)
        assert patena.mc_evaluation(1.0, 2, 3, "EVAL1", 1, 1, False) is True
        monkeypatch.setattr(patena.random, "random", lambda: 0.9)
        assert patena.mc_evaluation(1.0, 2, 3, "EVAL1", 1, 1, False) is False

    def test_saturates_for_much_worse_mutations(self, monkeypatch):
        monkeypatch.setattr(patena.random, "random", lambda: 0.0)
        # exponent < -100 saturates to a negative value that can never be accepted
        assert patena.mc_evaluation(0.5, 0, 1000, "EVAL1", 1, 1, False) is False

    def test_smaller_beta_is_less_permissive(self, monkeypatch):
        monkeypatch.setattr(patena.random, "random", lambda: 0.3)
        assert patena.mc_evaluation(2.0, 2, 3, "EVAL1", 1, 1, False) is True  # e^-0.5 = 0.61
        assert patena.mc_evaluation(0.2, 2, 3, "EVAL1", 1, 1, False) is False  # e^-5 = 0.0067


class TestPrintFormattedScores:
    def test_prints_sequence_and_scores_aligned(self, capsys):
        patena.print_formatted_scores("AC", [10, 2])
        lines = capsys.readouterr().out.splitlines()
        assert lines == ["A |C ", "10|2 "]


class TestFirstPartialEvaluation:
    @pytest.fixture
    def fake_tools(self, monkeypatch):
        calls = []

        def make(name, amount):
            def tool(sequence, scores, config, inputs, outputs, verbose, detailed):
                calls.append(name)
                for i in range(len(scores)):
                    scores[i] += amount

            return tool

        monkeypatch.setattr(tool_functions, "tool_functions_dict", {"ELM": make("ELM", 1), "Limbo": make("Limbo", 2), "Tango": make("Tango", 5)})
        return calls

    def run(self, tmp_path, execution_set, **kwargs):
        sequence = "ACD"
        scores = [0] * 3
        times = {"ELM": 0, "Limbo": 0, "Tango": 0}
        result = patena.firstPartialEvaluation(sequence, {}, scores, execution_set, times, str(tmp_path) + "/", str(tmp_path) + "/", False, kwargs.get("detailed", False), False)
        return result, scores, times

    def test_runs_only_the_enabled_tools_and_returns_the_global_score(self, tmp_path, fake_tools):
        result, scores, _ = self.run(tmp_path, {"ELM", "Limbo"})
        assert sorted(fake_tools) == ["ELM", "Limbo"]
        assert scores == [3, 3, 3]
        assert result == 9.0

    def test_writes_the_sequence_in_fasta_format(self, tmp_path, fake_tools):
        self.run(tmp_path, {"ELM"})
        assert (tmp_path / "sequenceFASTA").read_text() == ">gi\nACD"

    def test_accumulates_execution_time_per_tool(self, tmp_path, fake_tools):
        _, _, times = self.run(tmp_path, {"ELM"})
        assert times["ELM"] >= 0
        assert times["Limbo"] == 0

    def test_detailed_output_separates_tools(self, tmp_path, fake_tools, monkeypatch):
        import io

        out = io.StringIO()
        monkeypatch.setattr(tool_functions, "detailedOutFile", out)
        self.run(tmp_path, {"ELM", "Limbo"}, detailed=True)
        assert out.getvalue().count("***********") == 2


class TestSecondPartialEvaluation:
    def test_runs_blast_and_saves_the_fasta(self, tmp_path, monkeypatch):
        calls = []
        monkeypatch.setattr(tool_functions, "blastIt", lambda *args: calls.append(args))
        scores = [0, 0, 0]
        patena.secondPartialEvaluation("ACD", scores, False, str(tmp_path) + "/", str(tmp_path) + "/", "uniprot_sprot.fasta", False, False)
        assert len(calls) == 1
        assert calls[0][0] == "ACD"
        assert calls[0][3] == "uniprot_sprot.fasta" or "uniprot_sprot.fasta" in calls[0]
        assert (tmp_path / "sequenceFASTA").read_text() == ">gi\nACD"


def run_cli(*args):
    command = [sys.executable, os.path.join(PATENA_DIR, "patena.py")] + list(args)
    return subprocess.run(command, capture_output=True, text=True, timeout=120)


# only the tools that need no external binaries
LIGHT_TOOLS = ["--noblast", "--notango", "--noiupred", "--noanchor", "--noprosite", "--nolimbo", "--notmhmm", "--nopasta", "--nowaltz"]


class TestCommandLine:
    @pytest.fixture
    def job(self):
        job_id = "pytest-job-%d" % os.getpid()
        yield job_id
        for folder in ("Output", "inputs"):
            shutil.rmtree(os.path.join(PATENA_DIR, folder, job_id), ignore_errors=True)

    def results(self, job):
        with open(os.path.join(PATENA_DIR, "Output", job, "results.json")) as f:
            return json.load(f)

    def test_evaluation_only_writes_the_initial_score(self, job):
        sequence = "MKVLAAGIVEGGKRDEAS"
        proc = run_cli("--seq=" + sequence, "--jobid=" + job, "--json", "--evaluation-only", "--net-charge=0", *LIGHT_TOOLS)
        assert proc.returncode == 0, proc.stderr
        results = self.results(job)
        assert results["mode"] == "evaluation"
        assert results["initialSequence"] == sequence
        assert results["initialScore"] > 0
        assert "mutationsHistory" not in results

    def test_generates_a_random_sequence_of_the_requested_length(self, job):
        proc = run_cli("--length=25", "--jobid=" + job, "--json", "--max-iterations=2", "--net-charge=0", *LIGHT_TOOLS)
        assert proc.returncode == 0, proc.stderr
        results = self.results(job)
        assert len(results["finalSequence"]) == 25
        assert set(results["finalSequence"]) <= set(AMINO_ACIDS)

    def test_mutations_history_is_recorded_and_consistent(self, job):
        sequence = "MKVLAAGIVEGGKRDEASMKVLAAGIVEGG"
        proc = run_cli("--seq=" + sequence, "--jobid=" + job, "--json", "--max-iterations=5", "--net-charge=0", *LIGHT_TOOLS)
        assert proc.returncode == 0, proc.stderr
        results = self.results(job)
        assert "mutationsHistory" in results
        assert len(results["finalSequence"]) == len(sequence)
        for mutation in results["mutationsHistory"]:
            assert mutation["previous_residue"] != mutation["replacement_aa"]

    def test_beta_and_max_iterations_are_accepted(self, job):
        proc = run_cli("--seq=MKVLAAGIVEGGKRDEAS", "--jobid=" + job, "--json", "--beta=1.5", "--max-iterations=2", "--net-charge=0", *LIGHT_TOOLS)
        assert proc.returncode == 0, proc.stderr
        assert "Beta= 1.5" in proc.stdout

    def test_detailed_output_file_is_written(self, job, tmp_path):
        details = tmp_path / "details.txt"
        proc = run_cli("--seq=MKVLAAGIVEGGKRDEAS", "--jobid=" + job, "--json", "--evaluation-only", "--net-charge=0", "--detailed-output=" + str(details), *LIGHT_TOOLS)
        assert proc.returncode == 0, proc.stderr
        assert "ELM" in details.read_text()

    def test_unknown_option_fails(self):
        proc = run_cli("--does-not-exist")
        assert proc.returncode != 0
