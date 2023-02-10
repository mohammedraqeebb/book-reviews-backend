import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { User } from '../../models/user';

export const currentUser = async (req: Request, res: Response) => {
  const existingUser = await User.findById(req.currentUser!.id).populate([
    'bookViewsIds',
    'bookLikesIds',
  ]);
  if (!existingUser) {
    throw new NotFoundError('user not found');
  }
  return res.status(200).send({ user: existingUser });
};
