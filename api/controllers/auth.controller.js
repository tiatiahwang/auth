import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokens.js';

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
    res.status(201).json({ message: 'User created Successfully.' });
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

    const validPassword = bcryptjs.compareSync(password, found.password);

    if (!validPassword) {
      return next(errorHandler('', 401, 'Wrong password.'));
    }

    const accessToken = generateAccessToken(found._id);
    const refreshToken = generateRefreshToken(found._id);

    const { password: hashedPassword, ...rest } = found._doc;

    res
      .cookie('refresh_token', refreshToken, {
        httpOnly: true,
        sameSite: 'None',
        // secure: true,
        maxAge: 24 * 60 * 60 * 1000, // 1d
      })
      .status(200)
      .json({ accessToken, refreshToken, rest });
  } catch (error) {
    next(errorHandler('signin', 500, error.message));
  }
};

export const signout = async (req, res) => {
  res.clearCookie('refresh_token').status(200).json('Signed out successfully.');
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiredDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access token', token, {
          httpOnly: true,
          expires: expiredDate,
        })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const user = new User({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).slice(-8),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo ?? '',
      });
      await user.save();
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: hashedPassword2, ...rest } = user._doc;
      const expiredDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, {
          httpOnly: true,
          expires: expiredDate,
        })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(errorHandler('google login', 500, error.message));
  }
};

export const refreshToken = async (req, res) => {
  const { refresh_token: token } = req.cookies;

  if (!token) {
    return next(errorHandler('unauthorized token', 401, 'You are not authenticated.'));
  }

  try {
    const decoded = jwt.verify(token.toString(), process.env.JWT_REFRESH_SECRET);

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_ACCESS_SECRET, {
      expiresIn: '3s',
    });

    console.log('>>>>>>>>> AT');
    console.log(accessToken);
    res.json({ accessToken });
  } catch (e) {
    console.log(e);
  }
};
