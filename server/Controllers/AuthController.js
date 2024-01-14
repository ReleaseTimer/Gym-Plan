const bcrypt = require("bcryptjs");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//Function to generate JWTOKEN
function genJwToken(id) {
  return jwt.sign({ id }, process.env.JWTOKEN, {
    expiresIn: "1h",
  });
}

module.exports.Register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: `${email} already registered` });
    }

    // Hashing the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Creating the user with the hashed password
    const createUser = await User.create({
      username,
      email,
      password: hashedPassword, // Storing hashed password
    });

    // Generating JWT token
    const token = genJwToken(createUser._id);

    // Sending the response
    res.status(201).json({
      message: "User successfully registered",
      token: token, // Optionally send the token
      user: { id: createUser._id, username, email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.Login = async (req, res) => {
  try {
    const { password, username } = req.body;
    const user = await User.findOne({ username });

    //Checking if users exits
    if (!user) {
      return res
        .status(400)
        .json({ message: `${email} not found, please register` });
    }

    console.log(user.id);
    //Comparing Password to Hash Password in Database
    const passwordMatch = await bcrypt.compare(password, user.password);

    //Generates JWTOKEN for authentications
    if (passwordMatch) {
      const token = genJwToken(user._id);
      res.cookie("token", token, {
        withCredentials: true,
        httpOnly: false,
      });
      res.status(200).json({ message: "User Authenticated", id: user.id });
      console.log(req.body);
    } else {
      res.status(401).json({ message: "Invalid credentials" });
      console.log(req.body);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.CheckAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const verified = jwt.verify(token, process.env.JWTOKEN);
    if (verified) {
      return res.status(200).json({ message: "Authenticated" });
    } else {
      return res.status(401).json({ message: "Unauthorized" + verified });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports.Logout = (req, res) => {
  res.clearCookie("token"); // Clear the cookie named 'token'
  res.status(200).json({ message: "Successfully logged out" });
};
