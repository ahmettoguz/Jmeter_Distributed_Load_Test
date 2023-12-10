import authService from "../../services/AuthService";
import helperService from "../../services/HelperService";

import database from "../../database/crud/";

const userInfo = async (req, res) => {
  console.log("info içerisinde");
  const user = await database.read.getUser(1);
  return helperService.returnResponse(res, 200, true, "USSER.");
};

export default userInfo;
