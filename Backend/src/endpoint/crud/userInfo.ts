import authService from "../../services/AuthService";
import helperService from "../../services/HelperService";

import database from "../../database/crud/";

const userInfo = async (req, res) => {
  console.log("info içerisinde");
  return helperService.returnResponse(res, 200, true, "USSER.");
};
// const user = await database.read.getUser(1);

export default userInfo;
