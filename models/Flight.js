const mongoose = require("mongoose");

const flightSchema = new mongoose.Schema(
  {
    airport: {
      type: String,
      required: true,
    },
    flightNumber: {
      type: String,
      required: true,
    },
    scheduleTime: {
      type: String,
      required: true,
    },
    avioCompany: {
      type: String,
      required: true,
    },
    terminal: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flight", flightSchema);
