import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { env } from './config';
import { globalErrorHandler } from './lib/ErrorHandler';
import v1Router from './routes/v1';
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', v1Router);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});