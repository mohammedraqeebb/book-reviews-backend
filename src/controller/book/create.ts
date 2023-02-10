import { Request, Response } from 'express';
import { NotFoundError } from '../../errors';
import { isValidObjectId } from '../../middlewares';
import { Book } from '../../models/book';
import { Publisher } from '../../models/publisher';
import { Author } from '../../models/author';

export const validateAuthorIds = async (authorIds: string[]) => {
  const validatedAuthorIds = [];
  for (let i = 0; i < authorIds.length; i++) {
    const existingAuthor = await Author.findById(authorIds[i]);
    if (existingAuthor) {
      validatedAuthorIds.push(authorIds[i]);
    }
  }
  if (validatedAuthorIds.length === 0) {
    throw new NotFoundError('authors not found');
  }
  return validatedAuthorIds;
};

export const validatePublisherId = async (publisherId: string) => {
  const existingPublisher = await Publisher.findById(publisherId);
  if (!existingPublisher) {
    throw new NotFoundError('publisher not found');
  }
  return publisherId;
};

export const addBookToAuthors = async (authorIds: string[], bookId: string) => {
  for (let i = 0; i < authorIds.length; i++) {
    const existingAuthor = await Author.findById(authorIds[i]);

    if (existingAuthor) {
      existingAuthor.booksId.push(bookId);
      await existingAuthor.save();
    }
  }
};

export const addBookToPublisher = async (
  publisherId: string,
  bookId: string
) => {
  const existingPublisher = await Publisher.findById(publisherId);
  if (existingPublisher) {
    existingPublisher.booksId.push(bookId);
    await existingPublisher.save();
  }
};

export const createBook = async (req: Request, res: Response) => {
  const { name, dateOfRelease, authorIds, publisherId, genre, about } =
    req.body;
  const validatedAuthorIds = await validateAuthorIds(authorIds);
  const validatedPublisherId = await validatePublisherId(publisherId);

  const book = Book.build({
    name,
    dateOfRelease,
    authorIds: validatedAuthorIds,
    publisherId: validatedPublisherId,
    genre,
    userId: req.currentUser!.id,
    about,
  });

  await book.save();
  await addBookToAuthors(validatedAuthorIds, book.id);
  await addBookToPublisher(validatedPublisherId, book.id);
  return res
    .status(200)
    .send({ book: await book.populate(['authorIds', 'publisherId']) });
};
