const fs = require('fs');

const path = require('path');

const { v4: uuid } = require('uuid');
/**
 * Create an unique directory using uuid as directory's name
 */
async function udir({ prefix }) {
  const _prefix = prefix || '';
  const folder = path.join(process.env.PWD, 'runners', `${_prefix}-${uuid()}`);
  await fs.promises.mkdir(folder, { recursive: true });
  return folder;
}

exports.udir = udir;
