module.exports = {
  buildLogger(printLogs) {
    return {
      log: (data) => {
        if (printLogs) {
          console.log(data);
        }
      },
      error: (data) => {
        if (printLogs) {
          console.error(data);
        }
      },
    };
  },
};
