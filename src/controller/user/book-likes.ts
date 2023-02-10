import { Request, Response } from 'express';

import { User } from '../../models/user';

export const userBookLikes = async (req: Request, res: Response) => {
  const existingUser = await User.findById(req.currentUser!.id).populate(
    'bookLikesIds'
  );

  return res.status(200).send({ books: existingUser!.bookLikesIds });
};
