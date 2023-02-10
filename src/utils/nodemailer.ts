import nodemailer from 'nodemailer';
import { BadRequestError } from '../errors';

const transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.NODEMAILER_SENDER_EMAIL!,
    pass: process.env.NODEMAILER_SENDER_EMAIL_PASSWORD!,
  },
});
type SendMail = {
  to: string;
  otp: number;
};

export const sendMail = ({ to, otp }: SendMail) => {
  const options = {
    from: 'mohammedraqeeb999@outlook.com',
    to,
    subject: 'forgotten password,OTP',
    text: false,
    html: `<h3>Hey there from Book Review</h3>
    <p >Your otp is <span>${otp}</span></p>
            <style> span { color: red; }
            </style>`,
  };
  //@ts-ignore
  transporter.sendMail(options, function (err, info) {
    if (err) {
      throw new BadRequestError(
        'your email, was not sent,enter existing email'
      );
    }
  });
  return;
};
