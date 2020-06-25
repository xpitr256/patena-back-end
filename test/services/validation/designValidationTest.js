const expect = require('chai').expect;

const designValidation = require('../../../services/validation/designValidation.js');

describe('Design Validation',() => {

    describe('isValidDesign' , () => {

        it('should return false for no design information', () => {
            const result = designValidation.isValidDesign();
            expect(result).to.be.false;
        });

        it('should return false for no invalid design type', () => {
            const result = designValidation.isValidDesign({
                otherProperty: 'test'
            });
            expect(result).to.be.false;
        });

        it('should return false for invalid design type', () => {
            const result = designValidation.isValidDesign({
                designType: 0
            });
            expect(result).to.be.false;
        });

        it('should return false for invalid design type', () => {
            const result = designValidation.isValidDesign({
                designType: 0
            });
            expect(result).to.be.false;
        });

        describe('for no initial sequence case', () => {
            it('should return false for invalid email', () => {
                const result = designValidation.isValidDesign({
                    designType: 1,
                    email: 'wrongEmail'
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid distance', () => {
                const result = designValidation.isValidDesign({
                    designType: 1,
                    distance: -3.2
                });
                expect(result).to.be.false;
            });

            it('should return true for valid distance', () => {
                const result = designValidation.isValidDesign({
                    designType: 1,
                    distance: 3.2
                });
                expect(result).to.be.true;
            });

            it('should return true for valid distance and valid email', () => {
                const result = designValidation.isValidDesign({
                    designType: 1,
                    distance: 3.2,
                    email: 'valid@test.com'
                });
                expect(result).to.be.true;
            });
        });

        describe('for initial sequence case', () => {
            it('should return false for invalid email', () => {
                const result = designValidation.isValidDesign({
                    designType: 2,
                    email: 'wrongEmail'
                });
                expect(result).to.be.false;
            });

            it('should return false for no initial sequence', () => {
                const result = designValidation.isValidDesign({
                    designType: 2,
                });
                expect(result).to.be.false;
            });

            it('should return false for empty initial sequence', () => {
                const result = designValidation.isValidDesign({
                    designType: 2,
                    initialSequence: ''
                });
                expect(result).to.be.false;
            });

            it('should return false for empty initial sequence value', () => {
                const result = designValidation.isValidDesign({
                    designType: 2,
                    initialSequence: {
                        value: '  '
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid amino acid in sequence', () => {
                const result = designValidation.isValidDesign({
                    designType: 2,
                    initialSequence: {
                        value:  'AAAAAABBBBBBCCCCCJ'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return true for valid sequence', () => {
                const result = designValidation.isValidDesign({
                    designType: 2,
                    initialSequence: {
                        value:  'AAAAAABBBBBBCCCCC'
                    }
                });
                expect(result).to.be.true;
            });
        });

        describe('for only flanking sequences case', () => {
            it('should return false for invalid email', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    email: 'wrongEmail'
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid distance', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: -3.2
                });
                expect(result).to.be.false;
            });

            it('should return false for no flankingSequence1', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for no flankingSequence2', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence1: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for empty flankingSequence1', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence1: '',
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for empty flankingSequence2', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence2: '',
                    flankingSequence1: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for empty flankingSequence1 value', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence1: {
                        value: '  '
                    },
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for empty flankingSequence2 value', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence2: {
                        value: '  '
                    },
                    flankingSequence1: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid amino acid in flankingSequence1', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence1: {
                        value:  'AAAAAABBBBBBCCCCCJ'
                    },
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid amino acid in flankingSequence2', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence2: {
                        value:  'AAAAAABBBBBBCCCCCJ'
                    },
                    flankingSequence1: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });
            it('should return true for valid flankingSequence1 and flankingSequence2', () => {
                const result = designValidation.isValidDesign({
                    designType: 3,
                    distance: 10,
                    flankingSequence2: {
                        value:  'AAAAAABBBBBBCCCCC'
                    },
                    flankingSequence1: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.true;
            });
        });

        describe('for initial and flanking sequences case', () => {

            it('should return false for invalid email', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    email: 'wrongEmail'
                });
                expect(result).to.be.false;
            });

            it('should return false for no initialSequence', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    flankingSequence1: {
                        value: 'ABC'
                    },
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for no flankingSequence1', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    initialSequence: {
                        value: 'ABC'
                    },
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for no flankingSequence2', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    initialSequence: {
                        value: 'ABC'
                    },
                    flankingSequence1: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid amino acid in initialSequence', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    initialSequence: {
                        value: 'ABCJ'
                    },
                    flankingSequence1: {
                        value:  'AAAAAABBBBBBCCCCC'
                    },
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid amino acid in flankingSequence1', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    initialSequence: {
                        value: 'ABC'
                    },
                    flankingSequence1: {
                        value:  'AAAAAABBBBBBCCCCCJ'
                    },
                    flankingSequence2: {
                        value:'ABC'
                    }
                });
                expect(result).to.be.false;
            });

            it('should return false for invalid amino acid in flankingSequence2', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    initialSequence: {
                        value: 'ABC'
                    },
                    flankingSequence1: {
                        value:  'CDE'
                    },
                    flankingSequence2: {
                        value:'AAAAAABBBBBBCCCCCJ'
                    }
                });
                expect(result).to.be.false;
            });


            it('should return true for valid initial and flanking sequences', () => {
                const result = designValidation.isValidDesign({
                    designType: 4,
                    initialSequence: {
                        value: 'ABC'
                    },
                    flankingSequence1: {
                        value:  'CDE'
                    },
                    flankingSequence2: {
                        value:'FGH'
                    }
                });
                expect(result).to.be.true;
            });
        });


    });
});