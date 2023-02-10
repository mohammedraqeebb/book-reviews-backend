import { Request, Response } from 'express';
import { BadRequestError, NotFoundError } from '../../errors';
import { Book } from '../../models/book';

import { User } from '../../models/user';

export const allSavedBooks = async (req: Request, res: Response) => {
  const existingUser = await User.findById(req.currentUser!.id);
  if (!existingUser) {
    throw new NotFoundError('user not found');
  }

  const savedBookIds = existingUser.savedBookIds;
  const savedBooks = [];
  for (let i = 0; i < savedBookIds.length; i++) {
    const book = await Book.findById(savedBookIds[i]).populate(
      'authorIds publisherId'
    );
    if (!book) {
      continue;
    }
    savedBooks.push(book);
  }
  return res
    .status(200)
    .send({ name: req.currentUser!.name, savedBooks: savedBooks });
};
