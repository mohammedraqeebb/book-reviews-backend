import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { SigninType } from '../../models/user';
import { User } from '../../models/user';
import { BadRequestError } from '../../errors';

export const signup = async (req: Request, res: Response) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    throw new BadRequestError('email exists, try signing in');
  }

  const user = User.build(req.body);
  user.set({ type: SigninType.EmailAndPassword });
  await user.save();
  const token = jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    process.env.JWT_SECRET!
  );

  req.session = {
    jwt: token,
  };

  return res.status(201).send({ user });
};
