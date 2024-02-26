const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const auth = require("./routes/auth");
const app = express();
const upload = require("./routes/upload");
const allusers = require("./routes/allUsers");
const messages = require("./routes/getmessages");
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/auth", auth);
app.use("/upload", upload);
app.use("/allusers", allusers);
app.use("/messages", messages);

PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("MongoDB connected Successfully");
  })
  .catch((error) => {
    console.log(error.message);
  });

app.get("/", (req, res) => {
  res.send("This is whatsapp backend");
});

const io = socket(server, {
  cors: { origin: process.env.ORIGIN, credentials: true },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    } else {
      console.log(0);
    }
  });
});
