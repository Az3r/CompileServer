const fs = require('fs');

const path = require('path');

const shell = require('child-process-promise');

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

/**
 * Execute cmd with specified input and compare it's output to given expected
 * @param {*} cmd the shell command to execute
 * @param {*} input the content passed into stdin stream
 * @param {*} expected the content expected to be written to stdout stream
 */
async function execute(cmd, input, expected) {
  const { stdout: actual } = await shell.exec(cmd);
  const _expected = expected.trim();
  const _actual = actual.trim();
  const passed = _expected.trim() === _actual.trim();
  return {
    passed,
    input: input.trim(),
    expected: _expected,
    actual: passed ? undefined : _actual,
  };
}

/**
 * Analyze test case results
 * @param {*} results list of results after running all test cases
 */
function analyze(results) {
  const total = results.length;
  let totalPassed = 0;
  const failedIndexes = [];
  results.forEach((result, index) => {
    if (result.passed) totalPassed += 1;
    else failedIndexes.push(index);
  });
  return {
    total,
    passed: totalPassed,
    failed: total - totalPassed,
    failedIndexes: failedIndexes.length !== 0 ? failedIndexes : undefined,
    results,
  };
}

module.exports = {
  udir,
  execute,
  analyze,
};
