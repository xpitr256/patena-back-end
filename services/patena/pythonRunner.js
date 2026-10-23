const { PythonShell } = require("python-shell");

module.exports = {
  // python-shell >= 4 returns a promise; keep the node-style callback used by patenaService
  run: (scriptPath, options, callback) => {
    PythonShell.run(scriptPath, options).then(
      (results) => callback(null, results),
      (err) => callback(err)
    );
  },
};
