import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  createPublisher,
  readPublisher,
  searchPublisher,
} from '../controller/publisher';

import { isValidObjectId, requireAuth, validateRequest } from '../middlewares';
import { validateDate } from '../utils/validate-date';

export const publisherRouter = Router();

publisherRouter.post(
  '/create',
  requireAuth,
  [
    body('name').exists().trim().notEmpty().withMessage('name cannot be empty'),
    body('bio')
      .exists()
      .trim()
      .notEmpty()
      .isLength({ min: 50, max: 1000 })
      .withMessage('bio should be atleast 100 and atmost 1000 characters'),
    body('establishedDate')
      .exists()
      .custom((date) => validateDate(date))
      .withMessage('enter valid date'),
    body('street')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('street cannot be empty'),
    body('state')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('state cannot be empty'),
    body('country')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('country cannot be empty'),
    body('countryCode')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('country code cannot be empty'),
    body('phoneNumber')
      .exists()
      .trim()
      .notEmpty()
      .withMessage('phone number code cannot be empty'),
  ],
  validateRequest,
  createPublisher
);
publisherRouter.get(
  '/:publisherid',
  [
    param('publisherid')
      .exists()
      .custom((id) => isValidObjectId(id))
      .withMessage('valid author id is required'),
  ],
  validateRequest,
  readPublisher
);
publisherRouter.post(
  '/search',
  requireAuth,
  [
    body('searchPublisherField')
      .exists()
      .trim()
      .isLength({ min: 1 })
      .withMessage('search author term is required'),
  ],
  validateRequest,
  searchPublisher
);
