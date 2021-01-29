const express = require('express');

const gcc = require('./gcc');
const gpp = require('./gpp');
const dotnet = require('./dotnet');
const javac = require('./javac');
const javascript = require('./javascript');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/c', gcc);
router.use('/cpp', gpp);
router.use('/java', javac);
router.use('/csharp', dotnet);
router.use('/js', javascript);

module.exports = router;
