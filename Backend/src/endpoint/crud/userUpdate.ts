import authService from "../../services/AuthService";
import helperService from "../../services/HelperService";

import database from "../../database/crud/";
import { model } from "mongoose";

const userUpdate = async (req, res) => {
  const userId = await authService.getUserIdFromJwt();

  const status = await database.update.updateUser(userId, req);

  if (status == null)
    return helperService.returnResponse(
      res,
      500,
      false,
      "Internal server error for userUpdate operation."
    );

  return helperService.returnResponse(
    res,
    200,
    true,
    "User information is updated successfully."
  );
};

export default userUpdate;
