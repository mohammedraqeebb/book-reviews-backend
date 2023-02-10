import mongoose from 'mongoose';

export const isValidObjectId = (id: string) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    if (String(new mongoose.Types.ObjectId(id)) === id) {
      return true;
    }
    return false;
  }
  return false;
};
