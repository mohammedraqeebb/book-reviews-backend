import { Request, Response } from 'express';
import { Book } from '../../models/book';

export const mostViewed = async (req: Request, res: Response) => {
  const books = await Book.find({}).sort({ views: -1 }).populate('authorIds');

  return res.status(200).send({ books });
};
