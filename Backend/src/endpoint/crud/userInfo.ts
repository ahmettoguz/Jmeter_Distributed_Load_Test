import HelperService from "../../services/HelperService";
import db from "../../database/model";

import database from "../../database/crud/";

const userInfo = async (req, res) => {
  const user = await database.read.getUser(1);
  console.log(user);
};

export default userInfo;
