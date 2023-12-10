import { Router } from 'express';
import multer from '../services/Multer';
import controller from './controllers/index';

const userRouter: Router = Router();

// CRUD operations
userRouter.route('/signUp').post(controller.signUp);
userRouter.route('/login').post(controller.login);

userRouter.route('/runTest').post(multer.single('jmxFile'), controller.runTest);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:id4/:id5/:fileId').get(controller.getFileforSixDepth);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:id4/:fileId').get(controller.getFileforFiveDepth);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:fileId').get(controller.getFileforFourDepth);
userRouter.route('/result/:id/report/:id1/:id2/:fileId').get(controller.getFileforThreeDepth);
userRouter.route('/result/:id/report/:id1/:fileId').get(controller.getFileforTwoDepth);
userRouter.route('/result/:id/report/:fileId').get(controller.showResult);

export default userRouter;
