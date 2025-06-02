import adminLogin from "./admin-login";
import changePassword from "./change-password";
import resetPassword from "./reset-password";
import sendOTP from "./send-otp-admin";
import verifyOTP from "./verify-otp";


const adminAuthControllers = {
    adminLogin,
    verifyOTP,
    sendOTP,
    changePassword,
    resetPassword
}

export default adminAuthControllers