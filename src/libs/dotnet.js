const shell = require('child-process-promise');

const fs = require('fs');

const path = require('path');

const { udir } = require('../utils');

const name = 'dotnet';

async function compile(code) {
  const folder = await udir({
    prefix: 'c#',
  });

  // create a dotnet project
  await shell.exec(`dotnet new console -o ${folder}`);

  const iPath = path.join(folder, 'Program.cs');
  const oPath = path.join(folder, 'bin', `${folder}.dll`);

  await fs.promises.writeFile(iPath, code);
  return shell
    .exec(`dotnet build ${folder} -o ./${folder}/bin`)
    .then(() => oPath);
}

async function run(filePath, input, expected) {
  const cmd = `echo '${input}' | dotnet ${filePath}`;
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
  return shell.exec('dotnet --info').then((result) => result.stdout);
}

module.exports = {
  name,
  version,
  test,
};
