import db from "../../../../db/index";
import HelperService from "../../../../services/HelperService";

const jwt = require("jsonwebtoken");
const login = async (req, res) => {
  let isValid = true;
  let errorData = [];

  // get parameters
  let searchUser = {
    userName: req.body.userName,
    password: req.body.password,
  };

  // check inputs
  // TODO check işlemlerinin yapılması lazım.

  // check undefined
  if (searchUser.userName == undefined || searchUser.password == undefined)
    return HelperService.returnResponse(
      res,
      400,
      false,
      "Invalid input for login operation."
    );

  // check username is empty
  if (searchUser.userName.length == 0) {
    errorData.push("Username is required!");
    isValid = false;
  }

  // check password is empty
  if (searchUser.password.length == 0) {
    errorData.push("Password is required!");
    isValid = false;
  }

  if (!isValid)
    return HelperService.returnResponse(
      res,
      400,
      false,
      "Invalid input for login operation.",
      errorData
    );

  try {
    // check username
    let foundUser = await db.User.findOne({
      userName: searchUser.userName,
    });

    if (foundUser == null) {
      return HelperService.returnResponse(
        res,
        400,
        false,
        "Login operation is unsuccessful",
        ["No user with provided username."]
      );
    }

    // check username and password
    foundUser = await db.User.findOne({
      userName: searchUser.userName,
      password: searchUser.password,
    });

    if (foundUser == null) {
      return HelperService.returnResponse(
        res,
        400,
        false,
        "Login operation is unsuccessful",
        ["Wrong password provided."]
      );
    }

    // generate jwt token for 1 day
    const jwtDieTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1;
    const jwtToken = jwt.sign(
      {
        exp: jwtDieTime,
        data: {
          userId: foundUser._id.toString(),
        },
      },
      process.env.JWT_SECRET
    );

    // set token cookie for 1 day its not worked because we do not have secure connection (https) with different domain
    // const cookieDieTime = 1000 * 60 * 60 * 24 * 1;
    // res.cookie("accesstoken", `Bearer ${jwtToken}`, {
    //   maxAge: cookieDieTime,
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "None",
    // });

    res.setHeader("Authorization", `Bearer ${jwtToken}`);
    return HelperService.returnResponse(res, 200, true, "Login successful.");
  } catch (error) {
    return HelperService.returnResponse(
      res,
      500,
      false,
      "Internal server error for login operation."
    );
  }
};

export default login;
