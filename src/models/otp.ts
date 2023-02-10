import mongoose from 'mongoose';

type OTP = {
  _id: string; //userid
  email: string;
  otp: number;
  expiresAt: number;
};

interface OTPDoc extends mongoose.Document {
  email: string;
  otp: number;
  expiresAt: number;
}

interface OTPModel extends mongoose.Model<OTPDoc> {
  build(attrs: OTP): OTPDoc;
}

const userOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    otp: {
      type: Number,
      required: true,
    },
    expiresAt: {
      type: Number,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
    timestamps: true,
  }
);

userOtpSchema.statics.build = (attrs: OTP) => {
  return new UserOtp(attrs);
};

export const UserOtp = mongoose.model<OTPDoc, OTPModel>(
  'UserOtp',
  userOtpSchema
);
