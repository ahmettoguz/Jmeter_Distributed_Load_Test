import db from "../../../../db/index";
import HelperService from "../../../../services/HelperService";

// const jwt = require('jose');
// const bcrypt = require('bcryptjs');

const login = async (req, res) => {
//   let isValid = true;
//   let errorData = [];

//   // get parameters, account status and role is default [active, user]
//   let user = {
//     userName: req.body.userName,
//     firstName: req.body.firstName,
//     lastName: req.body.lastName,
//     phone: req.body.phone,
//     email: req.body.email,
//     password: req.body.password,
//   };

//   // check inputs
//   // TODO check işlemlerinin yapılması lazım.
//   // check username is empty
//   if (newUser.userName.length == 0) {
//     errorData.push("Username is required!");
//     isValid = false;
//   }

//   // check first name is empty
//   if (newUser.firstName.length == 0) {
//     errorData.push("First name is required!");
//     isValid = false;
//   }

//   if (!isValid)
//     return HelperService.returnResponse(
//       res,
//       400,
//       false,
//       "Invalid input for sign up operation.",
//       errorData
//     );

//   // perform insert operation in database
//   try {
//     // get free tier id from database
//     const freeTier = await db.Tier.findOne({ name: "free" });
//     newUser["tier"] = freeTier._id.toString();

//     await db.User.create(newUser);
//     return HelperService.returnResponse(res, 200, true, "Sign up successful.");
//   } catch (error) {
//     return HelperService.returnResponse(
//       res,
//       500,
//       false,
//       "Internal server error for sign up operation."
//     );
//   }

  // try {
  //     const { username, password } = req.body;
  //     if (!username || !password)
  //         return HelperService.returnResponse(res, 400, false, 'Missing or Incorrect Information');
  //     const user = await db.User.find({ username });
  //     if (user.length <= 0)
  //         return HelperService.returnResponse(res, 404, false, 'User Not Found!');
  //     if (user.length > 1)
  //         throw new Error('More Than One Username');
  //     if (!(await bcrypt.compare(password, user[0].password)))
  //         return HelperService.returnResponse(res, 403, false, 'Wrong Password!');
  //     if (user[0].accountStatus !== 'active' && user[0].accountStatus !== 'inactive')
  //         return HelperService.returnResponse(res, 404, false, `User Inactive! ${user[0].accountStatus}`);
  //     const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  //     const token = await new jwt.SignJWT({
  //         data: {
  //             username: user[0].userName,
  //             role: user[0].role,
  //         },
  //     })
  //         .setProtectedHeader({ alg: 'HS256' })
  //         .setExpirationTime('1h')
  //         .sign(secret);

  //     res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
  //     return HelperService.returnResponse(res, 200, true, 'Login successful.');
  // } catch (error) {
  //     console.error(error);
  //     return HelperService.returnResponse(res, 500, false, 'Internal server error for login operation.');
  // }
};

export default login;
