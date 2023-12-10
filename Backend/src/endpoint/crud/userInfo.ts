import authService from "../../services/AuthService";
import helperService from "../../services/HelperService";

import database from "../../database/crud/";

const userInfo = async (req, res) => {
  const userId = await authService.getUserIdFromJwt();
  const user = await database.read.getUser(userId);

  // check if there is any error
  if (user == null)
    return helperService.returnResponse(
      res,
      500,
      false,
      "Internal server error for userInfo operation."
    );

  // return user info
  return helperService.returnResponse(
    res,
    200,
    true,
    "User information has been successfully obtained.",
    user
  );
};

export default userInfo;
