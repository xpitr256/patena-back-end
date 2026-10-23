const { MongoMemoryServer } = require("mongodb-memory-server");
const database = require("./../../model/database");

let server;

const createInMemoryDataBase = async () => {
  try {
    server = await MongoMemoryServer.create();
    const url = server.getUri();
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
