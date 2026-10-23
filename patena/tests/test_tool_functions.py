"""Unit tests for tool_functions. External tools (binaries, perl scripts, BLAST) are mocked."""
import io
import subprocess
from types import SimpleNamespace

import pytest

import tool_functions as tf

SEQ = "MKVLAAGIVE"


def scores_for(sequence):
    return [0] * len(sequence)


def write_file(directory, name, content):
    path = directory / name
    path.write_text(content)
    return path


@pytest.fixture
def dirs(tmp_path):
    inputs = tmp_path / "inputs"
    outputs = tmp_path / "outputs"
    inputs.mkdir()
    outputs.mkdir()
    return str(inputs) + "/", str(outputs) + "/"


@pytest.fixture
def detailed(monkeypatch):
    out = io.StringIO()
    monkeypatch.setattr(tf, "detailedOutFile", out)
    return out


class TestChargedSearch:
    def test_adds_nothing_when_net_charge_is_the_target(self):
        sequence = "KKDD"  # net charge 0
        scores = scores_for(sequence)
        tf.chargedSearch(sequence, scores, {"targetNetCharge": 0}, "", "", False, False)
        assert scores == [0, 0, 0, 0]

    def test_penalizes_positive_residues_when_charge_is_above_target(self):
        sequence = "KRAD"  # net charge +1
        scores = scores_for(sequence)
        tf.chargedSearch(sequence, scores, {"targetNetCharge": 0}, "", "", False, False)
        assert scores == [2, 2, 1, 0]

    def test_penalizes_negative_residues_when_charge_is_below_target(self):
        sequence = "DEAK"  # net charge -1
        scores = scores_for(sequence)
        tf.chargedSearch(sequence, scores, {"targetNetCharge": 0}, "", "", False, False)
        assert scores == [2, 2, 1, 0]

    def test_histidine_counts_as_positive(self):
        scores = scores_for("H")
        tf.chargedSearch("H", scores, {"targetNetCharge": 0}, "", "", False, False)
        assert scores == [2]

    def test_accumulates_on_previous_scores(self):
        scores = [5, 5]
        tf.chargedSearch("KA", scores, {"targetNetCharge": 0}, "", "", False, False)
        assert scores == [7, 6]

    def test_verbose_prints_results(self, capsys):
        tf.chargedSearch("KA", scores_for("KA"), {"targetNetCharge": 0}, "", "", True, False)
        assert "Charge search RESULTS" in capsys.readouterr().out


class TestAmyloidPatternSearch:
    # pattern: [^P][^PKRHW][VLSCWFNQE][ILTYWFNE][FIY][^PKRH]
    HIT = "AAVIFA"

    def test_verbose_prints_the_score_of_every_position_of_a_hit(self, capsys):
        tf.amyloidPatternSearch(self.HIT, scores_for(self.HIT), {}, "", "", True, False)
        out = capsys.readouterr().out
        assert "FOUND" in out
        assert "1|1|1|1|1|1" in out

    @pytest.mark.xfail(reason="amyloid hits are only printed, they are never added to positionScores (legacy behaviour, changing it alters PATENA scores)")
    def test_hits_contribute_to_the_position_scores(self):
        scores = scores_for(self.HIT)
        tf.amyloidPatternSearch(self.HIT, scores, {}, "", "", False, False)
        assert scores == [1] * 6

    def test_no_hit_leaves_scores_untouched(self):
        scores = scores_for("GGGGGG")
        tf.amyloidPatternSearch("GGGGGG", scores, {}, "", "", False, False)
        assert scores == [0] * 6

    def test_proline_at_start_prevents_the_hit(self):
        sequence = "PAVIFA"
        scores = scores_for(sequence)
        tf.amyloidPatternSearch(sequence, scores, {}, "", "", False, False)
        assert scores == [0] * 6

    def test_detailed_output_reports_no_hits(self, detailed):
        tf.amyloidPatternSearch("GGGGGG", scores_for("GGGGGG"), {}, "", "", False, True)
        assert "NO hits found" in detailed.getvalue()

    def test_detailed_output_reports_determinant(self, detailed):
        tf.amyloidPatternSearch(self.HIT, scores_for(self.HIT), {}, "", "", False, True)
        assert "Sequence determinant found" in detailed.getvalue()


