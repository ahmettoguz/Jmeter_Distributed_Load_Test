import helperService from "./HelperService";
const jwt = require("jsonwebtoken");

class AuthService {
  private userId: String;

  constructor() {
    this.userId = null;
  }

  isJwtValid = async (req, res, next) => {
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

    // validate token
    let decoded;
    try {
      decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    } catch (error) {
      return helperService.returnResponse(
        res,
        403,
        false,
        "Forbidden, authorization token is not valid!",
        error
      );
    }

    // get user id from jwt
    this.userId = decoded.data.userId;

    next();
  };

  async getUserIdFromJwt(jwtToken) {
    return this.userId;
  }
}

const service = new AuthService();
export default service;
