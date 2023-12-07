import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

mongoose
  .connect(process.env.MONGODB)
  .then(() => console.log('connected to mongoDB'))
  .catch((e) => console.log('DB connection error: ', e));

const app = express();

app.listen(3000, () =>
  console.log('Server running on 3000'),
);
