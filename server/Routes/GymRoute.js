const router = require("express").Router();
const {
  CreateGymPlan,
  GetGymplan,
  DeleteGymPlan,
} = require("../Controllers/GymPlanController");
router.post("/create-gymplan", CreateGymPlan);
router.get("/get-gymplan", GetGymplan);
router.delete("/delete-gymplan", DeleteGymPlan);
module.exports = router;
