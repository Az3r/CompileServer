const express = require('express');

const router = express.Router();

const base64 = require('base-64');

const { compilers } = require('../libs');

const map = {
  c: compilers.gcc,
  js: compilers.javascript,
  java: compilers.java,
};

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to my compile server - 👋🌎🌍🌏',
  });
});

router.get('/:compiler', async (req, res, next) => {
  const name = req.params.compiler;
  const lang = map[name];
  if (lang) {
    lang
      .version()
      .then((data) => res.status(200).json({ message: data }))
      .catch((error) => {
        res.status(500).json({ error });
      });
  } else next();
});
router.post('/:compiler', async (req, res, next) => {
  const name = req.params.compiler;
  const lang = map[name];
  if (lang) {
    // parse content
    const code = base64.decode(req.body.code);
    const input = base64.decode(req.body.input);
    const expected = base64.decode(req.body.expected);

    // run test code
    lang
      .test(code, input, expected)
      .then((result) => res.status(200).json({ result }))
      .catch((error) => res.status(400).json({ error }));
  } else next();
});

module.exports = router;
