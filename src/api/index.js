const express = require("express");

const gcc = require("./gcc");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/c", gcc);

module.exports = router;
