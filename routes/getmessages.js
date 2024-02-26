const express = require("express");
const router = express.Router();
const Messages = require("../models/messages");
const fetchUser = require("../middlewares/fetchUser");
router.post("/addmsg", fetchUser, async (req, res) => {
  try {
    const current_user = req.user;
    const { from, to, message } = req.body;
    const data = await Messages.create({
      message: {
        text: message,
      },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Added message" });
    else {
      return res.json({ msg: "Error" });
    }
  } catch (error) {
    return res.json({ error });
  }
});
router.post("/getmsg", fetchUser, async (req, res) => {
  try {
    const current_user = req.user;
    const { from, to } = req.body;
    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projected_messages = messages.map((message) => {
      return {
        self: message.sender.toString() === from,
        message: message.message.text,
      };
    });
    return res.json(projected_messages);
  } catch (error) {
    return res.json({ error });
  }
});

module.exports = router;
