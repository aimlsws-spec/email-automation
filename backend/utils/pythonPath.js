const path = require('path');
const fs = require('fs');

function findPythonProjectDir() {
  if (process.env.PYTHON_PROJECT_DIR) return process.env.PYTHON_PROJECT_DIR;

  let current = __dirname;
  while (current && current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, 'gmail_oauth.py'))) {
      return current;
    }
    current = path.dirname(current);
  }

  return path.resolve(__dirname, '../../../../../..');
}

module.exports = { findPythonProjectDir };
