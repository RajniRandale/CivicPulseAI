import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

function ForgotPassword() {
  const navigate = useNavigate();

  // ==================================================
  // GLOBAL LANGUAGE
  // ==================================================

  const { language } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;


  // ==================================================
  // STEP
  // 1 = EMAIL
  // 2 = OTP
  // 3 = NEW PASSWORD
  // ==================================================

  const [step, setStep] = useState(1);

  // ==================================================
  // FORM DATA
  // ==================================================

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");


  // ==================================================
  // PASSWORD VISIBILITY
  // ==================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ==================================================
  // STATES
  // ==================================================

  const [loading, setLoading] =
    useState(false);

  const [errors, setErrors] =
    useState({});

  const [successMessage, setSuccessMessage] =
    useState("");


  // ==================================================
  // EMAIL CHANGE
  // ==================================================

  const handleEmailChange = (e) => {
    setEmail(e.target.value);

    setErrors({});
    setSuccessMessage("");
  };


  // ==================================================
  // SEND RESET OTP
  // ==================================================

  const handleSendOTP = async () => {
    const normalizedEmail =
      email.trim().toLowerCase();

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!normalizedEmail) {
      setErrors({
        email:
          language === "Marathi"
            ? "ईमेल आवश्यक आहे."
            : language === "Hindi"
            ? "ईमेल आवश्यक है।"
            : "Email is required.",
      });

      return;
    }


    if (!emailRegex.test(normalizedEmail)) {
      setErrors({
        email:
          language === "Marathi"
            ? "वैध ईमेल पत्ता टाका."
            : language === "Hindi"
            ? "एक वैध ईमेल पता दर्ज करें।"
            : "Enter a valid email address.",
      });

      return;
    }


    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");


      const response =
        await axios.post(
          "http://localhost:5000/api/auth/forgot-password/send-otp",
          {
            email: normalizedEmail,
          }
        );


      console.log(
        "Forgot password OTP response:",
        response.data
      );


      setStep(2);


      setSuccessMessage(
        language === "Marathi"
          ? "OTP तुमच्या Gmail वर पाठवला आहे."
          : language === "Hindi"
          ? "OTP आपके Gmail पर भेजा गया है।"
          : "OTP sent to your Gmail. Please check your Inbox or Spam folder."
      );

    } catch (error) {

      console.error(
        "Send reset OTP error:",
        error
      );


      setErrors({
        email:
          error.response?.data?.message ||
          (language === "Marathi"
            ? "OTP पाठवता आला नाही."
            : language === "Hindi"
            ? "OTP भेजने में विफल।"
            : "Failed to send OTP."),
      });

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // VERIFY OTP
  // ==================================================

  const handleVerifyOTP = async () => {
    const normalizedEmail =
      email.trim().toLowerCase();


    if (!otp) {
      setErrors({
        otp:
          language === "Marathi"
            ? "कृपया OTP टाका."
            : language === "Hindi"
            ? "कृपया OTP दर्ज करें।"
            : "Please enter OTP.",
      });

      return;
    }


    if (!/^\d{6}$/.test(otp)) {
      setErrors({
        otp:
          language === "Marathi"
            ? "OTP 6 अंकी असावा."
            : language === "Hindi"
            ? "OTP 6 अंकों का होना चाहिए।"
            : "OTP must contain exactly 6 digits.",
      });

      return;
    }


    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");


      const response =
        await axios.post(
          "http://localhost:5000/api/auth/forgot-password/verify-otp",
          {
            email: normalizedEmail,
            otp,
          }
        );


      console.log(
        "Verify reset OTP response:",
        response.data
      );


      if (
        response.data.verified !== true
      ) {
        setErrors({
          otp:
            language === "Marathi"
              ? "OTP सत्यापन अयशस्वी झाले."
              : language === "Hindi"
              ? "OTP सत्यापन विफल हुआ।"
              : "OTP verification failed.",
        });

        return;
      }


      setStep(3);


      setSuccessMessage(
        language === "Marathi"
          ? "OTP सत्यापित झाला. आता नवीन पासवर्ड तयार करा."
          : language === "Hindi"
          ? "OTP सत्यापित हो गया। अब नया पासवर्ड सेट करें।"
          : "OTP verified successfully. Enter your new password."
      );

    } catch (error) {

      console.error(
        "Verify reset OTP error:",
        error
      );


      setErrors({
        otp:
          error.response?.data?.message ||
          (language === "Marathi"
            ? "अवैध OTP."
            : language === "Hindi"
            ? "अमान्य OTP।"
            : "Invalid OTP."),
      });

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // RESET PASSWORD
  // ==================================================

  const handleResetPassword = async () => {
    const newErrors = {};


    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


    if (!password) {
      newErrors.password =
        language === "Marathi"
          ? "पासवर्ड आवश्यक आहे."
          : language === "Hindi"
          ? "पासवर्ड आवश्यक है।"
          : "Password is required.";

    } else if (
      !passwordRegex.test(password)
    ) {
      newErrors.password =
        language === "Marathi"
          ? "पासवर्डमध्ये मोठे अक्षर, लहान अक्षर, अंक आणि विशेष चिन्ह असावे व किमान 8 अक्षरे असावीत."
          : language === "Hindi"
          ? "पासवर्ड में बड़ा अक्षर, छोटा अक्षर, संख्या और विशेष चिन्ह होना चाहिए तथा कम से कम 8 अक्षर होने चाहिए।"
          : "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.";
    }


    if (!confirmPassword) {
      newErrors.confirmPassword =
        language === "Marathi"
          ? "कृपया पासवर्डची पुष्टी करा."
          : language === "Hindi"
          ? "कृपया अपने पासवर्ड की पुष्टि करें।"
          : "Please confirm your password.";

    } else if (
      confirmPassword !== password
    ) {
      newErrors.confirmPassword =
        language === "Marathi"
          ? "पासवर्ड जुळत नाहीत."
          : language === "Hindi"
          ? "पासवर्ड मेल नहीं खाते।"
          : "Passwords do not match.";
    }


    if (
      Object.keys(newErrors).length > 0
    ) {
      setErrors(newErrors);
      return;
    }


    try {
      setLoading(true);
      setErrors({});
      setSuccessMessage("");


      const response =
        await axios.post(
          "http://localhost:5000/api/auth/forgot-password/reset",
          {
            email:
              email.trim().toLowerCase(),

            password,
          }
        );


      console.log(
        "Password reset response:",
        response.data
      );


      setSuccessMessage(
        language === "Marathi"
          ? "पासवर्ड यशस्वीपणे रीसेट झाला. Citizen Login वर जात आहे..."
          : language === "Hindi"
          ? "पासवर्ड सफलतापूर्वक रीसेट हो गया। Citizen Login पर जा रहे हैं..."
          : "Password reset successfully. Redirecting to Citizen Login..."
      );


      setPassword("");
      setConfirmPassword("");
      setOtp("");


      setTimeout(() => {
        navigate(
          "/citizen-login",
          {
            replace: true,
          }
        );
      }, 1200);

    } catch (error) {

      console.error(
        "Reset password error:",
        error
      );


      setErrors({
        general:
          error.response?.data?.message ||
          (language === "Marathi"
            ? "पासवर्ड रीसेट करता आला नाही."
            : language === "Hindi"
            ? "पासवर्ड रीसेट करने में विफल।"
            : "Failed to reset password."),
      });

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // CHANGE EMAIL
  // ==================================================

  const handleChangeEmail = () => {
    setStep(1);
    setOtp("");
    setErrors({});
    setSuccessMessage("");
  };


  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#f4f8ff",
        padding: "20px",
      }}
    >

      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "450px",
          border: "none",
          borderRadius: "15px",
        }}
      >

        {/* TITLE */}

        <h2 className="text-center mb-2">
          {t.forgotPassword}
        </h2>

        <p className="text-center text-muted mb-4">
          {language === "Marathi"
            ? "तुमचा CivicPulse AI पासवर्ड रीसेट करा"
            : language === "Hindi"
            ? "अपना CivicPulse AI पासवर्ड रीसेट करें"
            : "Reset your CivicPulse AI password"}
        </p>


        {/* GENERAL ERROR */}

        {errors.general && (
          <div className="alert alert-danger">
            {errors.general}
          </div>
        )}


        {/* SUCCESS */}

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}


        {/* ==================================================
            STEP 1 - EMAIL
        ================================================== */}

        {step === 1 && (
          <div>

            <label className="form-label fw-bold">
              {language === "Marathi"
                ? "नोंदणीकृत ईमेल"
                : language === "Hindi"
                ? "पंजीकृत ईमेल"
                : "Registered Email"}
            </label>


            <input
              type="email"
              className={`form-control ${
                errors.email
                  ? "is-invalid"
                  : ""
              }`}
              placeholder={t.enterEmail}
              value={email}
              onChange={handleEmailChange}
            />


            {errors.email && (
              <div className="invalid-feedback">
                {errors.email}
              </div>
            )}


            <button
              type="button"
              className="btn btn-primary w-100 mt-3"
              onClick={handleSendOTP}
              disabled={loading}
            >
              {loading
                ? t.loading
                : "Send OTP"}
            </button>

          </div>
        )}


        {/* ==================================================
            STEP 2 - OTP
        ================================================== */}

        {step === 2 && (
          <div>

            <div className="alert alert-info">

              {language === "Marathi"
                ? "OTP या ईमेलवर पाठवला आहे:"
                : language === "Hindi"
                ? "OTP इस ईमेल पर भेजा गया है:"
                : "OTP sent to:"}

              <strong>
                {" "}
                {email}
              </strong>

            </div>


            <label className="form-label fw-bold">
              {language === "Marathi"
                ? "ईमेल OTP टाका"
                : language === "Hindi"
                ? "ईमेल OTP दर्ज करें"
                : "Enter Email OTP"}
            </label>


            <input
              type="text"
              inputMode="numeric"
              maxLength="6"
              className={`form-control ${
                errors.otp
                  ? "is-invalid"
                  : ""
              }`}
              placeholder={
                language === "Marathi"
                  ? "6 अंकी OTP टाका"
                  : language === "Hindi"
                  ? "6 अंकों का OTP दर्ज करें"
                  : "Enter 6-digit OTP"
              }
              value={otp}
              onChange={(e) => {

                const value =
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                setOtp(value);

                setErrors((prev) => ({
                  ...prev,
                  otp: "",
                }));
              }}
            />


            {errors.otp && (
              <div className="invalid-feedback">
                {errors.otp}
              </div>
            )}


            <button
              type="button"
              className="btn btn-success w-100 mt-3"
              onClick={handleVerifyOTP}
              disabled={
                loading ||
                otp.length !== 6
              }
            >
              {loading
                ? t.loading
                : t.verifyOtp}
            </button>


            <button
              type="button"
              className="btn btn-link w-100 mt-2"
              onClick={
                handleChangeEmail
              }
            >
              {language === "Marathi"
                ? "ईमेल बदला"
                : language === "Hindi"
                ? "ईमेल बदलें"
                : "Change Email"}
            </button>

          </div>
        )}


        {/* ==================================================
            STEP 3 - PASSWORD
        ================================================== */}

        {step === 3 && (
          <div>

            {/* NEW PASSWORD */}

            <label className="form-label fw-bold">
              {t.newPassword}
            </label>


            <div className="input-group">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                className={`form-control ${
                  errors.password
                    ? "is-invalid"
                    : ""
                }`}
                placeholder={
                  language === "Marathi"
                    ? "नवीन पासवर्ड टाका"
                    : language === "Hindi"
                    ? "नया पासवर्ड दर्ज करें"
                    : "Enter new password"
                }
                value={password}
                onChange={(e) => {

                  setPassword(
                    e.target.value
                  );

                  setErrors((prev) => ({
                    ...prev,
                    password: "",
                    general: "",
                  }));
                }}
              />


              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowPassword(
                    (prev) => !prev
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>


            {errors.password && (
              <div className="text-danger small mt-1">
                {errors.password}
              </div>
            )}


            {/* CONFIRM PASSWORD */}

            <label className="form-label fw-bold mt-3">
              {t.confirmPassword}
            </label>


            <div className="input-group">

              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                className={`form-control ${
                  errors.confirmPassword
                    ? "is-invalid"
                    : ""
                }`}
                placeholder={
                  language === "Marathi"
                    ? "नवीन पासवर्डची पुष्टी करा"
                    : language === "Hindi"
                    ? "नए पासवर्ड की पुष्टि करें"
                    : "Confirm new password"
                }
                value={confirmPassword}
                onChange={(e) => {

                  setConfirmPassword(
                    e.target.value
                  );

                  setErrors((prev) => ({
                    ...prev,
                    confirmPassword: "",
                    general: "",
                  }));
                }}
              />


              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
              >
                {showConfirmPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>

            </div>


            {errors.confirmPassword && (
              <div className="text-danger small mt-1">
                {errors.confirmPassword}
              </div>
            )}


            {/* RESET */}

            <button
              type="button"
              className="btn btn-primary w-100 mt-4"
              onClick={
                handleResetPassword
              }
              disabled={loading}
            >
              {loading
                ? t.loading
                : t.resetPassword}
            </button>

          </div>
        )}


        {/* BACK TO LOGIN */}

        <div className="text-center mt-4">

          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() =>
              navigate(
                "/citizen-login"
              )
            }
          >
            {t.backToLogin}
          </button>

        </div>

      </div>
    </div>
  );
}

export default ForgotPassword;