import model from "../../model";

class Create {
  async insertTest(userId, virtualUser, testName) {
    try {
      const newTest = await model.Test.create({
        name: testName,
        finishedAt: "null",
        user: userId,
        virtualUser: virtualUser,
        status: "null",
        state: "initial",
      });
      const insertedId = newTest._id.toString();
      return insertedId;
    } catch (error) {
      console.error("insertTest: ", error);
      return null;
    }
  }
}

const create = new Create();

export default create;
