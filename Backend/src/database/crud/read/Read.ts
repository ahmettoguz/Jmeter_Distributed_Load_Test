import model from "../../model";

const jwt = require("jsonwebtoken");

class Read {
  async getUser(userId) {
    try {
      // get user info with tier, I use lean because want to remove password. Lean does converting mongoose doc to js object
      const user: any = await model.User.findOne({ _id: userId })
        .populate("tier")
        .lean();
      // remove password
      delete user.password;

      // get user tests
      const tests = await this.getUserTests(userId);
      user.tests = tests;

      return user;
    } catch (error) {
      console.error("getUser: ", error);
      return null;
    }
  }

  async getUserTests(userId) {
    try {
      const tests = await model.Test.find({ user: userId });

      // remove ids from result
      const modifiedTests = tests.map((test) => {
        const { _id, user, ...rest } = test.toObject();
        return { ...rest, id: _id.toString() };
      });

      return modifiedTests;
    } catch (error) {
      console.error("getUserTests: ", error);
      return null;
    }
  }
}

const read = new Read();

export default read;
