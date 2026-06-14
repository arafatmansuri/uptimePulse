import express from 'express';
import v1Router from './routes/v1';
import { globalErrorHandler } from './lib/ErrorHandler';

const app = express();

app.use(express.json());

app.use('/api/v1', v1Router);
app.use(globalErrorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});