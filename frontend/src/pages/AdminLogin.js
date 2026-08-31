import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUserShield,
} from "react-icons/fa";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

function AdminLogin() {
  const navigate = useNavigate();

  // ==================================================
  // LANGUAGE + THEME
  // ==================================================

  const {
    language,
    darkMode,
  } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  // ==================================================
  // FORM
  // ==================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ==================================================
  // STATES
  // ==================================================

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] =
    useState(false);

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      server: "",
    }));
  };

  // ==================================================
  // VALIDATION
  // ==================================================

  const validateForm = () => {
    const validationErrors = {};

    const email =
      formData.email.trim();

    const password =
      formData.password;

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // EMAIL

    if (!email) {
      validationErrors.email =
        language === "Marathi"
          ? "ॲडमिन ईमेल आवश्यक आहे."
          : language === "Hindi"
          ? "एडमिन ईमेल आवश्यक है।"
          : "Admin email is required.";
    } else if (
      !emailRegex.test(email)
    ) {
      validationErrors.email =
        language === "Marathi"
          ? "वैध ईमेल पत्ता टाका."
          : language === "Hindi"
          ? "मान्य ईमेल पता दर्ज करें।"
          : "Enter a valid email address.";
    }

    // PASSWORD

    if (!password) {
      validationErrors.password =
        language === "Marathi"
          ? "पासवर्ड आवश्यक आहे."
          : language === "Hindi"
          ? "पासवर्ड आवश्यक है।"
          : "Password is required.";
    }

    return validationErrors;
  };

  // ==================================================
  // ADMIN LOGIN
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length >
      0
    ) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // ==================================================
      // ADMIN LOGIN API
      // ==================================================

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/admin-login",
          {
            email:
              formData.email
                .trim()
                .toLowerCase(),

            password:
              formData.password,
          }
        );

      const data =
        response.data;

      // ==================================================
      // CHECK RESPONSE
      // ==================================================

      if (
        !data ||
        !data.user
      ) {
        setErrors({
          server:
            language === "Marathi"
              ? "सर्व्हरकडून वापरकर्त्याची माहिती मिळाली नाही."
              : language === "Hindi"
              ? "सर्वर से उपयोगकर्ता की जानकारी प्राप्त नहीं हुई।"
              : "User information was not received.",
        });

        return;
      }

      // ==================================================
      // ADMIN ROLE CHECK
      // ==================================================

      if (
        !data.user.role ||
        data.user.role.toLowerCase() !==
          "admin"
      ) {
        setErrors({
          server:
            t.accessDenied ||
            (
              language === "Marathi"
                ? "या खात्याला ॲडमिन प्रवेशाची परवानगी नाही."
                : language === "Hindi"
                ? "इस खाते को एडमिन एक्सेस की अनुमति नहीं है।"
                : "This account is not authorized as an administrator."
            ),
        });

        return;
      }

      // ==================================================
      // TOKEN CHECK
      // ==================================================

      if (!data.token) {
        setErrors({
          server:
            language === "Marathi"
              ? "लॉगिन टोकन मिळाला नाही."
              : language === "Hindi"
              ? "लॉगिन टोकन प्राप्त नहीं हुआ।"
              : "Login token was not received.",
        });

        return;
      }

      // ==================================================
      // SAVE TOKEN
      // ==================================================

      localStorage.setItem(
        "token",
        data.token
      );

      // ==================================================
      // SAVE USER
      // ==================================================

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // ==================================================
      // SAVE CURRENT USER
      // ==================================================

      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id:
            data.user.id ||
            data.user._id ||
            null,

          name:
            data.user.name || "",

          email:
            data.user.email || "",

          mobile:
            data.user.mobile || "",

          role:
            data.user.role || "admin",
        })
      );

      // ==================================================
      // ADMIN DASHBOARD
      // ==================================================

      navigate(
        "/admin-dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      // ==================================================
      // BACKEND ERROR
      // ==================================================

      if (error.response) {
        setErrors({
          server:
            error.response.data?.message ||
            (
              language === "Marathi"
                ? "ॲडमिन ईमेल किंवा पासवर्ड चुकीचा आहे."
                : language === "Hindi"
                ? "एडमिन ईमेल या पासवर्ड गलत है।"
                : "Invalid admin email or password."
            ),
        });

      } else if (error.request) {
        setErrors({
          server:
            language === "Marathi"
              ? "सर्व्हरशी कनेक्ट होता आले नाही. Backend सुरू आहे का तपासा."
              : language === "Hindi"
              ? "सर्वर से कनेक्ट नहीं हो सका। Backend चालू आहे का तपासा."
              : "Unable to connect to the server. Please make sure the backend is running.",
        });

      } else {
        setErrors({
          server:
            language === "Marathi"
              ? "काहीतरी चूक झाली. पुन्हा प्रयत्न करा."
              : language === "Hindi"
              ? "कुछ गलत हुआ। कृपया पुनः प्रयास करें।"
              : "Something went wrong. Please try again.",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor:
          darkMode
            ? "#0f172a"
            : "#f2f8f5",
        padding: "20px",
      }}
    >

      <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4">

        <div
          className={
            darkMode
              ? "card shadow-lg border-0 p-4 bg-dark text-light"
              : "card shadow-lg border-0 p-4"
          }
          style={{
            borderRadius: "18px",
          }}
        >

          {/* ==================================================
              BACK BUTTON
          ================================================== */}

          <button
            type="button"
            className={
              darkMode
                ? "btn btn-link text-decoration-none text-start p-0 mb-4 text-light"
                : "btn btn-link text-decoration-none text-start p-0 mb-4"
            }
            onClick={() =>
              navigate("/")
            }
          >
            <FaArrowLeft className="me-2" />

            {t.home || "Home"}
          </button>


          {/* ==================================================
              ADMIN ICON
          ================================================== */}

          <div className="text-center mb-3">

            <div
              style={{
                width: "68px",
                height: "68px",
                margin: "0 auto",

                borderRadius: "50%",

                background:
                  darkMode
                    ? "rgba(25, 135, 84, 0.18)"
                    : "#e7f6ee",

                color: "#198754",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                fontSize: "28px",
              }}
            >
              <FaUserShield />
            </div>

          </div>


          {/* ==================================================
              TITLE
          ================================================== */}

          <h2
            className="text-center mb-2"
          >
            {t.adminLogin ||
              "Admin Login"}
          </h2>


          <p
            className={
              darkMode
                ? "text-center text-secondary mb-4"
                : "text-center text-muted mb-4"
            }
          >
            {t.adminPortal ||
              (
                language === "Marathi"
                  ? "CivicPulse AI प्रशासन"
                  : language === "Hindi"
                  ? "CivicPulse AI प्रशासन"
                  : "CivicPulse AI Administration"
              )}
          </p>


          {/* ==================================================
              SERVER ERROR
          ================================================== */}

          {errors.server && (
            <div
              className="alert alert-danger text-center"
              role="alert"
            >
              {errors.server}
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
                htmlFor="adminEmail"
                className="form-label fw-bold"
              >
                {language === "Marathi"
                  ? "ॲडमिन ईमेल"
                  : language === "Hindi"
                  ? "एडमिन ईमेल"
                  : "Admin Email"}
              </label>


              <input
                id="adminEmail"
                type="email"
                name="email"

                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}

                placeholder={
                  language === "Marathi"
                    ? "ॲडमिन ईमेल टाका"
                    : language === "Hindi"
                    ? "एडमिन ईमेल दर्ज करें"
                    : "Enter admin email"
                }

                value={
                  formData.email
                }

                onChange={
                  handleChange
                }

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

            <div className="mb-4">

              <label
                htmlFor="adminPassword"
                className="form-label fw-bold"
              >
                {t.password ||
                  "Password"}
              </label>


              <div className="input-group">

                <input
                  id="adminPassword"
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
                    t.enterPassword ||
                    "Enter password"
                  }

                  value={
                    formData.password
                  }

                  onChange={
                    handleChange
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


            {/* ==================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="btn w-100 py-2 fw-semibold"
              style={{
                backgroundColor:
                  "#198754",
                borderColor:
                  "#198754",
                color: "#ffffff",
                borderRadius: "9px",
              }}
              disabled={
                loading
              }
            >
              {loading
                ? (
                  t.loggingIn ||
                  (
                    language === "Marathi"
                      ? "लॉगिन होत आहे..."
                      : language === "Hindi"
                      ? "लॉगिन हो रहा है..."
                      : "Logging in..."
                  )
                )
                : (
                  language === "Marathi"
                    ? "ॲडमिन म्हणून लॉगिन करा"
                    : language === "Hindi"
                    ? "एडमिन के रूप में लॉगिन करें"
                    : "Login as Admin"
                )}
            </button>

          </form>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div
            className="text-center mt-4"
          >

            <small
              className={
                darkMode
                  ? "text-secondary"
                  : "text-muted"
              }
            >
              {language === "Marathi"
                ? "हे पोर्टल फक्त अधिकृत ॲडमिनसाठी आहे."
                : language === "Hindi"
                ? "यह पोर्टल केवल अधिकृत एडमिन के लिए है।"
                : "This portal is restricted to authorized administrators."}
            </small>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;