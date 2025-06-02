import { Request, Response } from 'express';
import handleAsync from '../../../../../shared/handleAsync';

import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../../shared/sendResponse';
import CustomError from '../../../../errors';
import adminServices from '../../../admin-module/admin.services';
import Admin from '../../../admin-module/admin.model';

const verifyOTP = handleAsync(async (req: Request, res: Response) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  const isMatchOTP = await admin.compareVerificationCode(otp);
  if (!isMatchOTP) {
    throw new CustomError.BadRequestError('Invalid OTP!');
  }

  // set null verification object in admin model
  await Admin.findByIdAndUpdate(admin._id, {
    verification: { code: null, expireDate: null },
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'OTP match successfull',
  });
});


export default verifyOTP