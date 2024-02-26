const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fetchUser = require("../middlewares/fetchUser");
router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    let new_user = req.body;
    let user_exists = await User.exists({ email: new_user.email });
    if (!user_exists) {
      const salt = await bcrypt.genSalt(10);
      const secure_password = await bcrypt.hash(new_user.password, salt);
      let created_new_user = await User.create({
        username: new_user.username,
        email: new_user.email,
        password: secure_password,
      });
      console.log(created_new_user);
      res.send("Created");
    } else {
      res.send("User exists");
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/login", async (req, res) => {
  let user = req.body;
  try {
    let userExists = await User.exists({ email: user.email });
    if (userExists) {
      let userCredentials = await User.findOne({ email: user.email });
      let isCorrectPassword = await bcrypt.compare(
        user.password,
        userCredentials.password
      );
      if (isCorrectPassword) {
        const userInfo = {
          id: userCredentials._id,
          email: userCredentials.email,
          username: userCredentials.username,
        };
        const auth_token = await jwt.sign(userInfo, process.env.JWT_SIGNATURE);
        res.json({
          message: "Login Successful",
          auth_token,
        });
      } else {
        res.json({
          message: "Invalid Credentials",
        });
      }
    } else {
      res.json({
        message: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      message: error.message,
    });
  }
  router.post("/getuser", fetchUser, async (req, res) => {
    try {
      const userID = req.user.id;
      const user = await User.findById(userID).select("-password");
      res.json(user);
    } catch (error) {
      res.json({
        message: error.message,
      });
    }
  });
  //
});

module.exports = router;
