import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { Book } from '../../models/book';

export const readBook = async (req: Request, res: Response) => {
  const { bookid } = req.params;

  const existingBook = await Book.findById(bookid).populate([
    'authorIds',
    'publisherId',
    // 'ratings',
  ]);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }
  return res.status(200).send({ book: existingBook });
};
