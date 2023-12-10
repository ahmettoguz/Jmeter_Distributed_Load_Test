// import model from "../../model";
// import HelperService from "../../services/HelperService";

const jwt = require("jsonwebtoken");

class Read {
  async getUser(userId) {

    //TODO user id ile user tier ve test ler populate edilip verilecek
    // model.User
    return "dummy user";
  }
}

const read = new Read();

export default read;
