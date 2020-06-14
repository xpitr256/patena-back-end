const TYPE_ANALYSIS = 1;
const TYPE_DESIGN = 2;
const STATE_NOT_FOUND = 0;
const STATE_PENDING = 1;
const STATE_IN_PROGRESS = 2;
const STATE_FINISHED = 3;
const STATE_CANCELLED = 4;

const DESIGN_TYPE_NO_INITIAL_SEQUENCE = 1;
const DESIGN_TYPE_ONLY_INITIAL_SEQUENCE = 2;
const DESIGN_TYPE_ONLY_FLANKING_SEQUENCES = 3;
const DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES = 4;

// This represents the amount of amino acids we take before and after the flanking sequences.
const FLANKING_WINDOW_SIZE = 10;

module.exports = {
    TYPE_ANALYSIS,
    TYPE_DESIGN,
    STATE_NOT_FOUND,
    STATE_PENDING,
    STATE_IN_PROGRESS,
    STATE_FINISHED,
    STATE_CANCELLED,
    DESIGN_TYPE_NO_INITIAL_SEQUENCE,
    DESIGN_TYPE_ONLY_INITIAL_SEQUENCE,
    DESIGN_TYPE_ONLY_FLANKING_SEQUENCES,
    DESIGN_TYPE_INITIAL_AND_FLANKING_SEQUENCES,
    FLANKING_WINDOW_SIZE
}