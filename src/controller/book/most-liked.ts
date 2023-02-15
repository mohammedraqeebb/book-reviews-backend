import { Request, Response } from 'express';
import { Book } from '../../models/book';

export const mostLiked = async (req: Request, res: Response) => {
  const books = await Book.find({})
    .sort({ 'likes.length': -1 })
    .populate('authorIds')
    .limit(10);

  return res.status(200).send({ books });
};
