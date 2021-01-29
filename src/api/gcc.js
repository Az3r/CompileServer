const express = require('express');

const shell = require('child_process');

// const base64 = require('base-64');

// const fs = require('fs');

const router = express.Router();

router.get('/', (req, res) => {
  shell.exec('gcc --version', (e, stdout, stderr) => {
    if (!e) {
      res.status(200).json({
        stdout,
        stderr,
      });
    } else {
      res.status(500).json({
        error: {
          ...e,
          message: e.message,
        },
      });
    }
  });
});

/*
router.post('/', (req, res) => {
  // get content from body
  const content = base64.decode(req.body.base64_content);

  // write to file
  fs.writeFileSync('input.c', content);

  // use written file for gcc
  const cmd = 'gcc input.c -o output';
  shell.exec(
    cmd,
    {
      timeout: 1000,
    },
    (e, stdout, stderr) => {
      if (!e) {
        // it's wokring!!! 😀
        res.status(200).json({
          stdout,
          stderr,
        });
      } else {
        res.status(400).json({
          error: {
            ...e,
            message: e.message,
          },
        });
      }
    }
  );
});
*/

module.exports = router;
