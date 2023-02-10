import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { body } from 'express-validator';
import { Comment } from '../../models/comment';
import { BookComments } from '../../models/book-comments';
import { BadRequestError, NotFoundError } from '../../errors';
import { Book } from '../../models/book';

export const createComment = async (req: Request, res: Response) => {
  const { bookid } = req.params;

  const { comment: userComment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(bookid)) {
    throw new BadRequestError('valid bookid is required');
  }
  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }
  const comment = Comment.build({
    bookId: bookid,
    comment: userComment,
    commentorId: req.currentUser!.id,
  });
  await comment.save();

  const bookComments = await BookComments.findById(bookid);
  if (!bookComments) {
    const newBookComments = BookComments.build({
      id: bookid,
      comments: [comment.id],
    });
    await newBookComments.save();

    return res.status(201).send({});
  }

  bookComments!.comments.push(comment.id);
  await bookComments!.save();

  return res.status(200).send({});
};
