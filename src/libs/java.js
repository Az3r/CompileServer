const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { udir } = require('../utils');

const name = 'java';

async function compile(code) {
  const folder = udir();
  const file = path.join(folder, 'app.java');

  await fs.promises.writeFile(file, code);
  shell.exec(`javac ${file}`);
  return file.replace('.java', '');
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
