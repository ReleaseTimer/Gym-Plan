const GymPlan = require("../Models/GymModel");

module.exports.CreateGymPlan = async (req, res) => {
  try {
    const { userID, planName, exercises } = req.body;
    if (!userID || !planName || !exercises) {
      return res.status(422).json({ message: "Missing Feilds" });
    }
    console.log(req.body);
    const createGymPlan = await GymPlan.create({
      planName,
      userID,
      exercises,
    });

    res.status(201).json({ message: "Exercise Plan Created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.GetGymplan = async (req, res) => {
  try {
    const { userID } = req.query;

    if (!userID) {
      return res.status(204).json({ message: "No Data exist" });
    }

    const gymPlans = await GymPlan.find({ userID });

    if (!gymPlans.length) {
      return res
        .status(404)
        .json({ message: "No gym plans found for this email" });
    }

    res.status(200).json(gymPlans);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
