const express = require('express');

const shell = require('child_process');

const router = express.Router();

router.get('/', (req, res) => {
  shell.exec('dotnet --info', (e, stdout, stderr) => {
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

module.exports = router;
