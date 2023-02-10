import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { Book, BookDoc } from '../../models/book';
import { User, UserDoc } from '../../models/user';
import { convertEachArrayIdToString } from '../../utils/convert-arrayids';
import {
  removeBookDislikeFromUser,
  removeUserDislikeFromBook,
} from './dislike';

const addUserLikeForBook = async (book: BookDoc, userId: string) => {
  book.likes.push(userId);
  await book.save();
  return;
};

const addBookLikeForUser = async (user: UserDoc, bookId: string) => {
  user.bookLikesIds.unshift(bookId);
  await user.save();
  return;
};

export const removeUserLikeFromBook = async (book: BookDoc, userId: string) => {
  const updatedLikes = book.likes.filter(
    (currentId) => currentId.toString() !== userId
  );
  book.likes = updatedLikes;
  await book.save();
  return;
};

export const removeBookLikeFromUser = async (user: UserDoc, bookId: string) => {
  const updatedLikes = user.bookLikesIds.filter(
    (currentId) => currentId.toString() !== bookId
  );
  user.bookLikesIds = updatedLikes;
  await user.save();
  return;
};

export const LikeOrRemoveLike = async (req: Request, res: Response) => {
  const { bookid, variant } = req.params;
  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }

  const existingUser = await User.findById(req.currentUser!.id);
  if (!existingUser) {
    throw new NotFoundError('user not found error');
  }

  const existingBookLikes = convertEachArrayIdToString(existingBook.likes);
  if (variant === 'add') {
    const userDislikeFound = existingBook.dislikes.map(
      (currentId) => currentId.toString() === req.currentUser!.id
    );

    const userLikeFound = existingBookLikes.find(
      (id) => id === req.currentUser!.id
    );
    if (userDislikeFound && !userLikeFound) {
      await Promise.all([
        removeUserDislikeFromBook(existingBook, req.currentUser!.id),
        removeBookDislikeFromUser(existingUser, bookid),
      ]);
      await Promise.all([
        addUserLikeForBook(existingBook, req.currentUser!.id),
        addBookLikeForUser(existingUser, bookid),
      ]);
    }
    if (!userLikeFound && !userDislikeFound) {
      await Promise.all([
        addUserLikeForBook(existingBook, req.currentUser!.id),
        addBookLikeForUser(existingUser, bookid),
      ]);
    }
  } else if (variant === 'remove') {
    const userLikeFound = existingBookLikes.find(
      (id) => id === req.currentUser!.id
    );
    if (userLikeFound) {
      await Promise.all([
        removeUserLikeFromBook(existingBook, req.currentUser!.id),
        removeBookLikeFromUser(existingUser, bookid),
      ]);
    }
  }

  return res.status(200).send({});
};
