const router = require("express").Router();
const {
  CreateGymPlan,
  GetGymplan,
  DeleteGymPlan,
  UpdateGymPlan,
  AddExercise,
  DeleteExercise,
} = require("../Controllers/GymPlanController");
router.post("/create-gymplan", CreateGymPlan);
router.get("/get-gymplan", GetGymplan);
router.delete("/delete-gymplan", DeleteGymPlan);
router.put("/update-gymplan", UpdateGymPlan);
router.put("/add-exercise", AddExercise);
router.delete("/delete-exercise", DeleteExercise);
module.exports = router;