class TestElm:
    def test_run_elm_search_writes_matches_with_positions(self, dirs):
        _, outputs = dirs
        # CLV_PCSK_FUR_1 is R.[RK]R.  -> RARRA matches at positions 1-5
        tf.run_elm_search("RARRA", outputs, False, False)
        lines = open(outputs + "outputELM").read().splitlines()
        assert "1\t5" in lines

    def test_run_elm_search_with_description_adds_motif_id(self, dirs):
        _, outputs = dirs
        tf.run_elm_search("RARRA", outputs, True, False)
        content = open(outputs + "outputELM").read()
        assert "CLV_PCSK_FUR_1" in content

    def test_elm_search_adds_one_per_matched_position(self, dirs, monkeypatch):
        inputs, outputs = dirs
        monkeypatch.setattr(tf, "run_elm_search", lambda *a: write_file(__import__("pathlib").Path(outputs), "outputELM", "1\t3\tELM_A\n2\t4\tELM_B\n"))
        scores = scores_for("AAAAA")
        tf.elmSearch("AAAAA", scores, {}, inputs, outputs, False, False)
        assert scores == [1, 2, 2, 1, 0]

    def test_elm_search_real_patterns_do_not_crash(self, dirs):
        inputs, outputs = dirs
        scores = scores_for(SEQ)
        tf.elmSearch(SEQ, scores, {}, inputs, outputs, False, False)
        assert len(scores) == len(SEQ)
        assert all(s >= 0 for s in scores)


class TestIupred:
    def run(self, dirs, monkeypatch, values, verbose=False, detailed_output=False):
        inputs, outputs = dirs
        commands = []
        monkeypatch.setattr(tf.os, "system", lambda cmd: commands.append(cmd) or write_file(__import__("pathlib").Path(outputs), "outIUPred", "\n".join(map(str, values)) + "\n"))
        sequence = "A" * len(values)
        scores = scores_for(sequence)
        tf.iupred(sequence, scores, {"iupredThreshold": 0.5}, inputs, outputs, verbose, detailed_output)
        return scores, commands

    def test_residues_below_threshold_score_one(self, dirs, monkeypatch):
        # verbose is needed for the code path that scores positions
        scores, _ = self.run(dirs, monkeypatch, [0.1, 0.9, 0.4, 0.5], verbose=True)
        assert scores == [1, 0, 1, 0]

    def test_runs_the_iupred_executable_on_the_fasta_file(self, dirs, monkeypatch):
        _, commands = self.run(dirs, monkeypatch, [0.1])
        assert "iupred/iupredExe" in commands[0]
        assert "sequenceFASTA" in commands[0]

    def test_detailed_output_lists_positions(self, dirs, monkeypatch, detailed):
        self.run(dirs, monkeypatch, [0.1, 0.9], detailed_output=True)
        assert "Position 0 below threshold" in detailed.getvalue()


class TestAnchor:
    def run(self, dirs, monkeypatch, values, detailed_output=False):
        inputs, outputs = dirs
        commands = []
        monkeypatch.setattr(tf.os, "system", lambda cmd: commands.append(cmd) or write_file(__import__("pathlib").Path(outputs), "outAnchor", "\n".join(map(str, values)) + "\n"))
        sequence = "A" * len(values)
        scores = scores_for(sequence)
        tf.anchor(sequence, scores, {"anchorThreshold": 0.5}, inputs, outputs, False, detailed_output)
        return scores, commands

    def test_residues_above_threshold_score_one(self, dirs, monkeypatch):
        scores, _ = self.run(dirs, monkeypatch, [0.9, 0.1, 0.6, 0.5])
        assert scores == [1, 0, 1, 0]

    def test_runs_the_anchor_executable(self, dirs, monkeypatch):
        _, commands = self.run(dirs, monkeypatch, [0.9])
        assert "ANCHOR/anchor" in commands[0]

    def test_detailed_output_lists_positions(self, dirs, monkeypatch, detailed):
        self.run(dirs, monkeypatch, [0.9, 0.1], detailed_output=True)
        assert "Position 0 above threshold" in detailed.getvalue()


