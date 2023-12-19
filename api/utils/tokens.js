import jwt from 'jsonwebtoken';

import { errorHandler } from './error.js';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, { expiresIn: '3s' });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '1d' });
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  if (!token) {
    return next(errorHandler('unauthorized token', 401, 'You are not authenticated.'));
  }

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (error, user) => {
    if (error) {
      return next(errorHandler('invalid token', 403, 'Token is invalid.'));
    }

    req.user = user;
    next();
  });
};
