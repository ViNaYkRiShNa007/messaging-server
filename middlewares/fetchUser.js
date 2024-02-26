const jwt = require("jsonwebtoken");
const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Invalid token");
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SIGNATURE);
    req.user = data;
    next();
  } catch (error) {
    return res.send(error.message);
  }
};
module.exports = fetchUser;
