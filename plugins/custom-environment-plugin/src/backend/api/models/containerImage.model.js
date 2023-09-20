const { Schema, model } = require("mongoose");
const deletePlugin = require("mongoose-delete");

const ContainerImageSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    tag: {
      type: String,
      required: true,
    },
    gitUrl: {
      type: String,
      required: true,
      unique: true
    },
  },
  {
    timestamps: true,
  }
);

ContainerImageSchema.plugin(deletePlugin);

const ContainerImage = model("ContainerImage", ContainerImageSchema);
module.exports = ContainerImage;
