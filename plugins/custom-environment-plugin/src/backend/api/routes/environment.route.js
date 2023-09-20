const express = require("express");
const router = express.Router();

// import controllers
const { environmentController } = require("../controllers");
const { createEnvironment } = environmentController;

router.post("/", createEnvironment);

module.exports = router;
