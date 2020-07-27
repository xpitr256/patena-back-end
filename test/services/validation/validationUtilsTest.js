const expect = require("chai").expect;
const chai = require("chai");
const assertArrays = require("chai-arrays");
chai.use(assertArrays);

const utils = require("../../../services/validation/validationUtils.js");

describe("Validation Utils", () => {
  describe("isInt function", () => {
    it("should return false for string value", async () => {
      const result = utils.isInt("text");
      expect(result).to.be.false;
    });

    it("should return false for float value", async () => {
      const result = utils.isInt(4.5);
      expect(result).to.be.false;
    });

    it("should return false for negative float value", async () => {
      const result = utils.isInt(-4.5);
      expect(result).to.be.false;
    });

    it("should return true for zero", async () => {
      const result = utils.isInt(0);
      expect(result).to.be.true;
    });

    it("should return true for positive integer", async () => {
      const result = utils.isInt(2);
      expect(result).to.be.true;
    });

    it("should return true for negative integer", async () => {
      const result = utils.isInt(-2);
      expect(result).to.be.true;
    });

    it("should return false for undefined", async () => {
      const result = utils.isInt();
      expect(result).to.be.false;
    });

    it("should return false for null", async () => {
      const result = utils.isInt(null);
      expect(result).to.be.false;
    });

    it("should return true for text numbers", async () => {
      const result = utils.isInt("4");
      expect(result).to.be.true;
    });
  });

  describe("isPositiveDecimal function", () => {
    it("should return false for string value", async () => {
      const result = utils.isPositiveDecimal("text");
      expect(result).to.be.false;
    });

    it("should return true for float value", async () => {
      const result = utils.isPositiveDecimal(4.5);
      expect(result).to.be.true;
    });

    it("should return false for negative float value", async () => {
      const result = utils.isPositiveDecimal(-4.5);
      expect(result).to.be.false;
    });

    it("should return true for zero", async () => {
      const result = utils.isPositiveDecimal(0);
      expect(result).to.be.true;
    });

    it("should return true for positive integer", async () => {
      const result = utils.isPositiveDecimal(2);
      expect(result).to.be.true;
    });

    it("should return true for negative integer", async () => {
      const result = utils.isPositiveDecimal(-2);
      expect(result).to.be.false;
    });

    it("should return false for undefined", async () => {
      const result = utils.isPositiveDecimal();
      expect(result).to.be.false;
    });

    it("should return false for null", async () => {
      const result = utils.isPositiveDecimal(null);
      expect(result).to.be.false;
    });

    it("should return true for text numbers", async () => {
      const result = utils.isPositiveDecimal("4.3");
      expect(result).to.be.true;
    });
  });

  describe("isValidMail function", () => {
    it("should return false for empty email", () => {
      const result = utils.isValidMail();
      expect(result).to.be.false;
    });

    it("should return false for invalid email", () => {
      const result = utils.isValidMail("text");
      expect(result).to.be.false;
    });

    it("should return false for incomplete email", () => {
      const result = utils.isValidMail("text@");
      expect(result).to.be.false;
    });

    it("should return false for null email", () => {
      const result = utils.isValidMail(null);
      expect(result).to.be.false;
    });

    it("should return false for only last part email", () => {
      const result = utils.isValidMail("@test.com");
      expect(result).to.be.false;
    });

    it("should return true for valid email", () => {
      const result = utils.isValidMail("test@test.com");
      expect(result).to.be.true;
    });

    it("should return false for empty valid email", () => {
      const result = utils.isValidMail("   ");
      expect(result).to.be.false;
    });
  });

  describe("exceedsFiftyCharacters function", () => {
    it("should return false for empty value", () => {
      const result = utils.exceedsFiftyCharacters();
      expect(result).to.be.false;
    });

    it("should return false for less than 50 character text", () => {
      const result = utils.isValidMail("text");
      expect(result).to.be.false;
    });

    it("should return false for exactly 50 character text", () => {
      const result = utils.exceedsFiftyCharacters(
        "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwx"
      );
      expect(result).to.be.false;
    });

    it("should return true for more than 50 character text", () => {
      const result = utils.exceedsFiftyCharacters(
        "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxy"
      );
      expect(result).to.be.true;
    });

    it("should return false for null text", () => {
      const result = utils.exceedsFiftyCharacters(null);
      expect(result).to.be.false;
    });

    it("should return false for empty  text", () => {
      const result = utils.exceedsFiftyCharacters("   ");
      expect(result).to.be.false;
    });
  });

  describe("isEmpty function", () => {
    it("should return true for empty value", () => {
      const result = utils.isEmpty();
      expect(result).to.be.true;
    });

    it("should return false for some text", () => {
      const result = utils.isEmpty("text");
      expect(result).to.be.false;
    });

    it("should return false for exactly 1 character text", () => {
      const result = utils.isEmpty("a");
      expect(result).to.be.false;
    });

    it("should return true for null text", () => {
      const result = utils.isEmpty(null);
      expect(result).to.be.true;
    });

    it("should return true for empty  text", () => {
      const result = utils.isEmpty("   ");
      expect(result).to.be.true;
    });
  });

  describe("hasThirtySixCharacters function", () => {
    it("should return false for empty value", () => {
      const result = utils.hasThirtySixCharacters();
      expect(result).to.be.false;
    });

    it("should return false for less than 36 character text", () => {
      const result = utils.hasThirtySixCharacters("text");
      expect(result).to.be.false;
    });

    it("should return true for exactly 36 character text", () => {
      const result = utils.hasThirtySixCharacters(
        "abcdefghijklmnopqrstuvwxyzabcdefghij"
      );
      expect(result).to.be.true;
    });

    it("should return false for more than 36 character text", () => {
      const result = utils.hasThirtySixCharacters(
        "abcdefghijklmnopqrstuvwxyzabcdefghijk"
      );
      expect(result).to.be.false;
    });

    it("should return false for null text", () => {
      const result = utils.hasThirtySixCharacters(null);
      expect(result).to.be.false;
    });

    it("should return false for empty  text", () => {
      const result = utils.hasThirtySixCharacters("   ");
      expect(result).to.be.false;
    });
  });

  describe("getAminoAcids function", () => {
    it("should return an array of 22 elements", () => {
      const result = utils.getAminoAcids();
      expect(result).to.be.array();
      expect(result).to.be.ofSize(20);
    });
  });
});
