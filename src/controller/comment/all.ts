import { Request, Response } from 'express';

import { BookComments } from '../../models/book-comments';

import { Book } from '../../models/book';
import { Comment, CommentDoc } from '../../models/comment';
import { NotFoundError } from '../../errors';

export const allComments = async (req: Request, res: Response) => {
  const { bookid } = req.params;

  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }

  let bookComments = await BookComments.findById(bookid);
  if (!bookComments) {
    return res.status(200).send({ comments: [] });
  }
  bookComments = await BookComments.findById(bookid).populate({
    path: 'comments',
    populate: [{ path: 'commentorId' }],
  });

  if (!req.currentUser) {
    return res.status(200).send({ comments: bookComments.comments });
  }

  //@ts-ignore
  const userComments = bookComments.comments
    //@ts-ignore
    .filter(
      (currentComment: CommentDoc) =>
        //@ts-ignore
        currentComment.commentorId.id.toString() === req.currentUser.id
    )
    .sort((a: any, b: any) => b.updatedAt - a.updatedAt); //@ts-ignore
  const otherComments = bookComments.comments.filter(
    (currentComment: CommentDoc) =>
      //@ts-ignore
      currentComment.commentorId.id.toString() !== req.currentUser.id
  );

  return res
    .status(200)
    .send({ comments: [...userComments, ...otherComments] });
};
