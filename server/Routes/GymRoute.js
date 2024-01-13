const router = require("express").Router();
const {
  CreateGymPlan,
  GetGymplan,
} = require("../Controllers/GymPlanController");
router.post("/create-gym", CreateGymPlan);
router.get("/get-gymplan", GetGymplan);
module.exports = router;
