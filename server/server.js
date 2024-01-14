//Importing Modules Required
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authroute = require("./Routes/AuthRoute");
const gymroute = require("./Routes/GymRoute");
//Used for hiding information
require("dotenv").config();
const { MONGODB_CON, PORT } = process.env;

console.log(`URL IS : ${MONGODB_CON} ${PORT}`);

//Attempts to connect to MongoDB, returns error if failed
try {
  mongoose
    .connect(MONGODB_CON, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MangoDB Sucessfully connected");
    });
} catch (error) {
  console.log(error);
}

//Listening Server
app.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});

//Allows CORS
app.use(
  cors({
    origin: [`http://localhost:3000`],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", authroute);
app.use("/", gymroute);

module.exports = app;
