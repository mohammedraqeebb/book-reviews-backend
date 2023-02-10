import { Request, Response } from 'express';
import { Author } from '../../models/author';

export const searchAuthor = async (req: Request, res: Response) => {
  const { searchAuthorField } = req.body;

  const authorsList = await Author.find({
    name: { $regex: searchAuthorField, $options: 'i' },
  });
  return res.status(200).send({ authors: authorsList });
};
