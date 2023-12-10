import HelperService from '../../../../services/HelperService';
import db from '../../../../db/model/databaseModel';

const signUp = async (req, res) => {
    let isValid = true;
    const errorData = [];

    // get parameters, account status and role is default [active, user]
    const newUser = {
        userName: req.body.userName,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: req.body.password,
    };

    // check inputs
    // TODO check işlemlerinin yapılması lazım.

    // check undefined
    if (
        newUser.userName === undefined
    || newUser.firstName === undefined
    || newUser.lastName === undefined
    || newUser.phone === undefined
    || newUser.email === undefined
    || newUser.password === undefined
    )
        return HelperService.returnResponse(
            res,
            400,
            false,
            'Invalid input for sign up operation.',
        );

    // check username is empty
    if (newUser.userName.length === 0) {
        errorData.push('Username is required!');
        isValid = false;
    }

    // check first name is empty
    if (newUser.firstName.length === 0) {
        errorData.push('First name is required!');
        isValid = false;
    }

    if (!isValid)
        return HelperService.returnResponse(
            res,
            400,
            false,
            'Invalid input for sign up operation.',
            errorData,
        );

    // perform insert operation in database
    try {
    // get free tier id from database
        const freeTier = await db.Tier.findOne({ name: 'free' });
        newUser['tier'] = freeTier._id.toString();

        await db.User.create(newUser);
        return HelperService.returnResponse(res, 200, true, 'Sign up successful.');
    } catch (error) {
        return HelperService.returnResponse(
            res,
            500,
            false,
            'Internal server error for sign up operation.',
        );
    }
};

export default signUp;
