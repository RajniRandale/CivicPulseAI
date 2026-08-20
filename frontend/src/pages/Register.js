import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaUser,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";

import "./Register.css";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

function Register() {
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
  // API URLS
  // ==================================================

  const AUTH_REGISTER_URL =
    "http://localhost:5000/api/auth/register";

  const SEND_EMAIL_OTP_URL =
    "http://localhost:5000/api/otp/send-email-otp";

  const VERIFY_EMAIL_OTP_URL =
    "http://localhost:5000/api/otp/verify-email-otp";


  // ==================================================
  // FORM DATA
  // ==================================================

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });


  // ==================================================
  // EMAIL OTP
  // ==================================================

  const [emailOTP, setEmailOTP] =
    useState("");

  const [emailOTPSent, setEmailOTPSent] =
    useState(false);

  const [emailVerified, setEmailVerified] =
    useState(false);


  // ==================================================
  // LOADING
  // ==================================================

  const [emailLoading, setEmailLoading] =
    useState(false);

  const [registerLoading, setRegisterLoading] =
    useState(false);


  // ==================================================
  // ERRORS / SUCCESS
  // ==================================================

  const [errors, setErrors] =
    useState({});

  const [successMessage, setSuccessMessage] =
    useState("");


  // ==================================================
  // PASSWORD VISIBILITY
  // ==================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    let newValue = value;


    // Full Name
    if (name === "fullName") {
      newValue = value.replace(
        /[^A-Za-z ]/g,
        ""
      );
    }


    // Mobile
    if (name === "mobile") {
      newValue = value
        .replace(/\D/g, "")
        .slice(0, 10);
    }


    // Email changed
    if (name === "email") {
      setEmailVerified(false);
      setEmailOTPSent(false);
      setEmailOTP("");
    }


    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));


    setErrors((prev) => ({
      ...prev,
      [name]: "",
      emailOTP: "",
      general: "",
    }));


    setSuccessMessage("");
  };


  // ==================================================
  // SEND EMAIL OTP
  // ==================================================

  const handleSendEmailOTP = async () => {
    const email =
      formData.email
        .trim()
        .toLowerCase();


    if (!email) {
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


    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailRegex.test(email)) {
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
      setEmailLoading(true);
      setErrors({});
      setSuccessMessage("");


      const response =
        await axios.post(
          SEND_EMAIL_OTP_URL,
          {
            email,
          }
        );


      console.log(
        "SEND EMAIL OTP RESPONSE:",
        response.data
      );


      setEmailOTPSent(true);


      setSuccessMessage(
        language === "Marathi"
          ? "OTP तुमच्या Gmail वर पाठवला आहे."
          : language === "Hindi"
          ? "OTP आपके Gmail पर भेजा गया है।"
          : "OTP sent to your Gmail. Please check your Inbox or Spam."
      );

    } catch (error) {

      console.error(
        "Send email OTP error:",
        error
      );


      setErrors({
        email:
          error.response?.data?.message ||
          (language === "Marathi"
            ? "ईमेल OTP पाठवता आला नाही."
            : language === "Hindi"
            ? "ईमेल OTP भेजने में विफल।"
            : "Failed to send email OTP."),
      });

    } finally {
      setEmailLoading(false);
    }
  };


  // ==================================================
  // VERIFY EMAIL OTP
  // ==================================================

  const handleVerifyEmailOTP =
    async () => {

      if (
        !emailOTP ||
        emailOTP.length !== 6
      ) {
        setErrors({
          emailOTP:
            language === "Marathi"
              ? "6 अंकी OTP टाका."
              : language === "Hindi"
              ? "6 अंकों का OTP दर्ज करें।"
              : "Enter the 6-digit OTP.",
        });

        return;
      }


      try {

        setEmailLoading(true);
        setErrors({});
        setSuccessMessage("");


        const response =
          await axios.post(
            VERIFY_EMAIL_OTP_URL,
            {
              email:
                formData.email
                  .trim()
                  .toLowerCase(),

              otp: emailOTP,
            }
          );


        if (response.data.verified) {

          setEmailVerified(true);

          setEmailOTPSent(false);

          setEmailOTP("");


          setSuccessMessage(
            language === "Marathi"
              ? "✓ ईमेल यशस्वीपणे सत्यापित झाले."
              : language === "Hindi"
              ? "✓ ईमेल सफलतापूर्वक सत्यापित हो गया।"
              : "✓ Email verified successfully."
          );
        }

      } catch (error) {

        console.error(
          "Verify email OTP error:",
          error
        );


        setErrors({
          emailOTP:
            error.response?.data?.message ||
            (language === "Marathi"
              ? "अवैध OTP."
              : language === "Hindi"
              ? "अमान्य OTP।"
              : "Invalid email OTP."),
        });

      } finally {
        setEmailLoading(false);
      }
    };


  // ==================================================
  // REGISTER
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();


    const newErrors = {};


    // ==================================================
    // FULL NAME
    // ==================================================

    if (!formData.fullName.trim()) {

      newErrors.fullName =
        language === "Marathi"
          ? "पूर्ण नाव आवश्यक आहे."
          : language === "Hindi"
          ? "पूरा नाम आवश्यक है।"
          : "Full Name is required.";

    } else if (
      formData.fullName.trim().length < 3
    ) {

      newErrors.fullName =
        language === "Marathi"
          ? "पूर्ण नावात किमान 3 अक्षरे असावीत."
          : language === "Hindi"
          ? "पूरा नाम कम से कम 3 अक्षरों का होना चाहिए।"
          : "Full Name must contain at least 3 characters.";
    }


    // ==================================================
    // EMAIL
    // ==================================================

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!formData.email.trim()) {

      newErrors.email =
        language === "Marathi"
          ? "ईमेल आवश्यक आहे."
          : language === "Hindi"
          ? "ईमेल आवश्यक है।"
          : "Email is required.";

    } else if (
      !emailRegex.test(
        formData.email.trim()
      )
    ) {

      newErrors.email =
        language === "Marathi"
          ? "वैध ईमेल पत्ता टाका."
          : language === "Hindi"
          ? "एक वैध ईमेल पता दर्ज करें।"
          : "Enter a valid email address.";
    }


    // ==================================================
    // EMAIL VERIFICATION
    // ==================================================

    if (!emailVerified) {

      newErrors.email =
        language === "Marathi"
          ? "कृपया प्रथम ईमेल सत्यापित करा."
          : language === "Hindi"
          ? "कृपया पहले अपना ईमेल सत्यापित करें।"
          : "Please verify your email first.";
    }


    // ==================================================
    // MOBILE
    // ==================================================

    if (
      !/^\d{10}$/.test(
        formData.mobile
      )
    ) {

      newErrors.mobile =
        language === "Marathi"
          ? "मोबाईल नंबर 10 अंकी असावा."
          : language === "Hindi"
          ? "मोबाइल नंबर 10 अंकों का होना चाहिए।"
          : "Mobile number must be exactly 10 digits.";
    }


    // ==================================================
    // PASSWORD
    // ==================================================

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


    if (!formData.password) {

      newErrors.password =
        language === "Marathi"
          ? "पासवर्ड आवश्यक आहे."
          : language === "Hindi"
          ? "पासवर्ड आवश्यक है।"
          : "Password is required.";

    } else if (
      !passwordRegex.test(
        formData.password
      )
    ) {

      newErrors.password =
        language === "Marathi"
          ? "पासवर्डमध्ये मोठे अक्षर, लहान अक्षर, अंक आणि विशेष चिन्ह असावे व किमान 8 अक्षरे असावीत."
          : language === "Hindi"
          ? "पासवर्ड में बड़ा अक्षर, छोटा अक्षर, संख्या और विशेष चिन्ह होना चाहिए तथा कम से कम 8 अक्षर होने चाहिए।"
          : "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.";
    }


    // ==================================================
    // CONFIRM PASSWORD
    // ==================================================

    if (!formData.confirmPassword) {

      newErrors.confirmPassword =
        language === "Marathi"
          ? "कृपया पासवर्डची पुष्टी करा."
          : language === "Hindi"
          ? "कृपया अपने पासवर्ड की पुष्टि करें।"
          : "Please confirm your password.";

    } else if (
      formData.confirmPassword !==
      formData.password
    ) {

      newErrors.confirmPassword =
        language === "Marathi"
          ? "पासवर्ड जुळत नाहीत."
          : language === "Hindi"
          ? "पासवर्ड मेल नहीं खाते।"
          : "Passwords do not match.";
    }


    // ==================================================
    // STOP IF ERROR
    // ==================================================

    if (
      Object.keys(newErrors).length > 0
    ) {

      setErrors(newErrors);
      setSuccessMessage("");

      return;
    }


    // ==================================================
    // REGISTER API
    // ==================================================

    try {

      setRegisterLoading(true);
      setErrors({});
      setSuccessMessage("");


      const response =
        await axios.post(
          AUTH_REGISTER_URL,
          {
            name:
              formData.fullName.trim(),

            email:
              formData.email
                .trim()
                .toLowerCase(),

            mobile:
              formData.mobile.trim(),

            password:
              formData.password,
          }
        );


      console.log(
        "REGISTER RESPONSE:",
        response.data
      );


      setSuccessMessage(
        language === "Marathi"
          ? "नोंदणी यशस्वी झाली!"
          : language === "Hindi"
          ? "पंजीकरण सफल हुआ!"
          : "Registration successful!"
      );


      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
      });


      setEmailOTP("");
      setEmailVerified(false);
      setEmailOTPSent(false);


      setTimeout(() => {
        navigate(
          "/citizen-login",
          {
            replace: true,
          }
        );
      }, 1000);

    } catch (error) {

      console.error(
        "Registration error:",
        error
      );


      setErrors({
        general:
          error.response?.data?.message ||
          (language === "Marathi"
            ? "नोंदणी अयशस्वी झाली."
            : language === "Hindi"
            ? "पंजीकरण विफल हुआ।"
            : "Registration failed."),
      });

    } finally {
      setRegisterLoading(false);
    }
  };


  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="container mt-5 mb-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow-lg">

            {/* HEADER */}

            <div className="card-header bg-primary text-white text-center py-3">

              <h3 className="mb-0">
                {language === "Marathi"
                  ? "नागरिक खाते तयार करा"
                  : language === "Hindi"
                  ? "नागरिक खाता बनाएँ"
                  : "Create Citizen Account"}
              </h3>

              <small>
                {language === "Marathi"
                  ? "तक्रारी नोंदवण्यासाठी आणि त्यांचा मागोवा घेण्यासाठी नोंदणी करा"
                  : language === "Hindi"
                  ? "शिकायत दर्ज करने और ट्रैक करने के लिए पंजीकरण करें"
                  : "Register to report and track complaints"}
              </small>

            </div>


            <div className="card-body p-4">

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


              <form onSubmit={handleSubmit}>

                {/* FULL NAME */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    <FaUser className="me-2" />

                    {t.fullName}

                  </label>

                  <input
                    type="text"
                    name="fullName"
                    className={`form-control ${
                      errors.fullName
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder={
                      language === "Marathi"
                        ? "तुमचे पूर्ण नाव टाका"
                        : language === "Hindi"
                        ? "अपना पूरा नाम दर्ज करें"
                        : "Enter your full name"
                    }
                    value={
                      formData.fullName
                    }
                    onChange={handleChange}
                  />

                  {errors.fullName && (
                    <div className="invalid-feedback">
                      {errors.fullName}
                    </div>
                  )}

                </div>


                {/* EMAIL */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    <FaEnvelope className="me-2" />

                    {t.email}

                  </label>


                  <div className="input-group">

                    <input
                      type="email"
                      name="email"
                      className={`form-control ${
                        errors.email
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder={
                        t.enterEmail
                      }
                      value={
                        formData.email
                      }
                      onChange={
                        handleChange
                      }
                      disabled={
                        emailVerified
                      }
                    />


                    {!emailVerified && (

                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={
                          emailOTPSent
                            ? handleVerifyEmailOTP
                            : handleSendEmailOTP
                        }
                        disabled={
                          emailLoading
                        }
                      >
                        {emailLoading
                          ? "..."
                          : emailOTPSent
                          ? t.verifyOtp
                          : "Verify"}
                      </button>

                    )}


                    {emailVerified && (

                      <span className="input-group-text text-success fw-bold">
                        ✓ Verified
                      </span>

                    )}

                  </div>


                  {errors.email && (
                    <div className="text-danger small mt-1">
                      {errors.email}
                    </div>
                  )}


                  {/* EMAIL OTP */}

                  {emailOTPSent &&
                    !emailVerified && (

                      <div className="mt-2">

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
                            errors.emailOTP
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
                          value={
                            emailOTP
                          }
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

                            setEmailOTP(
                              value
                            );

                            setErrors(
                              (prev) => ({
                                ...prev,
                                emailOTP:
                                  "",
                              })
                            );
                          }}
                        />

                        {errors.emailOTP && (
                          <div className="text-danger small mt-1">
                            {errors.emailOTP}
                          </div>
                        )}


                        <button
                          type="button"
                          className="btn btn-success w-100 mt-2"
                          onClick={
                            handleVerifyEmailOTP
                          }
                          disabled={
                            emailLoading ||
                            emailOTP.length !== 6
                          }
                        >
                          {emailLoading
                            ? t.loading
                            : t.verifyOtp}
                        </button>


                        <small className="text-muted d-block mt-2">
                          {language === "Marathi"
                            ? "OTP 10 मिनिटांसाठी वैध आहे."
                            : language === "Hindi"
                            ? "OTP 10 मिनटों के लिए मान्य है।"
                            : "OTP is valid for 10 minutes."}
                        </small>

                      </div>

                    )}

                </div>


                {/* MOBILE */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    <FaPhone className="me-2" />

                    {t.mobileNumber}

                  </label>


                  <input
                    type="text"
                    name="mobile"
                    className={`form-control ${
                      errors.mobile
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder={
                      language === "Marathi"
                        ? "10 अंकी मोबाईल नंबर टाका"
                        : language === "Hindi"
                        ? "10 अंकों का मोबाइल नंबर दर्ज करें"
                        : "Enter 10 digit mobile number"
                    }
                    value={
                      formData.mobile
                    }
                    onChange={
                      handleChange
                    }
                    maxLength="10"
                    inputMode="numeric"
                  />

                  {errors.mobile && (
                    <div className="invalid-feedback">
                      {errors.mobile}
                    </div>
                  )}

                </div>


                {/* PASSWORD */}

                <div className="mb-3">

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
                      name="password"
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
                        handleChange
                      }
                    />


                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(
                          (prev) =>
                            !prev
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


                  <small className="text-muted">
                    {language === "Marathi"
                      ? "किमान 8 अक्षरे, मोठे/लहान अक्षर, अंक आणि विशेष चिन्ह असावे."
                      : language === "Hindi"
                      ? "कम से कम 8 अक्षर, बड़ा/छोटा अक्षर, संख्या और विशेष चिन्ह होना चाहिए।"
                      : "Minimum 8 characters with uppercase, lowercase, number and special character."}
                  </small>

                </div>


                {/* CONFIRM PASSWORD */}

                <div className="mb-4">

                  <label className="form-label fw-bold">
                    {t.confirmPassword}
                  </label>


                  <div className="input-group">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      className={`form-control ${
                        errors.confirmPassword
                          ? "is-invalid"
                          : ""
                      }`}
                      placeholder={
                        language === "Marathi"
                          ? "पासवर्डची पुष्टी करा"
                          : language === "Hindi"
                          ? "पासवर्ड की पुष्टि करें"
                          : "Confirm your password"
                      }
                      value={
                        formData.confirmPassword
                      }
                      onChange={
                        handleChange
                      }
                    />


                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(
                          (prev) =>
                            !prev
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

                </div>


                {/* REGISTER */}

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg"
                  disabled={
                    registerLoading
                  }
                >
                  {registerLoading
                    ? t.loading
                    : t.register}
                </button>

              </form>


              {/* LOGIN */}

              <div className="text-center mt-4">

                <span>
                  {t.alreadyAccount}{" "}
                </span>

                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() =>
                    navigate(
                      "/citizen-login"
                    )
                  }
                >
                  {language === "Marathi"
                    ? "लॉगिन"
                    : language === "Hindi"
                    ? "लॉगिन"
                    : "Login"}
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Register;