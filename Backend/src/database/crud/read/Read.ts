// import model from "../../model";
// import HelperService from "../../services/HelperService";

const jwt = require("jsonwebtoken");

class Read {
  async getUser(userId) {
    // model.User
    return "dummy user";
  }
}

const read = new Read();

export default read;
