const { validationResult } = require("express-validator");
const {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} = require("http-status");

const { Scenario } = require("../models");
const { isValidObjectId } = require("mongoose");

class ScenarioController {
  // ADD NEW SCENARIO
  async addScenario(req, res) {
    const { name } = req.body;

    try {
      let scenario = await Scenario.findOne({ name });
      if (scenario) {
        return res.status(UNAUTHORIZED).json({
          success: false,
          status: UNAUTHORIZED,
          data: {
            message: "Already existing scenario with this name!",
          },
        });
      }

      scenario = new Scenario({
        name
      });

      // depending on git service and scenario name, create a new repository
      // if (gitService === 'Github') {
      //   process.env.GH_TOKEN = token;
      //   console.log("this is github", username)
      //   await exec(`git init`);
      //   await exec(`git remote add origin https://github.com/${username}/${name}.git`);
      // } else if (gitService === 'Gitlab') {
      //   await exec(`gitlab-cli repo create ${name} --user ${username} --token ${token}`)
      // } else if (gitService === 'Bitbucket') {
      //   await exec(`bitbucket repo create ${name} --username ${username} --token ${token}`)
      // } else {
      //   return res.status(BAD_REQUEST).json({
      //     success: false,
      //     status: BAD_REQUEST,
      //     data: {
      //       message: "Could not find this git service!",
      //     },
      //   });
      // }

      await scenario.save();

      return res.status(CREATED).json({
        success: true,
        status: CREATED,
        data: {
          message: "Scenario added sucessfully!",
          scenario,
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

  // GET SCENARIO BY ID
  async getScenario(req, res) {
    try {
      if (!isValidObjectId(req.params.id)) {
        return res.status(NOT_FOUND).json({
          success: false,
          status: NOT_FOUND,
          data: { message: "Cannot find scenario!" },
        });
      }

      const scenario = await Scenario.findOne({
        _id: req.params.id,
        deleted: false,
      }).select('-token -username');

      if (!scenario) {
        return res.status(NOT_FOUND).json({
          success: false,
          status: NOT_FOUND,
          data: { message: "Cannot find scenario!" },
        });
      }

      res.status(OK).json({
        success: true,
        status: OK,
        data: {
          message: "Scenario retrieved successfully!",
          scenario,
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

  // GET SCENARIO LIST
  async getScenarioList(req, res) {
    try {
      const scenarioList = await Scenario.find({ deleted: false }).sort({
        name: 1,
      }).select('-token -username');;

      if (scenarioList?.length < 1) {
        return res.status(NOT_FOUND).json({
          success: false,
          status: NOT_FOUND,
          data: { message: "Cannot find any scenarios!" },
        });
      }

      res.status(OK).json({
        success: true,
        status: OK,
        data: {
          message: "Scenario List retrieved successfully!",
          scenarioList,
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

module.exports = ScenarioController;
