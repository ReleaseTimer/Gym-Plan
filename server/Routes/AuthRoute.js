const router = require("express").Router();
const {
  Register,
  Login,
  CheckAuth,
  Logout,
  Profile,
} = require("../Controllers/AuthController");
router.post("/register", Register);
router.post("/login", Login);
router.get("/check-auth", CheckAuth);
router.post("/logout", Logout);

module.exports = router;
