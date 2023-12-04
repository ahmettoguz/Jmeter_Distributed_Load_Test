import dotenv from 'dotenv';
import runApp from './app/express';
import connectDB from './db/connectDB';

dotenv.config();
connectDB();

const app = runApp();

app.listen(process.env.PORT || 5000, () => console.info(`App is running on : http://localhost:${process.env.PORT || 5000}`));