class TestLimbo:
    def test_hit_marks_the_heptapeptide(self, dirs, monkeypatch):
        inputs, outputs = dirs
        # first column is the 1-based start of the hit
        monkeypatch.setattr(tf.os, "system", lambda cmd: write_file(__import__("pathlib").Path(outputs), "outLimbo", "2\tAAAAAAA\t12.0\tgi\n"))
        scores = scores_for("A" * 10)
        tf.limboEval("A" * 10, scores, {}, inputs, outputs, False, False)
        assert scores == [0, 1, 1, 1, 1, 1, 1, 1, 0, 0]

    def test_no_hits_leaves_scores_untouched(self, dirs, monkeypatch):
        inputs, outputs = dirs
        monkeypatch.setattr(tf.os, "system", lambda cmd: write_file(__import__("pathlib").Path(outputs), "outLimbo", ""))
        scores = scores_for("AAAA")
        tf.limboEval("AAAA", scores, {}, inputs, outputs, False, False)
        assert scores == [0] * 4

    def test_invokes_score_script_with_current_interpreter(self, dirs, monkeypatch):
        inputs, outputs = dirs
        commands = []
        monkeypatch.setattr(tf.os, "system", lambda cmd: commands.append(cmd) or write_file(__import__("pathlib").Path(outputs), "outLimbo", ""))
        tf.limboEval("AAAA", scores_for("AAAA"), {}, inputs, outputs, False, False)
        assert commands[0].startswith(tf.sys.executable)
        assert "Limbo/score.py" in commands[0]


class TestTmhmm:
    def test_helix_lines_are_scored(self, dirs, monkeypatch):
        inputs, outputs = dirs
        # the (patched) tmhmm script prints "<region> <start> <end>" per line
        content = "outside 1 2\nTMhelix 3 5\ninside 6 8\n"
        monkeypatch.setattr(tf.os, "system", lambda cmd: write_file(__import__("pathlib").Path(outputs), "outTmhmm", content))
        scores = scores_for("A" * 8)
        tf.tmhmmEval("A" * 8, scores, {}, inputs, outputs, False, False)
        assert scores == [0, 0, 1, 1, 1, 0, 0, 0]


class TestPasta:
    def test_pairings_below_threshold_score_their_segment(self, dirs, monkeypatch):
        inputs, outputs = dirs
        # columns: 4 -> energy, 9 -> first segment, 11 -> second segment, 12 -> orientation
        line = "x x x x -7.0 x x x x 2-4 x 6-8 parallel\n"
        monkeypatch.setattr(tf.os, "system", lambda cmd: write_file(__import__("pathlib").Path(inputs), "seq-seq.best_pairings_list.pair.dat", line))
        scores = scores_for("A" * 8)
        tf.pastaSearch("A" * 8, scores, {"pastaThreshold": -5.5}, inputs, outputs, False, False)
        assert scores == [0, 1, 1, 1, 0, 0, 0, 0]

    def test_pairings_above_threshold_are_ignored(self, dirs, monkeypatch):
        inputs, outputs = dirs
        line = "x x x x -1.0 x x x x 2-4 x 6-8 parallel\n"
        monkeypatch.setattr(tf.os, "system", lambda cmd: write_file(__import__("pathlib").Path(inputs), "seq-seq.best_pairings_list.pair.dat", line))
        scores = scores_for("A" * 8)
        tf.pastaSearch("A" * 8, scores, {"pastaThreshold": -5.5}, inputs, outputs, False, False)
        assert scores == [0] * 8


