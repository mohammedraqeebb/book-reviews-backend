import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from '../../errors';
import { Book } from '../../models/book';
import { Rating } from '../../models/rating';

export const updateRating = async (req: Request, res: Response) => {
  const { bookid, ratingid } = req.params;
  const { rating: userRating } = req.body;

  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('product not found');
  }
  const existingRating = await Rating.findById(ratingid);

  if (!existingRating) {
    throw new NotFoundError('comment not found');
  }

  if (req.currentUser!.id !== existingRating.userId.toString()) {
    throw new UnauthorizedError('you are not authorized to edit');
  }

  existingRating.set({ rating: userRating });
  await existingRating.save();

  return res.status(200).send({ rating: existingRating });
};
