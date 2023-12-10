const jwt = require("jsonwebtoken");

class AuthService {
  private userId: String;

  constructor() {
    this.userId = null;
  }

  isJwtValid = async (req, res) => {
    console.log(req);
    const jwtToken = "get from request header";

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    console.log("Decoded", decoded);

    if (decoded === false) return false;

    this.userId = decoded.userId;
    console.log("userId:", this.userId);

    return true;
  };

  async getUserIdFromJwt(jwtToken) {
    return this.userId;
  }
}

const service = new AuthService();
export default service;
