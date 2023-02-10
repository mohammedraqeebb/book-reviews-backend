import { Request, Response } from 'express';
import { Publisher } from '../../models/publisher';

export const createPublisher = async (req: Request, res: Response) => {
  const {
    name,
    bio,
    street,
    state,
    country,
    countryCode,
    phoneNumber,
    establishedDate,
  } = req.body;
  const publisher = Publisher.build({
    name,
    bio,
    street,
    state,
    country,
    countryCode,
    phoneNumber,
    userId: req.currentUser!.id,
    establishedDate,
  });
  await publisher.save();
  return res.status(201).send({ publisher });
};
