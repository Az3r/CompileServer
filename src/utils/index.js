const fs = require('fs');

const path = require('path');

const { v4: uuid } = require('uuid');
/**
 * Create an unique directory using uuid as directory's name
 */
async function udir() {
  const folder = path.join(process.env.PWD, 'runners', uuid());
  await fs.promises.mkdir(folder, {
    recursive: true,
  });
  return folder;
}

exports.udir = udir;
