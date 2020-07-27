const expect = require("chai").expect;

const idGenerator = require("../../services/idGeneratorService");

describe("Id Generator Service", () => {
  it("should return an Id with exactly 36 characters", () => {
    const id = idGenerator.uuidv4();
    expect(id).to.have.lengthOf(36);
  });

  it('should return an Id with a "-" character at 8 position', () => {
    const id = idGenerator.uuidv4();
    expect(id[8]).to.be.equals("-");
  });

  it('should return an Id with a "-" character at 13 position', () => {
    const id = idGenerator.uuidv4();
    expect(id[13]).to.be.equals("-");
  });

  it('should return an Id with a "4" character at 14 position', () => {
    const id = idGenerator.uuidv4();
    expect(id[14]).to.be.equals("4");
  });

  it('should return an Id with a "-" character at 18 position', () => {
    const id = idGenerator.uuidv4();
    expect(id[18]).to.be.equals("-");
  });

  it('should return an Id with a "-" character at 22 position', () => {
    const id = idGenerator.uuidv4();
    expect(id[23]).to.be.equals("-");
  });
});
