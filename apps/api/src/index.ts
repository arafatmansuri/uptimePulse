import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import { globalErrorHandler } from './lib/ErrorHandler';
import v1Router from './routes/v1';
import cors from "cors";
dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];
app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (allowedOrigins.indexOf(<string>origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allow cookies
  }),
);
app.use(cookieParser());

app.use('/api/v1', v1Router);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});