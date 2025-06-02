import { Request, Response } from 'express';
import handleAsync from '../../../../../shared/handleAsync';

import { StatusCodes } from 'http-status-codes';
import sendResponse from '../../../../../shared/sendResponse';
import CustomError from '../../../../errors';
import adminServices from '../../../admin-module/admin.services';

const changePassword = handleAsync(async (req: Request, res: Response) => {
  const { email, oldPassword, newPassword } = req.body;

  const admin = await adminServices.getAdminByEmail(email);
  if (!admin) {
    throw new CustomError.NotFoundError('Admin not found!');
  }

  // compare admin given old password and database saved password
  const isOldPassMatch = await admin.comparePassword(oldPassword);
  if (!isOldPassMatch) {
    throw new CustomError.BadRequestError('Wrong password');
  }

  admin.password = newPassword;
  await admin.save();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    status: 'success',
    message: 'Password change successfull',
  });
});

export default changePassword;