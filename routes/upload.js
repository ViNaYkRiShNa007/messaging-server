const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fetchUser = require("../middlewares/fetchUser");
const User = require("../models/User");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
});

router.post("/", fetchUser, upload.single("file"), async (req, res) => {
  try {
    console.log(req.file);
    const user = req.user;
    const updated_user = await User.findByIdAndUpdate(user.id, {
      pro_pic: req.file.filename,
    });
    console.log(updated_user);
    return res.json(updated_user);
  } catch (error) {
    res.json({ error });
    console.log(error);
  }
});
module.exports = router;
