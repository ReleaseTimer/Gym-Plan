const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const GymPlanSchema = new Schema({
  planName: {
    type: String,
    required: true,
  },

  userID: {
    type: String,
    required: true,
  },

  exercises: [
    {
      name: {
        type: String,
        required: true,
      },

      reps: {
        type: Number,
      },

      sets: {
        type: Number,
      },

      weightKg: {
        type: Number,
      },

      duration: {
        type: Number,
      },
    },
  ],
});

const GymPlanModel = model("GymPlan", GymPlanSchema);
module.exports = GymPlanModel;
