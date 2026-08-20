const crypto = require("crypto");

// =====================================
// GENERATE 6 DIGIT OTP
// =====================================

const generateOTP = () => {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
};


// =====================================
// OTP EXPIRY
// 10 MINUTES
// =====================================

const getOTPExpiry = () => {
  return new Date(Date.now() + 10 * 60 * 1000);
};


// =====================================
// CHECK OTP EXPIRY
// =====================================

const isOTPExpired = (expiryTime) => {
  return new Date() > new Date(expiryTime);
};


module.exports = {
  generateOTP,
  getOTPExpiry,
  isOTPExpired,
};