import model from "../../model";
// import HelperService from "../../services/HelperService";

const jwt = require("jsonwebtoken");

class Read {
  async getUser(userId) {
    try {
      const tests = await this.getUserTests(userId);

      console.log("tests: ", tests);

      const user: any = await model.User.findOne({ _id: userId }).populate(
        "tier"
      );
      // remove password
      delete user["password"];

      console.log(user);

      return user;
    } catch (error) {
      console.error("getUser: ", error);
      return null;
    }
  }

  async getUserTests(userId) {
    try {
      const tests = await model.Test.find({ _id: userId });
      return tests;
    } catch (error) {
      console.error("getUserTests: ", error);
      return null;
    }
  }
}

const read = new Read();

export default read;
