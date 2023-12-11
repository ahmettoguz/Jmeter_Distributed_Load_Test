import model from "../../model";

class Update {
  async updateUser(userId, req) {
    // TODO add check to new attributes
    try {
      const newAttributes = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        profileBanner: req.body.profileBanner,
        profilePicture: req.body.profilePicture,
      };
      const filter = { _id: userId };

      console.log(newAttributes);

      const c =await model.User.findOneAndUpdate(filter, newAttributes);
      console.log(c);
      return true;
    } catch (error) {
      console.error("updateUser error: ", error);
      return null;
    }
  }
}

const update = new Update();

export default update;
