const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { udir, execute, analyze } = require('../utils');

const name = 'python3';

async function compile(code) {
  const folder = await udir({ prefix: name });
  const file = path.join(folder, 'main.py');

  await fs.promises.writeFile(file, code);
  return file;
}

async function run(filePath, testcases) {
  const tasks = [];
  for (let i = 0; i < testcases.length; i += 1) {
    const { input, output } = testcases[i];
    const cmd = `echo '${input}' | python3 ${filePath}`;
    tasks.push(execute(cmd, input, output));
  }

  const results = await Promise.all(tasks);
  return analyze(results);
}

async function test(code, testcases) {
  return compile(code).then((filePath) => run(filePath, testcases));
}

async function version() {
  const { stdout } = await shell.exec('python3 --version');
  return stdout;
}

module.exports = {
  name,
  version,
  test,
};
