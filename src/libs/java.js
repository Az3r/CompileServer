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

async function execute(cmd, input, expected) {
  const { stdout: actual } = await shell.exec(cmd);
  const passed = expected.trim() === actual.trim();
  return {
    passed,
    input,
    expected,
    actual: passed ? undefined : actual,
  };
}

async function run(filePath, testcases) {
  const dir = path.dirname(filePath);
  const file = path.basename(filePath);

  const tasks = [];
  for (let i = 0; i < testcases.length; i += 1) {
    const { input, output } = testcases[i];
    const cmd = `echo '${input}' | java -classpath ${dir} ${file}`;
    tasks.push(execute(cmd, input, output));
  }

  const results = await Promise.all(tasks);
  const total = results.length;
  let totalPassed = 0;
  const failedPosition = [];
  results.forEach((result, index) => {
    if (result.passed) totalPassed += 1;
    else failedPosition.push(index);
  });
  return {
    total,
    passed: totalPassed,
    failed: total - totalPassed,
    failedIndices: failedPosition,
    testcases,
  };
}

async function test(code, testcases) {
  return compile(code).then((filePath) => run(filePath, testcases));
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
