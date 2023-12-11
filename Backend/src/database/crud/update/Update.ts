import model from "../../model";

class Update {
  async updateUser(userId) {
    try {
      // const newTest = await model.Test.create({
      //   name: testName,
      //   finishedAt: "null",
      //   user: userId,
      //   virtualUser: virtualUser,
      //   status: "null",
      //   state: "initial",
      // });

      // const filter = {_id};
      // const newAttributes = {};

      // await model.User.findOneAndUpdate(filter, newAttributes);
    } catch (error) {
      console.error("insertTest: ", error);
      return null;
    }
  }
}

const update = new Update();

export default update;
