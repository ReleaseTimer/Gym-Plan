const router = require("express").Router();
const {
  AddPr,
  DeletePr,
  UpdatePr,
  GetPrs,
} = require("../Controllers/PrTrackerController");

router.post("/add-pr", AddPr);
router.get("/get-pr", GetPrs);
router.put("/update-pr", UpdatePr);
router.delete("/delete-pr", DeletePr);
module.exports = router;
