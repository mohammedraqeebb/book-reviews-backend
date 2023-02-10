import mongoose from 'mongoose';

type Gender = 'male' | 'female';
type AuthorAttrs = {
  name: string;
  dateOfBirth: Date;
  gender: Gender;
  bio: string;
  userId: string;
};

interface AuthorDoc extends mongoose.Document {
  name: string;
  dateOfBirth: Date;
  gender: Gender;
  bio: string;
  userId: string;
  booksId: string[];
}

interface AuthorModel extends mongoose.Model<AuthorDoc> {
  build(attrs: AuthorAttrs): AuthorDoc;
}
const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: true,
    },
    bio: {
      min: 50,
      type: String,
      max: 1000,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    booksId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.books = ret.booksId;
        delete ret._id;
        delete ret.__v;
        delete ret.booksId;
      },
    },
  }
);

authorSchema.statics.build = (attrs: AuthorAttrs) => {
  return new Author(attrs);
};
export const Author = mongoose.model<AuthorDoc, AuthorModel>(
  'Author',
  authorSchema
);
