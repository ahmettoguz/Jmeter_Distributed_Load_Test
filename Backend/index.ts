import dotenv from 'dotenv';
import runApp from './app/express';
import connectDB from './db/connection/connectDB';

dotenv.config();
connectDB();

const app = runApp();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.info(`App is running on : http://localhost:${PORT}`));
