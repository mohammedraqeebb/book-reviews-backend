import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { Book, BookDoc } from '../../models/book';
import { User, UserDoc } from '../../models/user';
import { convertEachArrayIdToString } from '../../utils/convert-arrayids';
import { removeBookLikeFromUser, removeUserLikeFromBook } from './likes';

const addUserDisLikeForBook = async (book: BookDoc, userId: string) => {
  book.dislikes.push(userId);
  await book.save();
  return;
};

const addBookDisLikeForUser = async (user: UserDoc, bookId: string) => {
  user.bookDisLikesIds.unshift(bookId);
  await user.save();
  return;
};

export const removeUserDislikeFromBook = async (
  book: BookDoc,
  userId: string
) => {
  const updatedDislikes = book.dislikes.filter(
    (currentId) => currentId.toString() !== userId
  );
  book.dislikes = updatedDislikes;
  await book.save();
  return;
};

export const removeBookDislikeFromUser = async (
  user: UserDoc,
  bookId: string
) => {
  const updatedLikes = user.bookDisLikesIds.filter(
    (currentId) => currentId.toString() !== bookId
  );
  user.bookDisLikesIds = updatedLikes;
  await user.save();
  return;
};

export const dislikeOrRemoveDislike = async (req: Request, res: Response) => {
  const { bookid, variant } = req.params;
  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }
  const existingUser = await User.findById(req.currentUser!.id);
  if (!existingUser) {
    throw new NotFoundError('user not found error');
  }

  const existingBookDislikes = convertEachArrayIdToString(
    existingBook.dislikes
  );
  const existingBookLikes = convertEachArrayIdToString(existingBook.likes);

  if (variant === 'add') {
    const userDislikeFound = existingBookDislikes.find(
      (id) => id === req.currentUser!.id
    );
    const userLikeFound = existingBookLikes.find(
      (id) => id === req.currentUser!.id
    );

    if (userLikeFound && !userDislikeFound) {
      await Promise.all([
        removeUserLikeFromBook(existingBook, req.currentUser!.id),
        removeBookLikeFromUser(existingUser, bookid),
      ]);
      await Promise.all([
        addUserDisLikeForBook(existingBook, req.currentUser!.id),
        addBookDisLikeForUser(existingUser, bookid),
      ]);
    }
    if (!userDislikeFound && !userLikeFound) {
      await Promise.all([
        addUserDisLikeForBook(existingBook, req.currentUser!.id),
        addBookDisLikeForUser(existingUser, bookid),
      ]);
    }
  } else if (variant === 'remove') {
    const userDislikeFound = existingBookDislikes.find(
      (id) => id === req.currentUser!.id
    );

    if (userDislikeFound) {
      await Promise.all([
        removeUserDislikeFromBook(existingBook, req.currentUser!.id),
        removeBookDislikeFromUser(existingUser, bookid),
      ]);
    }
  }

  return res.status(200).send({});
};
