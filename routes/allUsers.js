const express = require("express");
const router = express.Router();
const User = require("../models/User");
const fetchUser = require("../middlewares/fetchUser");
router.get("/", fetchUser, async (req, res) => {
  try {
    const id = req.user.id;

    const allUsers = await User.find({ _id: { $ne: id } }).select([
      "email",
      "username",
      "pro_pic",
      "_id",
    ]);
    return res.json(allUsers);
  } catch (error) {
    return res.json({ error });
  }
});

module.exports = router;
