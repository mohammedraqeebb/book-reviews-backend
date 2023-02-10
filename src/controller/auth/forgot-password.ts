import { Request, Response } from 'express';
import { sendMail } from '../../utils/nodemailer';
import { User } from '../../models/user';
import { UserOtp } from '../../models/otp';
import { NotFoundError, BadRequestError } from '../../errors';

const generateOtp = () => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return parseInt(otp);
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new NotFoundError('user not found, create an account');
  }
  const existingOtp = await UserOtp.findOne({ email });
  if (existingOtp) {
    const hasTimeElapsed = new Date().getTime() - existingOtp.expiresAt > 0;
    if (!hasTimeElapsed) {
      throw new BadRequestError('too soon,try again after some time');
    }
    await UserOtp.findByIdAndDelete(existingUser.id);
  }

  const otp = generateOtp();
  const userOtp = UserOtp.build({
    _id: existingUser.id,
    email,
    expiresAt: new Date().getTime() + 120 * 1000,
    otp,
  });

  await userOtp.save();
  sendMail({ to: email, otp: userOtp.otp });
  return res.status(200).send({ message: 'otp sent' });
};
