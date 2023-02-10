import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { Publisher } from '../../models/publisher';

export const readPublisher = async (req: Request, res: Response) => {
  const { publisherid } = req.params;
  const existingPublisher = await Publisher.findById(publisherid).populate({
    path: 'booksId',
    populate: [{ path: 'authorIds' }, { path: 'publisherId' }],
  });
  if (!existingPublisher) {
    throw new NotFoundError('publisher not found');
  }
  return res.status(200).send({ publisher: existingPublisher });
};
