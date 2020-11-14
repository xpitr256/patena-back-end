module.exports = {
  buildDatabaseWith(logger) {
    return {
      connect: () => {
        logger.log("databaseMock:: connected OK!");
      },
    };
  },
};