class TestProsite:
    def fake_popen(self, output):
        def popen(cmd, **kwargs):
            assert cmd[0] == "perl"
            return SimpleNamespace(stdout=io.StringIO(output))

        return popen

    def test_hits_are_scored(self, monkeypatch):
        monkeypatch.setattr(tf.subprocess, "Popen", self.fake_popen("2 - 4 PS00001 some site\n"))
        scores = scores_for("A" * 6)
        tf.prositeSearch("A" * 6, scores, {}, "/in/", "/out/", False, False)
        assert scores == [0, 1, 1, 1, 0, 0]

    def test_no_hits_reports_in_detailed_output(self, monkeypatch, detailed):
        monkeypatch.setattr(tf.subprocess, "Popen", self.fake_popen(""))
        tf.prositeSearch("AAAA", scores_for("AAAA"), {}, "/in/", "/out/", False, True)
        assert "NO HITS FOUND" in detailed.getvalue()


class TestWaltz:
    def test_windows_above_threshold_score_six_positions(self, dirs, monkeypatch):
        inputs, outputs = dirs
        # one line per hexapeptide window: name, start, score
        output = "AAAAAA 1 10.0\nAAAAAA 2 90.0\nAAAAAA 3 10.0\n"
        monkeypatch.setattr(tf.subprocess, "Popen", lambda cmd, **kw: SimpleNamespace(stdout=io.StringIO(output)))
        scores = scores_for("A" * 8)
        tf.waltzSearch("A" * 8, scores, {"waltzThreshold": 79.0}, inputs, outputs, False, False)
        assert scores == [0, 1, 1, 1, 1, 1, 1, 0]


class TestTango:
    def test_positions_with_a_value_above_threshold_score_one(self, dirs, monkeypatch, tmp_path):
        inputs, outputs = dirs
        header = "header\n"
        rows = "1 A 0.0 0.0 0.0 0.0 0.0\n2 A 5.0 0.0 0.0 0.0 0.0\n3 A 0.0 0.0 0.0 0.0 0.0\n"
        monkeypatch.setattr(tf.os, "system", lambda cmd: write_file(__import__("pathlib").Path(outputs), "tangoResults.txt", header + rows))
        monkeypatch.setattr(tf, "base_path", str(tmp_path))
        scores = scores_for("AAA")
        tf.tangoSearch("AAA", scores, {"tangoThreshold": 1.0}, inputs, outputs, False, False)
        assert scores == [0, 1, 0]


BLAST_FIELDS = dict(expect=1e-10, match="AAA", sbjct="AAA", query="AAA", query_start=2, query_end=4)


def blast_record(with_hit=True):
    if not with_hit:
        return SimpleNamespace(alignments=[])
    hsp = SimpleNamespace(**BLAST_FIELDS)
    alignment = SimpleNamespace(hsps=[hsp], title="sp|P00001|TEST", length=3)
    return SimpleNamespace(alignments=[alignment])


