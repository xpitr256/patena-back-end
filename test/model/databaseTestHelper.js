const { MongoMemoryServer } = require("mongodb-memory-server");
const database = require("./../../model/database");

const server = new MongoMemoryServer();

const createInMemoryDataBase = async () => {
  try {
    const url = await server.getUri();
    await database.connect(url);
  } catch (err) {
    throw err;
  }
};

const destroyInMemoryDataBase = async () => {
  await database.disconnect();
  await server.stop();
};

module.exports = {
  createInMemoryDataBase,
  destroyInMemoryDataBase,
};
