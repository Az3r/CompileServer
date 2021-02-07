const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { udir, execute, analyze } = require('../utils');

const name = 'c#';

async function compile(code) {
  const folder = await udir({
    prefix: name,
  });
  const project = path.join(folder, 'App');

  // create a dotnet project
  await shell.exec(`dotnet new console -o ${project}`);

  const iPath = path.join(project, 'Program.cs');
  const oPath = path.join(project, 'bin', 'App.dll');

  await fs.promises.writeFile(iPath, code);
  return shell
    .exec(`dotnet build ${project} -o ${path.dirname(oPath)}`)
    .then(() => oPath);
}

async function run(filePath, testcases) {
  const tasks = [];
  for (let i = 0; i < testcases.length; i += 1) {
    const { input, output } = testcases[i];
    const cmd = `echo '${input}' | dotnet ${filePath}`;
    tasks.push(execute(cmd, input, output));
  }

  const results = await Promise.all(tasks);
  return analyze(results);
}

async function test(code, testcases) {
  return compile(code).then((filePath) => run(filePath, testcases));
}

async function version() {
  return shell.exec('dotnet --info').then((result) => result.stdout);
}

module.exports = {
  name,
  version,
  test,
};
