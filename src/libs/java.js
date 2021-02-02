const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { udir } = require('../utils');

const name = 'java';

async function compile(code) {
  const folder = await udir({ prefix: 'java' });
  const file = path.join(folder, 'Program.java');

  await fs.promises.writeFile(file, code);
  await shell.exec(`javac ${file}`);
  return file.replace('.java', '');
}

async function run(filePath, input, expected) {
  const dir = path.dirname(filePath);
  const file = path.basename(filePath);

  const cmd = `echo '${input}' | java -classpath ${dir} ${file}`;
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
  const { stderr } = await shell.exec('java -version');
  return stderr;
}

module.exports = {
  name,
  version,
  test,
};
