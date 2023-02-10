import mongoose from 'mongoose';

export const Genre = [
  'biography',
  'personality development',
  'comics',
  'horror',
  'fiction',
  'novel',
] as const;

type BookAttrs = {
  name: string;
  dateOfRelease: string;
  about: string;
  authorIds: string[];
  publisherId: string;
  genre: typeof Genre[number];
  userId: string;
};
export interface BookDoc extends mongoose.Document {
  id: string;
  name: string;
  dateOfRelease: string;
  about: string;
  userId: string;
  authorIds: string[];
  publisherId: string;
  views: number;
  likes: string[];
  dislikes: string[];
  rating: number;
  comments: number;
  genre: typeof Genre[number];
}

interface BookModel extends mongoose.Model<BookDoc> {
  build(attrs: BookAttrs): BookDoc;
}

const bookSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      type: String,
    },
    dateOfRelease: {
      required: true,
      type: Date,
    },
    about: {
      required: true,
      type: String,
      min: 50,
      max: 300,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true,
      },
    ],
    publisherId: {
      required: true,
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Publisher',
    },
    genre: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
    comments: Number,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.authors = ret.authorIds;
        ret.publisher = ret.publisherId;
        delete ret.authorIds;
        delete ret.publisherId;
        delete ret._id;
        delete ret.__V;
      },
    },
  }
);

bookSchema.statics.build = (attrs: BookAttrs) => {
  return new Book(attrs);
};
export const Book = mongoose.model<BookDoc, BookModel>('Book', bookSchema);
