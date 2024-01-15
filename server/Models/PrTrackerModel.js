const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PrTrackerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  userID: {
    type: String,
    required: true,
  },

  weightKg: {
    type: Number,
    required: true,
  },
});
const PrTrackerModel = model("PrTracker", PrTrackerSchema);
module.exports = PrTrackerModel;
