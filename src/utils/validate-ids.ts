import { isValidObjectId } from '../middlewares';

export const validateIds = (ids: string[]) => {
  for (let i = 0; i < ids.length; i++) {
    if (!isValidObjectId(ids[i])) {
      return false;
    }
  }
  return true;
};
