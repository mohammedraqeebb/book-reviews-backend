import { Request, Response } from 'express';
import { NotFoundError, UnauthorizedError } from '../../errors';
import { Author } from '../../models/author';
import { Book } from '../../models/book';
import { Publisher } from '../../models/publisher';
import {
  addBookToAuthors,
  validateAuthorIds,
  validatePublisherId,
} from './create';
import { convertEachArrayIdToString } from '../../utils/convert-arrayids';

export const removeAuthorsFromBook = async (
  authorIds: string[],
  bookId: string
) => {
  for (let i = 0; i < authorIds.length; i++) {
    const existingAuthor = await Author.findById(authorIds[i]);
    if (existingAuthor) {
      const updatedBooksId = existingAuthor.booksId.filter(
        (currentBookId) => currentBookId.toString() !== bookId
      );
      existingAuthor.booksId = updatedBooksId;
      await existingAuthor.save();
    }
  }
};

const addBookToPublisher = async (publisherId: string, bookId: string) => {
  const existingPublisher = await Publisher.findById(publisherId);
  if (existingPublisher) {
    existingPublisher.booksId.push(bookId);
    await existingPublisher.save();
  }
};

export const removeBookFromPublisher = async (
  publisherId: string,
  bookId: string
) => {
  const existingPublisher = await Publisher.findById(publisherId);
  if (existingPublisher) {
    const updatedBookIds = existingPublisher.booksId.filter(
      (currentBookId) => currentBookId.toString() !== bookId
    );
    existingPublisher.booksId = updatedBookIds;
    await existingPublisher.save();
  }
};
const checkAreAuthorIdsEqual = (
  authorIds: string[],
  existingAuthorsIds: string[]
) => {
  const commonAuthorIds = existingAuthorsIds.filter((currentId) =>
    authorIds.includes(currentId)
  );

  if (commonAuthorIds.length === existingAuthorsIds.length) {
    return true;
  }

  return false;
};

const classifyAuthorIds = (
  authorIds: string[],
  existingAuthorIds: string[]
) => {
  const commonAuthorIds = existingAuthorIds.filter((currentId) =>
    authorIds.includes(currentId.toString())
  );
  const newAuthorIds = authorIds.filter(
    (authorId) => !commonAuthorIds.includes(authorId)
  );
  const removedAuthorIds = existingAuthorIds.filter(
    (currentId) => !commonAuthorIds.includes(currentId)
  );
  return { commonAuthorIds, newAuthorIds, removedAuthorIds };
};

export const updateBook = async (req: Request, res: Response) => {
  const { name, dateOfRelease, authorIds, publisherId, genre, about } =
    req.body;
  const { bookid } = req.params;
  const existingBook = await Book.findById(bookid);
  if (!existingBook) {
    throw new NotFoundError('book not found');
  }

  if (existingBook.userId.toString() !== req.currentUser!.id) {
    throw new UnauthorizedError('you are not authorized to delete a book');
  }
  const existingAuthorIds = convertEachArrayIdToString(existingBook.authorIds);

  let finalAuthorIds = existingAuthorIds;
  if (!checkAreAuthorIdsEqual(authorIds, existingAuthorIds)) {
    const { newAuthorIds, commonAuthorIds, removedAuthorIds } =
      classifyAuthorIds(authorIds, existingAuthorIds);
    const validatedNewAuthorIds = await validateAuthorIds(newAuthorIds);
    await addBookToAuthors(validatedNewAuthorIds, bookid);
    await removeAuthorsFromBook(removedAuthorIds, bookid);
    finalAuthorIds = [...validatedNewAuthorIds, ...commonAuthorIds];
  }

  const validatedPublisherId = await validatePublisherId(publisherId);
  if (validatedPublisherId !== existingBook.publisherId.toString()) {
    await addBookToPublisher(validatedPublisherId, existingBook.id);
    await removeBookFromPublisher(
      existingBook.publisherId.toString(),
      existingBook.id
    );
  }

  existingBook.set({
    name,
    dateOfRelease,
    authorIds: finalAuthorIds,
    publisherId: validatedPublisherId,
    genre,
    about,
  });

  await existingBook.save();

  return res
    .status(200)
    .send({ book: await existingBook.populate(['authorIds', 'publisherId']) });
};
