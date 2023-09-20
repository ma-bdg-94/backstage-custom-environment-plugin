const { Schema, model } = require("mongoose");
const deletePlugin = require("mongoose-delete");

const EnvironmentSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    associatedScenario: {
      type: Schema.Types.ObjectId,
      ref: 'Scenario',
    },
    associatedContainerImage: {
      type: Schema.Types.ObjectId,
      ref: 'ContainerImage',
    },
  },
  {
    timestamps: true,
  }
);

EnvironmentSchema.plugin(deletePlugin);

const Environment = model("Environment", EnvironmentSchema);
module.exports = Environment;
