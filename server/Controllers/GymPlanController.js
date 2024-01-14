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

module.exports.DeleteGymPlan = async (req, res) => {
  try {
    const { _id } = req.query;

    //Checks if plan exist by ID.
    const planIDexist = await GymPlan.findOne({ _id });

    if (!planIDexist) {
      return res.status(404).json({ message: "Gym Day not Found" });
    }

    //Delete by Id send by user
    await GymPlan.findByIdAndDelete({ _id });

    return res.status(204).json({ message: "Delete Sucessfully id: " + _id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.UpdateGymPlan = async (req, res) => {
  const { _id, planName } = req.body;
  const planIDexist = await GymPlan.findOne({ _id });

  if (!planIDexist) {
    return res.status(404).json({ message: "Gym Day not Found" });
  }
};

module.exports.UpdateGymPlan = async (req, res) => {
  try {
    const { planName, _id } = req.body;

    const planIDexist = await GymPlan.findOne({ _id });

    if (!planIDexist) {
      return res.status(404).json({ message: "Gym Day not Found" });
    }

    //Update an Gym Plan
    const updateGymPlan = await GymPlan.updateOne(
      { _id: { _id } },
      {
        planName,
      }
    );

    return res.status(202).json(updateGymPlan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//////////////Gym Plan Exercises Controller///////////////////////////

module.exports.AddExercise = async (req, res) => {
  try {
    const { _id, exercises } = req.body;

    console.log(_id, exercises);

    const updatedGymPlan = await GymPlan.findByIdAndUpdate(
      _id,
      { $push: { exercises: exercises } },
      { new: true }
    );

    if (!updatedGymPlan) {
      return res.status(404).json({ message: "Gym Plan not found" });
    }

    return res.status(200).json(updatedGymPlan);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
