import { BadRequestError } from '../../errors';
import { User } from '../../models/user';
import { PasswordManager } from '../../utils/password-manager';
import { UserOtp } from '../../models/otp';
import { Request, Response } from 'express';

export const changePassword = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  const existingOtp = await UserOtp.findOne({ email });

  if (!existingUser) {
    throw new BadRequestError('user does not exist');
  }
  if (!existingOtp) {
    throw new BadRequestError('you are not allowed');
  }
  const samePassword = await PasswordManager.comparePassword(
    password,
    existingUser.password
  );
  if (samePassword) {
    throw new BadRequestError('enter new password');
  }
  const currentTime = new Date().getTime();
  const otpIssuedTimePlusOneMinute = existingOtp.expiresAt + 60 * 1000;
  if (currentTime - otpIssuedTimePlusOneMinute > 0) {
    throw new BadRequestError('sorry, you tried too late');
  }

  existingUser.set({ password });
  await existingUser.save();
  return res.status(200).send({ message: 'password updated' });
};
