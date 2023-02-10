import { Request, Response } from 'express';
import { Book, BookDoc } from '../../models/book';

export const searchBook = async (req: Request, res: Response) => {
  const { bookSearchField } = req.body;
  const books = await Book.find({
    name: { $regex: bookSearchField, $options: 'i' },
  }).populate(['authorIds', 'publisherId']);

  return res.status(200).send({ books });
};
