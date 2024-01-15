const router = require("express").Router();
const {
  Register,
  Login,
  CheckAuth,
  Logout,
  GetUserProfile,
  UpdateUserProfile,
  DeleteUser,
} = require("../Controllers/AuthController");
router.post("/register", Register);
router.post("/login", Login);
router.get("/check-auth", CheckAuth);
router.post("/logout", Logout);
router.get("/get-profile", GetUserProfile);
router.put("/update-profile", UpdateUserProfile);
router.delete("/delete-profile", DeleteUser);
module.exports = router;
