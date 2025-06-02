import { Request, Response } from 'express';
import handleAsync from '../../../../../shared/handleAsync';

import { StatusCodes } from 'http-status-codes';
import config from '../../../../../config';
import sendResponse from '../../../../../shared/sendResponse';
import CustomError from '../../../../errors';
import adminServices from '../../../admin-module/admin.services';
import IdGenerator from '../../../../../utilities/idGenerator';
import sendMail from '../../../../../utilities/sendEmail';

const sendOTP = handleAsync(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  const code = IdGenerator.generateNumberId();
  const expireDate = new Date();
  expireDate.setMinutes(expireDate.getMinutes() + 5);
  const verification = {
    code,
    expireDate,
  };

  admin.verification = verification;
  await admin.save();

  // send verification mail
  const textContent = `
        Hi ${admin.fullName},
        
        You have requested to reset your password. Please use the following One-Time Password (OTP) to complete the process. This OTP is valid for some minutes.
        
        Your OTP: ${code}
        
        If you did not request this, please ignore this email and your password will remain unchanged.
        
        For security reasons, do not share this OTP with anyone.
        
        Best regards,
        `;

  const mailOptions = {
    from: config.gmail_app_user as string,
    to: email,
    subject: 'Password Reset OTP',
    text: textContent,
  };

  sendMail(mailOptions);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset OTP sended successfull.',
  });
});

export default sendOTP