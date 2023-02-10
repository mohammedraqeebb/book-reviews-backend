import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { Book, BookDoc } from '../../models/book';
import { User } from '../../models/user';

const addViewForBook = async (book: BookDoc) => {
  book.set({ views: book.views + 1 });
  await book.save();
  return;
};

const addBookViewForUser = async (userId: string, bookId: string) => {
  const existingUser = await User.findById(userId);
  if (existingUser) {
    const bookViewsIds = existingUser.bookViewsIds;
    const bookIdFound = bookViewsIds.find(
      (currentBookViewId) => currentBookViewId.toString() === bookId
    );
    if (!bookIdFound) {
      existingUser.bookViewsIds.unshift(bookId);
      await existingUser.save();
    } else {
      const filteredBookViewsIds = bookViewsIds.filter(
        (currentBookViewId) => currentBookViewId.toString() !== bookId
      );
      const newFilteredViewsIds = [bookId, ...filteredBookViewsIds];
      existingUser.bookViewsIds = newFilteredViewsIds;
      await existingUser.save();
    }
  }
  return;
};

export const increaseView = async (req: Request, res: Response) => {
  const { bookid } = req.params;
  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('not found error');
  }
  if (req.currentUser) {
    await Promise.all([
      addViewForBook(existingBook),
      addBookViewForUser(req.currentUser!.id, bookid),
    ]);
    return res.status(201).send({});
  }
  await addViewForBook(existingBook);
  return res.status(201).send({});
};
