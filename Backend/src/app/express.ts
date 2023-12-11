import express, { type Express, type Request, type Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import route from '../route';
import helperService from '../services/HelperService';

const runApp = (): Express => {
    const app: Express = express();

    // If you want to allow any origin (*) with credentials, you need to be aware that using * with credentials is not allowed due to security reasons.
    app.use(
        cors(),
    );
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ extended: false, limit: '50mb' }));

    app.get('/',helperService.displayRequestInfo, (req: Request, res: Response) => {
        helperService.returnResponse(res, 200, true, 'Service is up');
    });

    app.use('/api', route);
    return app;
};

export default runApp;
