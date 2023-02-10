import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../../errors';
import { Book } from '../../models/book';

import { User } from '../../models/user';

export const addBook = async (req: Request, res: Response) => {
  const { bookid } = req.params;

  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }
  const existingUser = await User.findById(req.currentUser!.id);

  if (!existingUser) {
    throw new NotFoundError('user not found');
  }

  existingUser.savedBookIds = existingUser.savedBookIds.filter(
    (currentBookId) => currentBookId.toString() !== bookid
  );

  existingUser.savedBookIds.unshift(bookid);
  await existingUser.save();
  return res.status(201).send({});
};
