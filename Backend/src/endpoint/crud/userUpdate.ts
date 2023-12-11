import authService from "../../services/AuthService";
import helperService from "../../services/HelperService";

import database from "../../database/crud/";

const userInfo = async (req, res) => {
  const userId = await authService.getUserIdFromJwt();

  

  // return user info
  return helperService.returnResponse(
    res,
    200,
    true,
    "User information is updated successfully."
  );
};

export default userInfo;
