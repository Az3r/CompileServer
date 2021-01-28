const express = require('express');

const shell = require('child_process');

const router = express.Router();

router.get('/', (req, res) => {
  shell.exec(
    'gcc --version',
    {
      encoding: 'ascii',
      timeout: 1000,
    },
    (e, stdout, stderr) => {
      if (!e) {
        // it's wokring!!! 😀
        if (stdout.length !== 0) {
          res.status(200).json({
            message: stdout,
          });
        } else {
          res.status(501).json({
            error: stderr,
          });
        }
      } else {
        res.status(500).json({
          error: {
            code: e.code,
            message: e.message,
          },
        });
      }
    }
  );
});

router.post('/', (req, res) => {
  res.send(req.body);
});

module.exports = router;
