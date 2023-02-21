import express, { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { User } from '../../models/user';
import jwt from 'jsonwebtoken';
export const userNameChange = async (req: Request, res: Response) => {
  const existingUser = await User.findById(req.currentUser!.id);
  if (!existingUser) {
    throw new NotFoundError('user not found');
  }
  const { name } = req.body;
  existingUser.set({ name });
  await existingUser.save();
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
