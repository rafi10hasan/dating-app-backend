import express from 'express';
import adminAuthControllers from './controller';

const adminAuthRouter = express.Router();

adminAuthRouter.post('/login', adminAuthControllers.adminLogin);
adminAuthRouter.post('/forget-password/send-otp', adminAuthControllers.sendOTP);
adminAuthRouter.post('/verify-otp', adminAuthControllers.verifyOTP);
adminAuthRouter.post('/reset-password', adminAuthControllers.resetPassword);
adminAuthRouter.post('/change-password', adminAuthControllers.changePassword);

export default adminAuthRouter;
