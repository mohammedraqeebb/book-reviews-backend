import { deleteBook, allSavedBooks, addBook } from '../controller/saved-books';
import { Router } from 'express';
import { isValidObjectId, requireAuth, validateRequest } from '../middlewares';
import { param } from 'express-validator';

export const savedBooksRouter = Router();

savedBooksRouter.post(
  '/:bookid/create',
  requireAuth,
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  addBook
);
savedBooksRouter.post('/all', requireAuth, allSavedBooks);
savedBooksRouter.post(
  '/:bookid/delete',
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  deleteBook
);
