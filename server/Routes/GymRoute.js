const router = require("express").Router();
const {
  CreateGymPlan,
  GetGymplan,
  DeleteGymPlan,
  UpdateGymPlan,
} = require("../Controllers/GymPlanController");
router.post("/create-gymplan", CreateGymPlan);
router.get("/get-gymplan", GetGymplan);
router.delete("/delete-gymplan", DeleteGymPlan);
router.put("/update-gymplan", UpdateGymPlan);
module.exports = router;
