import { Request, Response } from 'express';
import { Author } from '../../models/author';

export const createAuthor = async (req: Request, res: Response) => {
  const { name, dateOfBirth, gender, bio } = req.body;
  const author = Author.build({
    name,
    dateOfBirth,
    gender,
    bio,
    userId: req.currentUser!.id,
  });
  await author.save();
  return res.status(201).send({ author });
};
