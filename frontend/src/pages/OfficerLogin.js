import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
  FaUserTie,
} from "react-icons/fa";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

function OfficerLogin() {
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
  // FORM
  // ==================================================

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });


  // ==================================================
  // STATES
  // ==================================================

  const [errors, setErrors] =
    useState({});

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);


  // ==================================================
  // HANDLE INPUT
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


    if (!email) {

      validationErrors.email =
        t.officerEmailRequired ||
        (
          language === "Marathi"
            ? "अधिकारी ईमेल आवश्यक आहे."
            : language === "Hindi"
            ? "अधिकारी ईमेल आवश्यक है।"
            : "Officer email is required."
        );

    } else if (
      !emailRegex.test(email)
    ) {

      validationErrors.email =
        t.validEmail ||
        (
          language === "Marathi"
            ? "वैध ईमेल पत्ता टाका."
            : language === "Hindi"
            ? "मान्य ईमेल पता दर्ज करें।"
            : "Enter a valid email address."
        );

    }


    if (!password) {

      validationErrors.password =
        t.passwordRequired ||
        (
          language === "Marathi"
            ? "पासवर्ड आवश्यक आहे."
            : language === "Hindi"
            ? "पासवर्ड आवश्यक है।"
            : "Password is required."
        );

    }

    return validationErrors;
  };


  // ==================================================
  // LOGIN
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors =
      validateForm();

    if (
      Object.keys(validationErrors).length > 0
    ) {

      setErrors(validationErrors);
      return;
    }


    try {

      setLoading(true);
      setErrors({});


      // ==================================================
      // OFFICER LOGIN API
      // ==================================================

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/officer-login",
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
            t.invalidServerResponse ||
            (
              language === "Marathi"
                ? "सर्व्हरकडून वैध प्रतिसाद मिळाला नाही."
                : language === "Hindi"
                ? "सर्वर से वैध प्रतिक्रिया प्राप्त नहीं हुई।"
                : "Invalid response received from server."
            ),
        });

        return;
      }


      // ==================================================
      // CHECK OFFICER ROLE
      // ==================================================

      if (
        !data.user.role ||
        data.user.role.toLowerCase() !==
          "officer"
      ) {

        setErrors({
          server:
            t.notOfficerAccount ||
            (
              language === "Marathi"
                ? "या खात्याला अधिकारी म्हणून प्रवेशाची परवानगी नाही."
                : language === "Hindi"
                ? "यह खाता अधिकारी के रूप में अधिकृत नहीं है।"
                : "This account is not authorized as an officer."
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
            t.noLoginToken ||
            (
              language === "Marathi"
                ? "लॉगिन टोकन मिळाला नाही."
                : language === "Hindi"
                ? "लॉगिन टोकन प्राप्त नहीं हुआ।"
                : "Login token was not received from server."
            ),
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
            data.user.role || "officer",

          department:
            data.user.department || "",

          designation:
            data.user.designation || "",
        })
      );


      // ==================================================
      // REDIRECT
      // ==================================================

      navigate(
        "/officer-dashboard",
        {
          replace: true,
        }
      );

    } catch (error) {

      console.error(
        "Officer login error:",
        error
      );


      if (error.response) {

        setErrors({
          server:
            error.response.data?.message ||
            t.invalidOfficerLogin ||
            (
              language === "Marathi"
                ? "अधिकारी ईमेल किंवा पासवर्ड चुकीचा आहे."
                : language === "Hindi"
                ? "अधिकारी ईमेल या पासवर्ड गलत है।"
                : "Invalid officer email or password."
            ),
        });

      } else if (error.request) {

        setErrors({
          server:
            t.serverConnectionError ||
            (
              language === "Marathi"
                ? "सर्व्हरशी कनेक्ट होता आले नाही. Backend सुरू आहे का तपासा."
                : language === "Hindi"
                ? "सर्वर से कनेक्ट नहीं हो सका। कृपया जांचें कि backend चल रहा है।"
                : "Unable to connect to the server. Please make sure the backend is running."
            ),
        });

      } else {

        setErrors({
          server:
            t.somethingWentWrong ||
            (
              language === "Marathi"
                ? "काहीतरी चूक झाली. पुन्हा प्रयत्न करा."
                : language === "Hindi"
                ? "कुछ गलत हुआ। कृपया फिर से प्रयास करें।"
                : "Something went wrong. Please try again."
            ),
        });

      }

    } finally {

      setLoading(false);

    }
  };


  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#f4f8ff",
        padding: "20px",
      }}
    >

      <div
        className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4"
      >

        <div
          className="card shadow-lg border-0 p-4"
        >

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
              OFFICER ICON
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

              <FaUserTie />

            </div>

          </div>


          {/* ==================================================
              TITLE
          ================================================== */}

          <h2 className="text-center mb-2">

            {t.officerLogin ||
              "Officer Login"}

          </h2>


          <p className="text-center text-muted mb-4">

            {t.authorizedOfficers ||
              (
                language === "Marathi"
                  ? "फक्त अधिकृत अधिकाऱ्यांसाठी"
                  : language === "Hindi"
                  ? "केवल अधिकृत अधिकारियों के लिए"
                  : "Authorized Officers Only"
              )}

          </p>


          {/* ==================================================
              ERROR
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
                htmlFor="officerEmail"
                className="form-label fw-bold"
              >

                {t.officerEmail ||
                  "Officer Email"}

              </label>


              <input
                id="officerEmail"
                type="email"
                name="email"

                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}

                placeholder={
                  t.enterOfficerEmail ||
                  "Enter Officer Email"
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
                htmlFor="officerPassword"
                className="form-label fw-bold"
              >

                {t.password}

              </label>


              <div className="input-group">

                <input
                  id="officerPassword"
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
                    "Enter Password"
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
              className="btn btn-success w-100 py-2"
              disabled={loading}
            >

              {loading
                ? (
                  t.loggingIn ||
                  "Logging in..."
                )
                : (
                  t.loginAsOfficer ||
                  "Login as Officer"
                )}

            </button>

          </form>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="text-center mt-4">

            <small className="text-muted">

              {t.officerAccessOnly ||
                "This portal is restricted to authorized officers."}

            </small>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OfficerLogin;