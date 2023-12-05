import { Router } from 'express';
import multer from '../../services/Multer';
import controller from './controllers/index';

const userRouter: Router = Router();

userRouter.route('/login').post(controller.login);
userRouter.route('/runTest').post(multer.single('jmxFile'), controller.runTest);

export default userRouter;
