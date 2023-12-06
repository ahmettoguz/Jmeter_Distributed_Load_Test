import { Router } from 'express';
import multer from '../../services/Multer';
import controller from './controllers/index';

const userRouter: Router = Router();

userRouter.route('/login').post(controller.login);
userRouter.route('/runTest').post(multer.single('jmxFile'), controller.runTest);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:id4/:id5/:fileId').post(controller.getFileforSixDepth);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:id4/:fileId').post(controller.getFileforFiveDepth);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:fileId').post(controller.getFileforFourDepth);
userRouter.route('/result/:id/report/:id1/:id2/:fileId').post(controller.getFileforThreeDepth);
userRouter.route('/result/:id/report/:id1/:fileId').post(controller.getFileforTwoDepth);
userRouter.route('/result/:id/report/:fileId').post(controller.showResult);

export default userRouter;
