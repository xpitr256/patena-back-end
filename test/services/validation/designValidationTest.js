const expect = require("chai").expect;

const designValidation = require("../../../services/validation/designValidation.js");

describe("Design Validation", () => {
  describe("isValidDesign", () => {
    it("should return false for no design information", () => {
      const result = designValidation.isValidDesign();
      expect(result).to.be.false;
    });

    it("should return false for no invalid design type", () => {
      const result = designValidation.isValidDesign({
        otherProperty: "test",
      });
      expect(result).to.be.false;
    });

    it("should return false for invalid design type", () => {
      const result = designValidation.isValidDesign({
        designType: 0,
      });
      expect(result).to.be.false;
    });

    it("should return false for invalid design type", () => {
      const result = designValidation.isValidDesign({
        designType: 0,
      });
      expect(result).to.be.false;
    });

    describe("with custom config", () => {
      let designData = {
        designType: 1,
        distance: 3.2,
        email: "valid@test.com",
      };

      it("should return false for no frequencies", () => {
        let data = Object.assign({}, designData);
        data.config = {};
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for empty frequencies array", () => {
        let data = Object.assign({}, designData);
        data.config = {
          frequencies: [],
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for not 100% frequencies sum", () => {
        let data = Object.assign({}, designData);
        data.config = {
          frequencies: [
            {
              value: 50,
            },
          ],
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for 99.9% frequencies sum", () => {
        let data = Object.assign({}, designData);
        data.config = {
          frequencies: [
            {
              value: 50,
            },
            {
              value: 49.9,
            },
          ],
          algorithms: [
            {
              active: true,
            },
          ],
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return true for 100% frequencies sum", () => {
        let data = Object.assign({}, designData);
        data.config = {
          frequencies: [
            {
              value: 50,
            },
            {
              value: 50,
            },
          ],
          algorithms: [
            {
              active: true,
            },
          ],
        };
        const result = designValidation.isValidDesign(designData);
        expect(result).to.be.true;
      });

      let validConfig = {
        frequencies: [
          {
            value: 50,
          },
          {
            value: 50,
          },
        ],
        algorithms: [
          {
            active: true,
          },
        ],
      };

      it("should return false for text net charge", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = "text";
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for numeric net charge but no initial sequence", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = 2;
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for numeric net charge but no initial sequence value", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = 2;
        data.initialSequence = {};
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for net charge bigger than initial sequence length", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = 3;
        data.initialSequence = {
          value: "AC",
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for negative net charge bigger in ABS than initial sequence length", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = -3;
        data.initialSequence = {
          value: "AC",
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for a float net charge value with valid initial sequence value", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = 1.24;
        data.initialSequence = {
          value: "AC",
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return true for no net charge and no initial sequence", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.true;
      });

      it("should return true for no net charge and an empty sequence", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.initialSequence = {};
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.true;
      });

      it("should return true for no net charge and valid initial sequence value", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.initialSequence = {
          value: "AC",
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.true;
      });

      it("should return true for valid positive net charge value with valid initial sequence value", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = 1;
        data.initialSequence = {
          value: "AC",
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.true;
      });

      it("should return true for valid negative net charge value with valid initial sequence value", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = -1;
        data.initialSequence = {
          value: "AC",
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.true;
      });

      it("should return true for zero net charge value with valid initial sequence value", () => {
        let data = Object.assign({}, designData);
        data.config = Object.assign({}, validConfig);
        data.config.netCharge = 0;
        data.initialSequence = {
          value: "AC",
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.true;
      });

      it("should return false for no algorithms ", () => {
        let data = Object.assign({}, designData);
        data.config = {
          frequencies: [
            {
              value: 100,
            },
          ],
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return false for no active algorithms ", () => {
        let data = Object.assign({}, designData);
        data.config = {
          frequencies: [
            {
              value: 100,
            },
          ],
          algorithms: [
            {
              active: false,
            },
          ],
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.false;
      });

      it("should return true for at least 1 active algorithms ", () => {
        let data = Object.assign({}, designData);
        data.config = {
          frequencies: [
            {
              value: 100,
            },
          ],
          algorithms: [
            {
              active: false,
            },
            {
              active: true,
            },
          ],
        };
        const result = designValidation.isValidDesign(data);
        expect(result).to.be.true;
      });
    });

    describe("for no initial sequence case", () => {
      it("should return false for invalid email", () => {
        const result = designValidation.isValidDesign({
          designType: 1,
          email: "wrongEmail",
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid distance", () => {
        const result = designValidation.isValidDesign({
          designType: 1,
          distance: -3.2,
        });
        expect(result).to.be.false;
      });

      it("should return true for valid distance", () => {
        const result = designValidation.isValidDesign({
          designType: 1,
          distance: 3.2,
        });
        expect(result).to.be.true;
      });

      it("should return true for valid distance and valid email", () => {
        const result = designValidation.isValidDesign({
          designType: 1,
          distance: 3.2,
          email: "valid@test.com",
        });
        expect(result).to.be.true;
      });
    });

    describe("for initial sequence case", () => {
      it("should return false for invalid email", () => {
        const result = designValidation.isValidDesign({
          designType: 2,
          email: "wrongEmail",
        });
        expect(result).to.be.false;
      });

      it("should return false for no initial sequence", () => {
        const result = designValidation.isValidDesign({
          designType: 2,
        });
        expect(result).to.be.false;
      });

      it("should return false for empty initial sequence", () => {
        const result = designValidation.isValidDesign({
          designType: 2,
          initialSequence: "",
        });
        expect(result).to.be.false;
      });

      it("should return false for empty initial sequence value", () => {
        const result = designValidation.isValidDesign({
          designType: 2,
          initialSequence: {
            value: "  ",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid amino acid in sequence", () => {
        const result = designValidation.isValidDesign({
          designType: 2,
          initialSequence: {
            value: "AAAAAACCCCCCCCCCCJ",
          },
        });
        expect(result).to.be.false;
      });

      it("should return true for valid sequence", () => {
        const result = designValidation.isValidDesign({
          designType: 2,
          initialSequence: {
            value: "AAAAAACCCCCCCCCCC",
          },
        });
        expect(result).to.be.true;
      });
    });

    describe("for only flanking sequences case", () => {
      it("should return false for invalid email", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          email: "wrongEmail",
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid distance", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: -3.2,
        });
        expect(result).to.be.false;
      });

      it("should return false for no flankingSequence1", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for no flankingSequence2", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence1: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for empty flankingSequence1", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence1: "",
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for empty flankingSequence2", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence2: "",
          flankingSequence1: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for empty flankingSequence1 value", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence1: {
            value: "  ",
          },
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for empty flankingSequence2 value", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence2: {
            value: "  ",
          },
          flankingSequence1: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid amino acid in flankingSequence1", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence1: {
            value: "AAAAAACCCCCCCCCCCJ",
          },
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid amino acid in flankingSequence2", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence2: {
            value: "AAAAAACCCCCCCCCCCJ",
          },
          flankingSequence1: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });
      it("should return true for valid flankingSequence1 and flankingSequence2", () => {
        const result = designValidation.isValidDesign({
          designType: 3,
          distance: 10,
          flankingSequence2: {
            value: "AAAAAACCCCCCCCCCC",
          },
          flankingSequence1: {
            value: "ACC",
          },
        });
        expect(result).to.be.true;
      });
    });

    describe("for initial and flanking sequences case", () => {
      it("should return false for invalid email", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          email: "wrongEmail",
        });
        expect(result).to.be.false;
      });

      it("should return false for no initialSequence", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          flankingSequence1: {
            value: "ACC",
          },
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for no flankingSequence1", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          initialSequence: {
            value: "ACC",
          },
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for no flankingSequence2", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          initialSequence: {
            value: "ACC",
          },
          flankingSequence1: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid amino acid in initialSequence", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          initialSequence: {
            value: "ACCJ",
          },
          flankingSequence1: {
            value: "AAAAAACCCCCCCCCCC",
          },
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid amino acid in flankingSequence1", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          initialSequence: {
            value: "ACC",
          },
          flankingSequence1: {
            value: "AAAAAACCCCCCCCCCCJ",
          },
          flankingSequence2: {
            value: "ACC",
          },
        });
        expect(result).to.be.false;
      });

      it("should return false for invalid amino acid in flankingSequence2", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          initialSequence: {
            value: "ACC",
          },
          flankingSequence1: {
            value: "CDE",
          },
          flankingSequence2: {
            value: "AAAAAACCCCCCCCCCCJ",
          },
        });
        expect(result).to.be.false;
      });

      it("should return true for valid initial and flanking sequences", () => {
        const result = designValidation.isValidDesign({
          designType: 4,
          initialSequence: {
            value: "ACC",
          },
          flankingSequence1: {
            value: "CDE",
          },
          flankingSequence2: {
            value: "FGH",
          },
        });
        expect(result).to.be.true;
      });
    });
  });
});
