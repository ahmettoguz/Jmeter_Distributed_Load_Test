import dotenv from 'dotenv';
import runApp from './src/app/express';
import connectDatabase from './src/database/connection';

dotenv.config();
connectDatabase();

const app = runApp();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.info(`App is running on : http://localhost:${PORT}`));
