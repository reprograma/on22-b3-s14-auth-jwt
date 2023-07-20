const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

cas, next) => {
  const authHeader = req.get("authorization");

  if (!authHeader) {
    return res.status(401).json({
      message: "Você esqueceu de passar as informações de autorização",
    });
  }
  1;
  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET, (e) => {
    if (e) {
      return res.status(401).json({ message: e.message });
    }
  });
  next();
};

module.exports = auth