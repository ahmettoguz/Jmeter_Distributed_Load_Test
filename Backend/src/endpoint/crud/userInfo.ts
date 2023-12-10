import authService from "../../services/AuthService";
import helperService from "../../services/HelperService";

import database from "../../database/crud/";

const userInfo = async (req, res) => {
  const userId = await authService.getUserIdFromJwt();

  console.log("id: ", userId);

  const user = await database.read.getUser(userId);
  return helperService.returnResponse(
    res,
    200,
    true,
    "User information has been successfully obtained.",
    user
  );
};

export default userInfo;
