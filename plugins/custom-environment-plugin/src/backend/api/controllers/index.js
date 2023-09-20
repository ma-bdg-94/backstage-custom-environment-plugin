const ScenarioController = require('./scenario.controller')
const ContainerImageController = require('./containerImage.controller')
const EnvironmentController = require('./environment.controller')

module.exports = {
  scenarioController: new ScenarioController(),
  containerImageController: new ContainerImageController(),
  environmentController: new EnvironmentController()
};