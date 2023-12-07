import bcryptjs from 'bcryptjs';

import User from '../models/user.model.js';

export const signup = async (req, res) => {
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
    res
      .status(500)
      .json({ message: `Signup error: ${error.message}` });
  }
};
