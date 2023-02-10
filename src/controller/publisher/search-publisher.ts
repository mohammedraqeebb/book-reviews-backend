import { Request, Response } from 'express';
import { Publisher } from '../../models/publisher';

export const searchPublisher = async (req: Request, res: Response) => {
  const { searchPublisherField } = req.body;
  const publishersList = await Publisher.find({
    name: { $regex: searchPublisherField, $options: 'i' },
  });
  return res.status(200).send({ publishers: publishersList });
};
