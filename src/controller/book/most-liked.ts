import { Request, Response } from 'express';
import { Book } from '../../models/book';

export const mostLiked = async (req: Request, res: Response) => {
  const books = await Book.find({});
  const topTenBooks = books
    .sort((a, b) => b.likes.length - a.likes.length)
    .slice(0, 10);

  return res.status(200).send({ books: topTenBooks });
};
