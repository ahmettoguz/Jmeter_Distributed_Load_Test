import model from "../../model";
// import HelperService from "../../services/HelperService";

const jwt = require("jsonwebtoken");

class Read {
  async getUser(userId) {
    try {
      const user: any = await model.User.findOne({ _id: userId });
      // const user: any = await model.User.findOne({ _id: userId }).populate("Tier");
      // const user: any = await model.User.findOne({ _id: userId }).populate("tier").populate("test");

      // remove password
      // delete user.data.password;

      return user;
    } catch (error) {
      return null;
    }

  }
}

const read = new Read();

export default read;
