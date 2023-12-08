import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const user = new User({
    username,
    email,
    password: hashedPassword,
  });

  try {
    await user.save();
    res
      .status(201)
      .json({ message: 'User created Successfully.' });
  } catch (error) {
    next(errorHandler('signup', 500, error.message));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const found = await User.findOne({ email });

    if (!found) {
      return next(errorHandler('', 404, 'User not found.'));
    }

    const validPassword = bcryptjs.compareSync(
      password,
      found.password,
    );

    if (!validPassword) {
      return next(errorHandler('', 401, 'Wrong password.'));
    }

    const token = jwt.sign(
      { id: found._id },
      process.env.JWT_SECRET,
    );

    const { password: hashedPassword, ...rest } =
      found._doc;

    const expiredDate = new Date(Date.now() + 3600000); // 1 hour

    res
      .cookie('access_token', token, {
        httpOnly: true,
        expires: expiredDate,
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(errorHandler('signin', 500, error.message));
  }
};
