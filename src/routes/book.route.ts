import { mostLiked } from './../controller/book/most-liked';
import { Router } from 'express';
import {
  createBook,
  deleteBook,
  readBook,
  updateBook,
  increaseView,
  dislikeOrRemoveDislike,
  searchBook,
} from '../controller/book';
import { isValidObjectId, requireAuth, validateRequest } from '../middlewares';
import { body, param } from 'express-validator';
import { validateDate } from '../utils/validate-date';
import { validateIds } from '../utils/validate-ids';
import { Genre } from '../models/book';
import { LikeOrRemoveLike } from '../controller/book/likes';

export const bookRouter = Router();

bookRouter.post(
  '/create',
  requireAuth,
  [
    body('name')
      .exists()
      .trim()
      .isLength({ min: 1 })
      .withMessage('name cannot be empty'),
    body('dateOfRelease')
      .exists()
      .trim()
      .custom((date) => validateDate(date))
      .withMessage('enter valid date'),
    body('about')
      .exists()
      .isLength({ min: 50, max: 1000 })
      .withMessage(
        'about should atleast contain 50 and atmost 1000 characters'
      ),
    body('authorIds')
      .exists()
      .custom(
        (authorIds: string[]) => authorIds.length <= 8 && validateIds(authorIds)
      )
      .withMessage('maximum eight authors allowed and enter valid object id'),
    body('publisherId')
      .exists()
      .custom((publisherId) => isValidObjectId(publisherId))
      .withMessage('enter valid object id'),
    body('genre')
      .exists()
      .custom((genre) => Genre.includes(genre))
      .withMessage('enter valid genre value'),
  ],
  validateRequest,
  createBook
);
bookRouter.put(
  '/:bookid',
  requireAuth,
  [
    body('name')
      .exists()
      .trim()
      .isLength({ min: 1 })
      .withMessage('name cannot be empty'),
    body('dateOfRelease')
      .exists()
      .trim()
      .custom((date) => validateDate(date))
      .withMessage('enter valid date'),
    body('about')
      .exists()
      .isLength({ min: 50, max: 300 })
      .withMessage('about should atleast contain 50 and atmost 300 characters'),
    body('authorIds')
      .exists()
      .custom(
        (authorIds: string[]) => authorIds.length <= 8 && validateIds(authorIds)
      )
      .withMessage('maximum eight authors allowed and enter valid object id'),
    body('publisherId')
      .exists()
      .custom((publisherId) => isValidObjectId(publisherId))
      .withMessage('enter valid object id'),
    body('genre')
      .exists()
      .custom((genre) => Genre.includes(genre))
      .withMessage('enter valid genre value'),
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  updateBook
);
bookRouter.post(
  '/:bookid',
  requireAuth,
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  deleteBook
);
bookRouter.get(
  '/:bookid',
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  readBook
);
bookRouter.post(
  '/:bookid/view',
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  increaseView
);

bookRouter.post(
  '/:bookid/like/:variant',
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
    param('variant')
      .exists()
      .custom((variant) => variant === 'add' || variant === 'remove')
      .withMessage('enter valid type value'),
  ],
  validateRequest,
  LikeOrRemoveLike
);

bookRouter.post(
  '/:bookid/dislike/:variant',
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
    param('variant')
      .exists()
      .custom((variant) => variant === 'add' || variant === 'remove')
      .withMessage('enter valid type value'),
  ],
  validateRequest,
  dislikeOrRemoveDislike
);

bookRouter.post(
  '/search/all',
  [
    body('bookSearchField')
      .exists()
      .withMessage('book search field cannot be empty'),
  ],
  validateRequest,
  searchBook
);

bookRouter.get('/likes/mostliked', mostLiked);
