import HelperService from "../../../../services/HelperService";
import db from "../../../../db/index";

const signUp = async (req, res) => {
  // account status and role is default [active, user]
  let newUser = {
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    email: req.body.email,
    password: req.body.password,
  };

  // check inputs
  if (0) {
    return HelperService.returnResponse(
      res,
      400,
      false,
      "Invalid input for sign up operation."
    );
  }

  try {
    // get free tier id from database
    const freeTier = await db.Tier.findOne({ name: "free" });
    newUser["tier"] = freeTier._id.toString();

    await db.User.create(newUser);
    return HelperService.returnResponse(res, 200, true, "Sign up successfull.");
  } catch (error) {
    return HelperService.returnResponse(
      res,
      500,
      false,
      "Internal server error for sing up operation."
    );
  }
};

export default signUp;
