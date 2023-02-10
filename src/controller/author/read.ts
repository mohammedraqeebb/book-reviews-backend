import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { Author } from '../../models/author';

export const readAuthor = async (req: Request, res: Response) => {
  const { authorid } = req.params;
  const existingAuthor = await Author.findById(authorid).populate({
    path: 'booksId',
    populate: [{ path: 'authorIds' }, { path: 'publisherId' }],
  });
  if (!existingAuthor) {
    throw new NotFoundError('author not found');
  }
  return res.status(200).send({ author: existingAuthor });
};
