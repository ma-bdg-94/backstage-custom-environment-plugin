const express = require("express");
const router = express.Router();

// import controllers
const { scenarioController } = require("../controllers");
const { addScenario, getScenarioList, getScenario } = scenarioController;

router.post("/", addScenario);

router.get("/", getScenarioList);
router.get("/:id", getScenario);

module.exports = router;
