import express, { type Express, type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from '../modules/user/routes';
import HelperService from '../services/HelperService';

const runApp = (): Express => {
    const app: Express = express();

    app.use(cors());
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));
    app.use(cookieParser());

    app.get('/', (req: Request, res: Response) => {
        HelperService.returnResponse(res, 200, true, 'Service is up');
    });

    app.use('/api/user', userRouter);
    return app;
};

export default runApp;
