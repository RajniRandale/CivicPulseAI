import React, { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaCheck,
  FaUsers,
} from "react-icons/fa";

import axios from "axios";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";
import "./CitizenLogin.css";

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

  const [resolvedCount, setResolvedCount] =
    useState(null);

  const [activeCitizens, setActiveCitizens] =
    useState(null);

  React.useEffect(() => {
    axios.get("http://localhost:5000/api/complaints/stats")
      .then((response) => {
        setResolvedCount(response.data?.resolvedComplaints ?? 0);
        setActiveCitizens(response.data?.activeCitizens ?? 0);
      })
      .catch((error) => {
        console.error("Failed to fetch project statistics:", error);
        setResolvedCount(null);
      });
  }, []);


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

    // Correct email regex
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    // EMAIL VALIDATION

    if (!email) {
      newErrors.email =
        language === "Marathi"
          ? "ईमेल आवश्यक आहे."
          : language === "Hindi"
          ? "ईमेल आवश्यक है।"
          : "Email is required.";

    } else if (!emailRegex.test(email)) {
      newErrors.email =
        language === "Marathi"
          ? "वैध ईमेल पत्ता टाका."
          : language === "Hindi"
          ? "मान्य ईमेल पता दर्ज करें।"
          : "Enter a valid email address.";
    }


    // PASSWORD VALIDATION

    if (!password) {
      newErrors.password =
        language === "Marathi"
          ? "पासवर्ड आवश्यक आहे."
          : language === "Hindi"
          ? "पासवर्ड आवश्यक है।"
          : "Password is required.";
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


      // USER CHECK

      if (!user) {
        setErrors({
          email:
            "User information was not received.",
        });

        return;
      }


      // CITIZEN ROLE CHECK

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


      // OTP CHECK

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


      // Clear password after OTP sent

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
            ? "OTP मध्ये नेमके 6 अंक असावेत."
            : language === "Hindi"
            ? "OTP में ठीक 6 अंक होने चाहिए।"
            : "OTP must contain exactly 6 digits.",
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


      // USER CHECK

      if (!user) {
        setErrors({
          otp:
            "User information was not received.",
        });

        return;
      }


      // CITIZEN ROLE CHECK

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


      // TOKEN CHECK

      if (!response.data.token) {
        setErrors({
          otp:
            "Login token was not received.",
        });

        return;
      }


      // SAVE TOKEN

      localStorage.setItem(
        "token",
        response.data.token
      );


      // SAVE USER

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );


      // SAVE CURRENT USER

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


      // REDIRECT

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
      className="citizen-login-page container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#f4f8ff",
        padding: "20px",
      }}
    >

      <div className="citizen-login-layout row align-items-center justify-content-center">

        <div className="citizen-login-visual col-12 col-lg-6">
          <div className="citizen-hero-art">
            <div className="citizen-stat citizen-stat-left">
              <span className="citizen-stat-icon resolved-icon"><FaCheck /></span>
              <div>
              <span>ISSUES RESOLVED</span>
              <strong>{resolvedCount ?? "--"}</strong>
              </div>
            </div>

            <div className="citizen-logo-mark">C</div>

            <div className="citizen-stat citizen-stat-right">
              <span className="citizen-stat-icon citizens-icon"><FaUsers /></span>
              <div>
              <span>ACTIVE CITIZENS</span>
              <strong>{activeCitizens ?? "--"}</strong>
              </div>
            </div>

            <h1>Your City,<br /><b>Your Voice.</b></h1>
            <p>Empowering citizens to report problems, track progress, and hold authorities accountable transparently.</p>

            <div className="citizen-city-visual" aria-hidden="true">
              <i></i><i></i><i></i><i></i><i></i>
            </div>

            <div className="citizen-hero-pills">
              <span>⌾ Live Map Tracking</span>
              <span>✓ Real-time Resolve</span>
            </div>

          </div>
        </div>

        <div className="citizen-login-form-column col-12 col-lg-5 col-xl-4">

        <div className="card shadow-lg border-0 p-4">

          {/* ==================================================
              BACK BUTTON
          ================================================== */}

          <button
            type="button"
            className="btn btn-link text-decoration-none text-start p-0 mb-4"
            onClick={() =>
              navigate("/")
            }
          >
            <FaArrowLeft className="me-2" />

            {t.home}

          </button>


          {/* ==================================================
              CITIZEN ICON
          ================================================== */}

          <div className="text-center mb-3">

            <div
              style={{
                width: "58px",
                height: "58px",
                margin: "0 auto",
                borderRadius: "50%",
                backgroundColor: "#e8f5e9",
                color: "#198754",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px",
              }}
            >
              👤
            </div>

          </div>


          {/* ==================================================
              TITLE
          ================================================== */}

          <h2 className="text-center mb-2">

            {t.citizenLogin ||
              "Citizen Login"}

          </h2>


          <p className="text-center text-muted mb-4">

            {language === "Marathi"
              ? "नागरिक पोर्टलमध्ये सुरक्षितपणे लॉगिन करा"
              : language === "Hindi"
              ? "नागरिक पोर्टल में सुरक्षित रूप से लॉगिन करें"
              : "Securely login to your citizen portal"}

          </p>


          {/* ==================================================
              GENERAL ERROR
          ================================================== */}

          {errors.general && (

            <div className="alert alert-danger text-center">
              {errors.general}
            </div>

          )}


          {/* ==================================================
              FORM
          ================================================== */}

          <form
            onSubmit={handleSubmit}
          >

            {/* ==================================================
                EMAIL
            ================================================== */}

            <div className="mb-3">

              <label
                htmlFor="citizenEmail"
                className="form-label fw-bold"
              >
                {t.email}
              </label>


              <input
                id="citizenEmail"
                type="email"
                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}
                name="email"
                placeholder={
                  t.enterEmail ||
                  "Enter your email"
                }
                value={
                  formData.email
                }
                onChange={
                  handleEmailChange
                }
                disabled={otpSent}
                autoComplete="email"
              />


              {errors.email && (

                <div className="invalid-feedback">
                  {errors.email}
                </div>

              )}

            </div>


            {/* ==================================================
                PASSWORD
            ================================================== */}

            {!otpSent && (

              <div className="mb-3">

                <label
                  htmlFor="citizenPassword"
                  className="form-label fw-bold"
                >
                  {t.password}
                </label>


                <div className="input-group">

                  <input
                    id="citizenPassword"
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
                    name="password"
                    placeholder={
                      t.enterPassword ||
                      "Enter Password"
                    }
                    value={
                      formData.password
                    }
                    onChange={
                      handlePasswordChange
                    }
                    autoComplete="current-password"
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
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
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


            {/* ==================================================
                FORGOT PASSWORD
            ================================================== */}

            {!otpSent && (

              <div className="text-end mb-3">

                <button
                  type="button"
                  className="btn btn-link p-0 text-decoration-none"
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


            {/* ==================================================
                LOGIN BUTTON
            ================================================== */}

            {!otpSent && (

              <button
                type="submit"
                className="btn btn-success w-100 py-2"
                disabled={loading}
              >

                {loading
                  ? (
                    t.loading ||
                    "Logging in..."
                  )
                  : (
                    t.sendOtp ||
                    "Login & Send OTP"
                  )}

              </button>

            )}


            {/* ==================================================
                OTP SECTION
            ================================================== */}

            {otpSent && (

              <div className="mt-3">

                <div className="alert alert-info text-center">

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


                <label
                  htmlFor="loginOtp"
                  className="form-label fw-bold"
                >

                  {language === "Marathi"
                    ? "Email OTP टाका"
                    : language === "Hindi"
                    ? "Email OTP दर्ज करें"
                    : "Enter Email OTP"}

                </label>


                <input
                  id="loginOtp"
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
                  className="btn btn-success w-100 py-2 mt-3"
                  onClick={
                    handleVerifyOTP
                  }
                  disabled={
                    otpLoading ||
                    otp.length !== 6
                  }
                >

                  {otpLoading
                    ? (
                      t.loading ||
                      "Verifying..."
                    )
                    : (
                      t.verifyOtpLogin ||
                      "Verify OTP & Login"
                    )}

                </button>


                <button
                  type="button"
                  className="btn btn-link w-100 mt-2"
                  onClick={
                    handleLoginAgain
                  }
                >

                  {t.loginAgain ||
                    "Login Again"}

                </button>

              </div>

            )}


            {/* ==================================================
                REGISTER
            ================================================== */}

            <div className="text-center mt-4">

              <small className="text-muted">
                {t.noAccount}
              </small>

              <br />

              <Link
                to="/register"
                className="text-decoration-none fw-bold"
              >
                {t.registerHere ||
                  t.register}
              </Link>

            </div>

          </form>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="text-center mt-4">

            <small className="text-muted">

              {language === "Marathi"
                ? "नागरिकांसाठी अधिकृत पोर्टल"
                : language === "Hindi"
                ? "नागरिकों के लिए आधिकारिक पोर्टल"
                : "Official portal for citizens."}

            </small>

          </div>

        </div>

        </div>

      </div>

    </div>
  );
}

export default CitizenLogin;