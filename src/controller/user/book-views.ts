import { Request, Response } from 'express';

import { User } from '../../models/user';

export const userBookViews = async (req: Request, res: Response) => {
  const existingUser = await User.findById(req.currentUser!.id).populate(
    'bookViewsIds'
  );

  return res.status(200).send({ books: existingUser!.bookViewsIds });
};
