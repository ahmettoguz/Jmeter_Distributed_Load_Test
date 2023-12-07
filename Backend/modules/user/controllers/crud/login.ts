import dotenv from 'dotenv';
import db from '../../../../db/index';
import HelperService from '../../../../services/HelperService';

const jwt = require('jose');
const bcrypt = require('bcryptjs');

dotenv.config();

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password)
            return HelperService.returnResponse(res, 400, false, 'Missing or Incorrect Information');
        const user = await db.User.find({ username });
        if (user.length <= 0)
            return HelperService.returnResponse(res, 404, false, 'User Not Found!');
        if (user.length > 1)
            throw new Error('More Than One Username');
        if (!(await bcrypt.compare(password, user[0].password)))
            return HelperService.returnResponse(res, 403, false, 'Wrong Password!');
        if (user[0].accountStatus !== 'active' && user[0].accountStatus !== 'inactive')
            return HelperService.returnResponse(res, 404, false, `User Inactive! ${user[0].accountStatus}`);
        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const token = await new jwt.SignJWT({
            data: {
                username: user[0].userName,
                role: user[0].role,
            },
        })
            .setProtectedHeader({ alg: 'HS256' })
            .setExpirationTime('1h')
            .sign(secret);

        res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
        return HelperService.returnResponse(res, 200, true, 'Login Successful!');
    } catch (error) {
        console.error(error);
        return HelperService.returnResponse(res, 500, false, 'Internal Server Error');
    }
};

export default login;
