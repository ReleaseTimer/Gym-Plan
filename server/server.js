//Importing Modules Required
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const authroute = require("./Routes/AuthRoute");
const gymroute = require("./Routes/GymRoute");
const prroute = require("./Routes/PrRoute");
const http = require("http");
const socketIo = require("socket.io");

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

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

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log("New WebSocket connection");

  // Handle chat message event
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg); // Emit message to all clients
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

//Listening Server
server.listen(PORT, () => {
  console.log(`Listening on Port: ${PORT}`);
});

//Allows CORS
app.use(
  cors({
    origin: [`http://localhost:3000`, "http://localhost:4000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/", authroute);
app.use("/", gymroute);
app.use("/", prroute);

module.exports = app;
