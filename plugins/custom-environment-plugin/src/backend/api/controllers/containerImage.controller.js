const {
  INTERNAL_SERVER_ERROR,
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  CREATED,
} = require("http-status");

const { ContainerImage } = require("../models");
const { validationResult } = require("express-validator");

class ContainerImageController {
  // ADD NEW CONTAINER IMAGE
  async addImage(req, res) {
    const { name, tag, gitUrl } = req.body;

    try {
      let containerImage = await ContainerImage.findOne({ gitUrl });
      if (containerImage) {
        return res.status(UNAUTHORIZED).json({
          success: false,
          status: UNAUTHORIZED,
          data: {
            message: "Already existing image with this URL!",
          },
        });
      }

      containerImage = new ContainerImage({
        name,
        tag,
        gitUrl
      });

      await containerImage.save();

      return res.status(CREATED).json({
        success: true,
        status: CREATED,
        data: {
          message: "Image added sucessfully!",
          containerImage,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        status: INTERNAL_SERVER_ERROR,
        data: { message: error.message },
      });
    }
  }

  // GET CONTAINER IMAGE BY ID
  async getImageById(req, res) {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(NOT_FOUND).json({
          success: false,
          status: NOT_FOUND,
          data: { message: "Cannot find image!" },
        });
      }

      const containerImage = await ContainerImage.findOne({
        _id: req.params.id,
        deleted: false,
      });

      if (!containerImage) {
        return res.status(NOT_FOUND).json({
          success: false,
          status: NOT_FOUND,
          data: { message: "Cannot find image!" },
        });
      }

      res.status(OK).json({
        success: true,
        status: OK,
        data: {
          message: "Container image retrieved successfully!",
          containerImage,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        status: INTERNAL_SERVER_ERROR,
        data: { message: error.message },
      });
    }
  }

  // GET IMAGE LIST
  async getContainerImageList(req, res) {
    try {
      const imageList = await ContainerImage.find({ deleted: false }).sort({
        createdAt: -1,
      });

      return res.status(OK).json({
        success: true,
        status: OK,
        data: {
          message: "Container Image List retrieved successfully!",
          imageList,
        },
      });
    } catch (error) {
      console.error(error.message);
      res.status(INTERNAL_SERVER_ERROR).json({
        success: false,
        status: INTERNAL_SERVER_ERROR,
        data: { message: error.message },
      });
    }
  }
}

module.exports = ContainerImageController;
