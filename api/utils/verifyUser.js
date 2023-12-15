import jwt from 'jsonwebtoken';

import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return next(
      errorHandler(
        'unauthorized token',
        401,
        'You are not authenticated.',
      ),
    );
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (error, user) => {
      if (error) {
        return next(
          errorHandler(
            'invalid token',
            403,
            'Token is invalid.',
          ),
        );
      }

      req.user = user;
      next();
    },
  );
};