class TestBlast:
    @pytest.fixture
    def local_blast(self, dirs, monkeypatch):
        inputs, outputs = dirs
        calls = []
        monkeypatch.setattr(tf.subprocess, "run", lambda cmd, **kw: calls.append((cmd, kw)))
        monkeypatch.setattr(tf, "NCBIXML", SimpleNamespace(parse=lambda handle: iter([blast_record()])))
        # blastp would write the xml, here we just need the file to exist for open()
        write_file(__import__("pathlib").Path(outputs), "outputBlast", "<xml/>")
        return inputs, outputs, calls

    def test_local_blast_runs_blastp_with_expected_arguments(self, local_blast):
        inputs, outputs, calls = local_blast
        tf.blastIt("AAAAAA", scores_for("AAAAAA"), "uniprot_sprot.fasta", inputs, outputs, False, False, False)
        cmd, kwargs = calls[0]
        assert cmd[0].endswith("ncbi-blast/bin/blastp")
        assert cmd[cmd.index("-db") + 1] == "uniprot_sprot.fasta"
        assert cmd[cmd.index("-outfmt") + 1] == "5"
        assert cmd[cmd.index("-evalue") + 1] == "0.001"
        assert kwargs["check"] is True

    def test_local_blast_writes_the_query_sequence(self, local_blast):
        inputs, outputs, _ = local_blast
        tf.blastIt("AAAAAA", scores_for("AAAAAA"), "db", inputs, outputs, False, False, False)
        assert open(inputs + "inputBlast").read() == "AAAAAA"

    def test_positions_outside_the_alignment_are_scored(self, local_blast):
        inputs, outputs, _ = local_blast
        scores = scores_for("AAAAAA")
        tf.blastIt("AAAAAA", scores, "db", inputs, outputs, False, False, False)
        # alignment covers 2..4 (1-based): outside of it every position scores, inside only identical residues
        assert scores == [1, 1, 1, 1, 1, 1]

    def test_conservative_substitutions_and_gaps_inside_the_alignment_are_not_scored(self, local_blast, monkeypatch):
        inputs, outputs, _ = local_blast
        record = blast_record()
        record.alignments[0].hsps[0].match = "A+ "
        monkeypatch.setattr(tf, "NCBIXML", SimpleNamespace(parse=lambda handle: iter([record])))
        scores = scores_for("AAAAAA")
        tf.blastIt("AAAAAA", scores, "db", inputs, outputs, False, False, False)
        assert scores == [1, 1, 0, 0, 1, 1]

    def test_no_alignment_means_no_score(self, dirs, monkeypatch):
        inputs, outputs = dirs
        monkeypatch.setattr(tf.subprocess, "run", lambda cmd, **kw: None)
        monkeypatch.setattr(tf, "NCBIXML", SimpleNamespace(parse=lambda handle: iter([blast_record(False)])))
        write_file(__import__("pathlib").Path(outputs), "outputBlast", "<xml/>")
        scores = scores_for("AAAAAA")
        tf.blastIt("AAAAAA", scores, "db", inputs, outputs, False, False, False)
        assert scores == [0] * 6

    def test_blastp_failure_is_propagated(self, dirs, monkeypatch):
        inputs, outputs = dirs

        def fail(cmd, **kw):
            raise subprocess.CalledProcessError(1, cmd)

        monkeypatch.setattr(tf.subprocess, "run", fail)
        with pytest.raises(subprocess.CalledProcessError):
            tf.blastIt("AAAAAA", scores_for("AAAAAA"), "db", inputs, outputs, False, False, False)

    def test_web_blast_uses_qblast_against_swissprot(self, dirs, monkeypatch):
        inputs, outputs = dirs
        qblast_calls = []
        monkeypatch.setattr(tf, "NCBIWWW", SimpleNamespace(qblast=lambda *a: qblast_calls.append(a) or "handle"))
        monkeypatch.setattr(tf, "NCBIXML", SimpleNamespace(parse=lambda handle: iter([blast_record()])))
        scores = scores_for("AAAAAA")
        tf.blastIt("AAAAAA", scores, "db", inputs, outputs, False, False, True)
        assert qblast_calls == [("blastp", "swissprot", "AAAAAA")]
        assert scores == [1, 1, 1, 1, 1, 1]


def test_every_registered_tool_is_callable():
    assert set(tf.tool_functions_dict) == {"ELM", "IUpred", "Tango", "Pasta", "Waltz", "Prosite", "Limbo", "Tmhmm", "Anchor", "Amyloid Pattern", "Net charge"}
    assert all(callable(f) for f in tf.tool_functions_dict.values())


def test_tools_path_points_to_the_tools_directory():
    import os

    assert os.path.isdir(tf.toolsPath)
    assert os.path.isfile(tf.toolsPath + "ELM/elm_patterns_20150301.txt")
