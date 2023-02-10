import { Router } from 'express';
import { body, param } from 'express-validator';
import { createRating, updateRating, allRatings } from '../controller/rating';
import { isValidObjectId, requireAuth, validateRequest } from '../middlewares';

export const ratingRouter = Router();

ratingRouter.post(
  '/:bookid/create',
  requireAuth,
  [
    body('rating')
      .exists()
      .notEmpty()
      .custom(
        (rating) => Number.isInteger(rating) && rating >= 1 && rating <= 10
      )
      .withMessage('rating has to be between 1 to 10'),
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  createRating
);

ratingRouter.put(
  '/:bookid/:ratingid',
  [
    body('rating')
      .exists()
      .notEmpty()
      .isFloat({ min: 1, max: 10 })
      .withMessage('rating has to be between 1 to 10'),
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
    param('ratingid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  requireAuth,
  updateRating
);
ratingRouter.get(
  '/:bookid/all',
  [
    param('bookid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  allRatings
);
