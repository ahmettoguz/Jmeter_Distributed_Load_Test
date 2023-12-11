import { Router } from 'express';
import multer from '../services/Multer';
import route from '../endpoint';
import authService from "../services/AuthService";
import helperService from "../services/HelperService";

const userRouter: Router = Router();

// CRUD operations
userRouter.route('/userInfo').get(helperService.displayRequestInfo, authService.isJwtValid, route.userInfo);
userRouter.route('/login').post(helperService.displayRequestInfo, route.login);
userRouter.route('/signUp').post(helperService.displayRequestInfo ,route.signUp);

// run test
userRouter.route('/runTest').post(helperService.displayRequestInfo, multer.single('jmxFile'),authService.isJwtValid, route.runTest);

// result file sharing
userRouter.route('/result/:id/report/:id1/:id2/:id3/:id4/:id5/:fileId').get(route.getFileforSixDepth);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:id4/:fileId').get(route.getFileforFiveDepth);
userRouter.route('/result/:id/report/:id1/:id2/:id3/:fileId').get(route.getFileforFourDepth);
userRouter.route('/result/:id/report/:id1/:id2/:fileId').get(route.getFileforThreeDepth);
userRouter.route('/result/:id/report/:id1/:fileId').get(route.getFileforTwoDepth);
userRouter.route('/result/:id/report/:fileId').get(route.showResult);

export default userRouter;
