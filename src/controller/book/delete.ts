import { Request, Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../../errors';
import { Book } from '../../models/book';
import { removeAuthorsFromBook, removeBookFromPublisher } from './update';

export const deleteBook = async (req: Request, res: Response) => {
  const { bookid } = req.params;
  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }
  if (existingBook.userId.toString() !== req.currentUser!.id) {
    throw new UnauthorizedError('you are not authorized to do this');
  }
  await removeAuthorsFromBook(
    existingBook.authorIds,
    existingBook.id.toString()
  );
  await removeBookFromPublisher(
    existingBook.publisherId.toString(),
    existingBook.id.toString()
  );
  await Book.findByIdAndDelete(bookid);
  return res.status(200).send({});
};
