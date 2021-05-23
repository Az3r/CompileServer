const express = require('express');

const router = express.Router();

const { compilers } = require('../libs');

const map = {
  c: compilers.gcc,
  js: compilers.javascript,
  java: compilers.java,
  csharp: compilers.dotnet,
  py3: compilers.python3,
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
    const { code, testcases } = req.body;
    lang
      .test(code, testcases)
      .then((result) => res.status(200).json(result))
      .catch((error) => {
        if (error.code === 137) error.stdout = 'timeout 3s';
        return res.status(400).json(error);
      });
  } else next();
});

module.exports = router;
