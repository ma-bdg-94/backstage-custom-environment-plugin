const express = require("express");
const router = express.Router();

// import controllers
const { containerImageController } = require("../controllers");
const { addImage, getContainerImageList, getImageById } = containerImageController;

router.post("/", addImage);

router.get("/", getContainerImageList);
router.get("/:id", getImageById);

module.exports = router;
