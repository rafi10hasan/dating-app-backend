import { Request, Response } from 'express';
import handleAsync from '../../../../../shared/handleAsync';

import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../../shared/sendResponse';
import CustomError from '../../../../errors';
import adminServices from '../../../admin-module/admin.services';

const resetPassword = handleAsync(async (req: Request, res: Response) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    throw new CustomError.BadRequestError('Missing data in request body!');
  }

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  admin.password = newPassword;
  await admin.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password reset successfull',
  });
});

export default resetPassword;
