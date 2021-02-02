const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { udir } = require('../utils');

const name = 'javascript';

/**
 * this function does not compile code, just create a file to store it
 */
async function compile(code) {
  const folder = await udir({ prefix: 'js' });
  const file = path.join(folder, 'app.js');

  await fs.promises.writeFile(file, code);
  return file;
}

async function run(filePath, input, expected) {
  const cmd = `echo '${input}' | node ${filePath}`;
  const { stdout } = await shell.exec(cmd);
  const passed = stdout === expected;
  return {
    passed,
    input,
    output: stdout,
    expected,
  };
}

async function test(code, input, expected) {
  return compile(code).then((filePath) => run(filePath, input, expected));
}

async function version() {
  return shell.exec('node -v').then((result) => result.stdout);
}

module.exports = {
  name,
  version,
  test,
};
