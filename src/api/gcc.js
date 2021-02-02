const express = require('express');

const base64 = require('base-64');

const router = express.Router();

const { gcc } = require('../libs').compilers;

router.get('/', async (req, res) => {
  gcc
    .version()
    .then((data) => res.status(200).json({ message: data }))
    .catch((error) => {
      res.status(500).json({ error });
    });
});

router.post('/', async (req, res) => {
  const code = base64.decode(req.body.code);
  const input = base64.decode(req.body.input);
  const expected = base64.decode(req.body.expected);

  gcc
    .test(code, input, expected)
    .then((result) => res.status(200).json({ result }))
    .catch((error) => res.status(400).json({ error }));
});

module.exports = router;
