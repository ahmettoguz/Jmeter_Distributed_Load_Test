import model from "../../model";
// import HelperService from "../../services/HelperService";

const jwt = require("jsonwebtoken");

class Read {
  async getUser(userId) {
    try {
      const user = await model.User.findOne({ _id: userId }).populate("tier");
      return user;
    } catch (error) {
      return null;
    }

    //TODO user id ile user tier ve test ler populate edilip verilecek
  }
}

const read = new Read();

export default read;
