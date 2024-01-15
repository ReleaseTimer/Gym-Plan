// PrTrackerController.js
const PrTracker = require("../Models/PrTrackerModel");

// Add a new PR
exports.AddPr = async (req, res) => {
  const { name, weightKg, userID } = req.body;
  try {
    const newPr = await PrTracker.create({ name, weightKg, userID });
    res.status(201).json({ message: "PR added successfully", newPr });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all PRs for a user
exports.GetPrs = async (req, res) => {
  const { userID } = req.query;
  try {
    const prs = await PrTracker.find({ userID });
    if (prs.length === 0) {
      return res.status(404).json({ message: "No PRs found for this user" });
    }
    res.status(200).json(prs);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update an existing PR
exports.UpdatePr = async (req, res) => {
  const { id, name, weightKg } = req.body;
  try {
    const updatedPr = await PrTracker.findByIdAndUpdate(
      id,
      { name, weightKg },
      { new: true }
    );
    if (!updatedPr) {
      return res.status(404).json({ message: "PR not found" });
    }
    res.status(200).json({ message: "PR updated successfully", updatedPr });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a PR
exports.DeletePr = async (req, res) => {
  const { _id } = req.query;
  console.log(_id);
  try {
    //Checks if plan exist by ID.
    const planIDexist = await PrTracker.findOne({ _id });

    if (!planIDexist) {
      return res.status(404).json({ message: "Gym Day not Found" });
    }
    await PrTracker.findByIdAndDelete(_id);
    res.status(200).json({ message: "PR deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
