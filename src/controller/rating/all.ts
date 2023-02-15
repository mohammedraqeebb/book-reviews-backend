import { Request, Response } from 'express';
import mongoose from 'mongoose';

import { BookRatings } from '../../models/book-ratings';
import { BadRequestError, NotFoundError } from '../../errors';
import { Book } from '../../models/book';

export const allRatings = async (req: Request, res: Response) => {
  const { bookid } = req.params;

  if (!mongoose.Types.ObjectId.isValid(bookid)) {
    throw new BadRequestError('valid bookid is required');
  }
  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }

  const bookRatings = await BookRatings.findById(bookid).populate('ratings');

  if (!bookRatings) {
    return res.status(200).send({ ratings: [] });
  }

  res.status(200).send({ ratings: bookRatings.ratings });
};
