import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

function CitizenLogin() {
  const navigate = useNavigate();

  // ==================================================
  // GLOBAL LANGUAGE
  // ==================================================

  const { language } =
    useAppSettings();

  const t =
    translations[language] ||
    translations.English;


  // ==================================================
  // FORM DATA
  // ==================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  // ==================================================
  // LOGIN OTP
  // ==================================================

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);


  // ==================================================
  // STATES
  // ==================================================

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [otpLoading, setOtpLoading] =
    useState(false);


  // ==================================================
  // HANDLE EMAIL
  // ==================================================

  const handleEmailChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      email: value,
    }));

    setOtpSent(false);
    setOtp("");

    setErrors((prev) => ({
      ...prev,
      email: "",
      password: "",
      otp: "",
      general: "",
    }));
  };


  // ==================================================
  // HANDLE PASSWORD
  // ==================================================

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      password: value,
    }));

    setErrors((prev) => ({
      ...prev,
      password: "",
      general: "",
    }));
  };


  // ==================================================
  // LOGIN + SEND EMAIL OTP
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email =
      formData.email
        .trim()
        .toLowerCase();

    const password =
      formData.password;

    const newErrors = {};

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!email) {
      newErrors.email =
        "Email is required.";
    } else if (
      !emailRegex.test(email)
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }


    if (!password) {
      newErrors.password =
        "Password is required.";
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

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email,
            password,
          }
        );


      const user =
        response.data.user;


      if (!user) {
        setErrors({
          email:
            "User information was not received.",
        });
        return;
      }


      if (
        !user.role ||
        user.role.toLowerCase() !==
          "citizen"
      ) {
        setErrors({
          email:
            "This account is not a citizen account.",
        });
        return;
      }


      if (
        response.data.otpSent !== true
      ) {
        setErrors({
          email:
            "Failed to send login OTP.",
        });
        return;
      }


      setOtpSent(true);
      setOtp("");


      setFormData((prev) => ({
        ...prev,
        password: "",
      }));

    } catch (error) {

      console.error(
        "Citizen login error:",
        error
      );

      setErrors({
        email:
          error.response?.data?.message ||
          "Invalid email or password.",
      });

    } finally {
      setLoading(false);
    }
  };


  // ==================================================
  // VERIFY LOGIN OTP
  // ==================================================

  const handleVerifyOTP = async () => {

    if (!otp) {
      setErrors({
        otp: "Please enter OTP.",
      });
      return;
    }


    if (!/^\d{6}$/.test(otp)) {
      setErrors({
        otp:
          "OTP must contain exactly 6 digits.",
      });
      return;
    }


    try {

      setOtpLoading(true);
      setErrors({});


      const response =
        await axios.post(
          "http://localhost:5000/api/auth/verify-login-otp",
          {
            email:
              formData.email
                .trim()
                .toLowerCase(),

            otp,
          }
        );


      const user =
        response.data.user;


      if (!user) {
        setErrors({
          otp:
            "User information was not received.",
        });
        return;
      }


      if (
        !user.role ||
        user.role.toLowerCase() !==
          "citizen"
      ) {
        setErrors({
          otp:
            "Only citizen accounts can login here.",
        });
        return;
      }


      if (!response.data.token) {
        setErrors({
          otp:
            "Login token was not received.",
        });
        return;
      }


      localStorage.setItem(
        "token",
        response.data.token
      );


      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id:
            user.id ||
            user._id ||
            null,

          name:
            user.name || "",

          email:
            user.email || "",

          mobile:
            user.mobile || "",

          role:
            user.role || "citizen",
        })
      );


      navigate(
        "/citizen-dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Login OTP verification error:",
        error
      );

      setErrors({
        otp:
          error.response?.data?.message ||
          "Invalid OTP.",
      });

    } finally {
      setOtpLoading(false);
    }
  };


  // ==================================================
  // LOGIN AGAIN
  // ==================================================

  const handleLoginAgain = () => {
    setOtpSent(false);
    setOtp("");
    setErrors({});
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
          {t.citizenLogin}
        </h2>

        <p className="text-center text-muted mb-4">
          {language === "Marathi"
            ? "तुमच्या CivicPulse AI खात्यात लॉगिन करा"
            : language === "Hindi"
            ? "अपने CivicPulse AI खाते में लॉगिन करें"
            : "Login to your CivicPulse AI account"}
        </p>


        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="mb-3">

            <label className="form-label fw-bold">
              {t.email}
            </label>

            <input
              type="email"
              className={`form-control ${
                errors.email
                  ? "is-invalid"
                  : ""
              }`}
              placeholder={t.enterEmail}
              value={formData.email}
              onChange={handleEmailChange}
              disabled={otpSent}
            />

            {errors.email && (
              <div className="invalid-feedback">
                {errors.email}
              </div>
            )}

          </div>


          {/* PASSWORD */}

          {!otpSent && (
            <div className="mb-2">

              <label className="form-label fw-bold">
                {t.password}
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
                    t.enterPassword
                  }
                  value={
                    formData.password
                  }
                  onChange={
                    handlePasswordChange
                  }
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

            </div>
          )}


          {/* FORGOT PASSWORD */}

          {!otpSent && (
            <div className="text-end mb-3">

              <button
                type="button"
                className="btn btn-link p-0"
                onClick={() =>
                  navigate(
                    "/forgot-password"
                  )
                }
              >
                {t.forgotPassword}
              </button>

            </div>
          )}


          {/* LOGIN */}

          {!otpSent && (

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? t.loading
                : t.sendOtp}
            </button>

          )}


          {/* OTP */}

          {otpSent && (

            <div className="mt-3">

              <div className="alert alert-info">

                {language === "Marathi"
                  ? "लॉगिन OTP तुमच्या Gmail वर पाठवला आहे."
                  : language === "Hindi"
                  ? "लॉगिन OTP आपके Gmail पर भेजा गया है।"
                  : "Login OTP sent to your Gmail address."}

                <br />

                <small>
                  {language === "Marathi"
                    ? "Inbox किंवा Spam folder तपासा."
                    : language === "Hindi"
                    ? "Inbox या Spam folder देखें।"
                    : "Please check your Inbox or Spam folder."}
                </small>

              </div>


              <label className="form-label fw-bold">
                {language === "Marathi"
                  ? "Email OTP टाका"
                  : language === "Hindi"
                  ? "Email OTP दर्ज करें"
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
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => {

                  const value =
                    e.target.value
                      .replace(
                        /\D/g,
                        ""
                      )
                      .slice(
                        0,
                        6
                      );

                  setOtp(value);

                  setErrors(
                    (prev) => ({
                      ...prev,
                      otp: "",
                    })
                  );
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
                onClick={
                  handleVerifyOTP
                }
                disabled={
                  otpLoading ||
                  otp.length !== 6
                }
              >
                {otpLoading
                  ? t.loading
                  : t.verifyOtpLogin}
              </button>


              <button
                type="button"
                className="btn btn-link w-100 mt-2"
                onClick={
                  handleLoginAgain
                }
              >
                {language === "Marathi"
                  ? "पुन्हा लॉगिन करा"
                  : language === "Hindi"
                  ? "फिर से लॉगिन करें"
                  : "Login Again"}
              </button>

            </div>

          )}


          {/* REGISTER */}

          <div className="text-center mt-4">

            <span>
              {t.noAccount}
            </span>

            <br />

            <Link to="/register">
              {t.registerHere}
            </Link>

          </div>

        </form>

      </div>

    </div>
  );
}

export default CitizenLogin;