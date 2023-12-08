import db from "../../../../db/index";
import HelperService from "../../../../services/HelperService";

// const jwt = require('jose');
// const bcrypt = require('bcryptjs');

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
      "Invalid input for sign up operation."
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

    // set token cookie to 1 day
    const cookieDieTime = 1000 * 60 * 60 * 24 * 1;
    res.cookie("accessToken", "TOKEN", {
      maxAge: cookieDieTime,
      httpOnly: true,
      secure: true,
    });
    console.log("cookies: ", JSON.stringify(req.cookies));

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
