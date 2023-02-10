import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../../errors';

import { User } from '../../models/user';

export const deleteBook = async (req: Request, res: Response) => {
  const { bookid } = req.params;

  const existinguser = await User.findById(req.currentUser!.id);
  if (!existinguser) {
    throw new NotFoundError('user not found');
  }
  const savedBooksIds = existinguser.savedBookIds;

  const updatedBookIds = savedBooksIds.filter(
    (currentBookId) => currentBookId.toString() !== bookid
  );

  existinguser!.savedBookIds = updatedBookIds;

  await existinguser!.save();
  return res.status(200).send({});
};
