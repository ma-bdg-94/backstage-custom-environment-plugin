const { validationResult } = require('express-validator');
const fs = require('fs');
const { dump } = require('js-yaml');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const os = require('os');
const path = require('path');
const moment = require('moment');
const {
  BAD_REQUEST,
  CREATED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND,
  OK,
  UNAUTHORIZED,
} = require('http-status');

const { Scenario, Environment, ContainerImage } = require('../models');
const { isValidObjectId } = require('mongoose');

class EnvironmentController {
  // ADD NEW ENVIRONMENT
  async createEnvironment(req, res) {
    const { name, associatedScenario, associatedContainerImage } = req.body;
    const outputs = [];

    try {
      let environment = await Environment.findOne({
        name,
        associatedContainerImage,
      });
      if (environment) {
        return res.status(UNAUTHORIZED).json({
          success: false,
          status: UNAUTHORIZED,
          data: {
            message: 'Already existing environment with this data!',
          },
        });
      }

      let containerImage = await ContainerImage.findOne({
        _id: associatedContainerImage,
      });
      if (!containerImage) {
        return res.status(UNAUTHORIZED).json({
          success: false,
          status: UNAUTHORIZED,
          data: {
            message: 'Cannot find image with this data!',
          },
        });
      }

      let scenario = await Scenario.findOne({ _id: associatedScenario });
      if (!scenario) {
        return res.status(NOT_FOUND).json({
          success: false,
          status: NOT_FOUND,
          data: {
            message: 'Cannot find scenario with this data!',
          },
        });
      }

      // Define target directory to cloned repo
      const desktopDirectory = path.join(os.homedir(), 'Desktop');
      const environmentDirectoryName = 'Environments';
      const targetDirectory = path.join(
        desktopDirectory,
        environmentDirectoryName,
        name,
      );

      // Create directory if does not exist
      await util.promisify(fs.mkdir)(
        path.join(desktopDirectory, environmentDirectoryName),
        { recursive: true },
      );


      // Clone repository or throw error on fail
      const repoUrl = containerImage?.gitUrl;
      const gitCloneCommand = `git clone ${repoUrl} ${targetDirectory}`;
      const { stderr: cloneError, stdout: cloneOutput } = await exec(
        gitCloneCommand,
      );
      if (cloneError) {
        outputs.push({
          message: 'Repository cloned successfully',
          output: cloneError,
        });
      } else {
        outputs.push({
          message: 'Failed to clone repository',
          output: cloneOutput,
        });
      }

      // Create custom branch or throw error on fail
      const currentDateFormatted = moment()
        .format('DD-MMM-YYYY-HHmmss')
        .toString();
      const gitCheckoutCommand = `git checkout -b ${name}-${scenario?.name}-${currentDateFormatted}`;
      const { stderr: branchError, stdout: branchOutput } = await exec(
        gitCheckoutCommand,
        {
          cwd: targetDirectory,
        },
      );
      if (branchError) {
        outputs.push({
          message: 'Branch created successfully',
          output: branchError,
        });
      } else {
        outputs.push({
          message: 'Failed to create branch',
          output: branchOutput,
        });
      }

      // push the branch to the 'develop' branch
      const gitPushCommand = `git push origin ${name}-${scenario?.name}-${currentDateFormatted}:develop`;
      const { stderr: pushError, stdout: pushOutput } = await exec(
        gitPushCommand,
        {
          cwd: targetDirectory,
        },
      );
      if (pushError) {
        outputs.push({
          message: 'Branch pushed successfully',
          output: pushError,
        });
      } else {
        outputs.push({
          message: 'Failed to push changes',
          output: pushOutput,
        });
      }

      // Define the template for config.yaml
      const configTemplate = {
        environment: '',
        scenario: '',
        repo_url: '',
        container_image: '',
      };

      // Merge the template with the actual data
      const configData = {
        ...configTemplate,
        environment: name,
        scenario: scenario?.name,
        repo_url: containerImage?.gitUrl,
        container_image: containerImage?.name,
      };

      // Serialize the data to YAML format
      const configYaml = dump(configData);

      // Define the path to the config.yaml file
      const configFilePath = `${targetDirectory}/config.yaml`;

      if (!configYaml) {
        outputs.push({
          message: 'Failed to create or update config file',
          output: null,
        });
      }

      // Write the data to config.yaml (create the file if it doesn't exist)
      fs.writeFileSync(configFilePath, configYaml, 'utf8');
      outputs.push({
        message: 'Config file created successfuly',
        output: null,
      });

      // save environment in db
      environment = new Environment({
        name,
        associatedScenario,
        associatedContainerImage,
      });
      await environment.save();

      return res.status(CREATED).json({
        success: true,
        status: CREATED,
        data: {
          message: 'Environment added to database successfully!',
          outputs,
          environment,
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

module.exports = EnvironmentController;
