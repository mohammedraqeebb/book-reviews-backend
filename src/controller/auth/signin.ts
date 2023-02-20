import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { BadRequestError } from '../../errors';
import { SigninType, User } from '../../models/user';
import { PasswordManager } from '../../utils/password-manager';

type UserCredentials = {
  email: string;
  password: string;
  type: SigninType;
};

interface SigninRequest<T> extends Request {
  body: T;
}

export const signin = async (
  req: SigninRequest<UserCredentials>,
  res: Response
) => {
  const { email, password, type } = req.body;
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError('email does not exist,try signing in');
  }

  const checkPassword = await PasswordManager.comparePassword(
    password,
    existingUser.password
  );

  if (!checkPassword) {
    throw new BadRequestError('password is incorrect');
  }
  if (type === SigninType.Google) {
    existingUser.set({ type: SigninType.Both });
    await existingUser.save();
  }

  const token = jwt.sign(
    {
      id: existingUser._id,
      email: existingUser.email,
      name: existingUser.name,
    },
    process.env.JWT_SECRET!
  );

  req.session = {
    jwt: token,
  };

  return res.status(200).send({ user: existingUser, token });
};
