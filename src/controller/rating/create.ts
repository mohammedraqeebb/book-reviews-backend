import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Rating, RatingDoc } from '../../models/rating';
import { BookRatings } from '../../models/book-ratings';
import { BadRequestError, NotFoundError } from '../../errors';
import { Book } from '../../models/book';

export const createRating = async (req: Request, res: Response) => {
  const { bookid } = req.params;

  const { rating: userRating } = req.body;

  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }
  const rating = Rating.build({
    rating: userRating,
    userId: req.currentUser!.id,
    bookId: existingBook.id.toString(),
  });
  await rating.save();

  let bookRatings = await BookRatings.findById(bookid).populate('ratings');
  if (!bookRatings) {
    const newBookRatings = BookRatings.build({
      id: bookid,
      ratings: [rating.id],
    });
    await newBookRatings.save();
    return res.status(201).send({ bookRatings: newBookRatings });
  } else if (bookRatings) {
    const userRatingFound = bookRatings.ratings.find(
      //@ts-ignore
      (currentBookRating: RatingDoc) =>
        currentBookRating.userId.toString() === req.currentUser!.id
    );
    if (userRatingFound) {
      throw new BadRequestError('only one rating allowed per user');
    }
    bookRatings.ratings.push(rating.id);
    await bookRatings.save();
  }

  res.status(201).send({ bookRatings });
};
