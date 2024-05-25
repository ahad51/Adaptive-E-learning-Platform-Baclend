const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: true,
    },
    error: {
      type: String,
      required: true,
    },
    endPoint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("errorLogs", Schema);
