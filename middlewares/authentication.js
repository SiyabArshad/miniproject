const jwt = require("jsonwebtoken");
const ResponseManager = require("../helpers/CustomError");

function authenticate(req, res, next) {
  const authHeader = req.body.token || req.query.token || req.headers["token"];
  if (!authHeader) {
    return res.status(401).json(ResponseManager.errorResponse("You are not authenticated", 401));
  }

  const token = authHeader;
  jwt.verify(token, process.env.SECKEY, (err, user) => {
    if (err) {
      return res.status(403).json(ResponseManager.errorResponse("Token not valid", 403));
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticate };