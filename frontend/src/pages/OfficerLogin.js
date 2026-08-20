import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaArrowLeft,
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

    if (!email) {
      validationErrors.email =
        t.officerEmailRequired ||
        "Officer email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        email
      )
    ) {
      validationErrors.email =
        t.validEmail ||
        "Enter a valid email address.";
    }

    if (!password) {
      validationErrors.password =
        t.passwordRequired ||
        "Password is required.";
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
      Object.keys(validationErrors)
        .length > 0
    ) {
      setErrors(
        validationErrors
      );

      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          {
            email:
              formData.email.trim(),

            password:
              formData.password,
          }
        );

      const data =
        response.data;

      // ==================================================
      // CHECK RESPONSE
      // ==================================================

      if (!data || !data.user) {
        setErrors({
          server:
            t.invalidServerResponse ||
            "Invalid response received from server.",
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
            "This account is not authorized as an officer.",
        });

        return;
      }

      // ==================================================
      // CHECK TOKEN
      // ==================================================

      if (!data.token) {
        setErrors({
          server:
            t.noLoginToken ||
            "Login token was not received from server.",
        });

        return;
      }

      // ==================================================
      // STORE LOGIN DATA
      // ==================================================

      localStorage.setItem(
        "token",
        data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          data.user
        )
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
            "Invalid officer email or password.",
        });

      } else if (error.request) {
        setErrors({
          server:
            t.serverConnectionError ||
            "Unable to connect to the server. Please make sure the backend is running.",
        });

      } else {
        setErrors({
          server:
            t.somethingWentWrong ||
            "Something went wrong. Please try again.",
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
        backgroundColor:
          "#f4f8ff",
        padding: "20px",
      }}
    >

      <div
        className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4"
      >

        <div className="card shadow-lg border-0 p-4">

          {/* ==================================================
              BACK BUTTON
          ================================================== */}

          <button
            type="button"
            className="btn btn-link text-decoration-none text-start p-0 mb-3"
            onClick={() =>
              navigate("/")
            }
          >
            <FaArrowLeft className="me-2" />

            {t.home}
          </button>


          {/* ==================================================
              LOGO
          ================================================== */}

          <div className="text-center mb-3">

            <img
              src="/civicpulse-logo.png"
              alt="CivicPulse AI"
              style={{
                width: "70px",
                height: "70px",
                objectFit:
                  "contain",
              }}
            />

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
              "Authorized Officers Only"}

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
            onSubmit={
              handleSubmit
            }
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
                className={`form-control ${
                  errors.email
                    ? "is-invalid"
                    : ""
                }`}
                name="email"
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

            <div className="mb-3">

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
                  className={`form-control ${
                    errors.password
                      ? "is-invalid"
                      : ""
                  }`}
                  name="password"
                  placeholder={
                    t.enterPassword
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