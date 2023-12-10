import model from "../../model";
// import HelperService from "../../services/HelperService";

const jwt = require("jsonwebtoken");

class Read {
  async getUser(userId) {
    try {
      // TODO test ler populate edilip verilecek
      const user: any = await model.User.findOne({ _id: userId }).populate(
        "tier"
      ).populate("test");

      // remove password
      delete user.data.password;

      return user;
    } catch (error) {
      return null;
    }

  }
}

const read = new Read();

export default read;
