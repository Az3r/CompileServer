const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { v4: uuid } = require('uuid');

const name = 'gcc';

async function compile(code) {
  const folder = path.join(process.env.PWD, 'runners', uuid());
  fs.promises.mkdir(folder, {
    recursive: true,
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

exports.compiler = {
  name,
  version,
  test,
};
