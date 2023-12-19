import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';

dotenv.config();

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log('Connected to mongoDB'))
  .catch((e) => console.log('DB connection error: ', e));

let corsOptions = {
  origitn: '*',
  credential: true,
};

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

app.listen(3000, () =>
  console.log('Server is running: https://localhost:3000'),
);

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error.';

  return res.status(statusCode).json({
    success: false,
    error: `${err.name}: ${message}`,
    statusCode,
  });
});
