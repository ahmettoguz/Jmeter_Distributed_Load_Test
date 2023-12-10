import helperService from "./HelperService";
const jwt = require("jsonwebtoken");

class AuthService {
  private userId: String;

  constructor() {
    this.userId = null;
  }

  isJwtValid = async (req, res) => {
    const authorizationHeader = req.headers.authorization;

    // check authorization header is provided
    if (
      authorizationHeader == null ||
      authorizationHeader === "null" ||
      authorizationHeader == undefined
    ) {
      return helperService.returnResponse(
        res,
        403,
        false,
        "Forbidden, authorization header not found!"
      );
    }

    const jwtToken = authorizationHeader.substring(7);

    let decoded;
    try {
      decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
      console.log(decoded);
    } catch (error) {
      console.log("cathce düşüyor");
      return false;
    }

    // get user id from jwt
    this.userId = decoded.data.userId;
    console.log("userId:", this.userId);

    return true;
  };

  async getUserIdFromJwt(jwtToken) {
    return this.userId;
  }
}

const service = new AuthService();
export default service;
