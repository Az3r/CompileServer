const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { udir } = require('../utils');

const name = 'gcc';

async function compile(code) {
  const folder = await udir({
    prefix: 'c',
  });
  const iPath = path.join(folder, 'app.c');
  const oPath = path.join(folder, 'app.out');

  await fs.promises.writeFile(iPath, code);
  return shell.exec(`gcc ${iPath} -o ${oPath}`).then(() => oPath);
}

async function run(filePath, input, expected) {
  const cmd = `echo '${input}' | ${filePath}`;
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
  return shell.exec('gcc --version').then((result) => result.stdout);
}

module.exports = {
  name,
  version,
  test,
};
