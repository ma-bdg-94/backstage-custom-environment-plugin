const { Schema, model } = require("mongoose");
const deletePlugin = require("mongoose-delete");

const ScenarioSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

ScenarioSchema.plugin(deletePlugin);

const Scenario = model("Scenario", ScenarioSchema);
module.exports = Scenario;
