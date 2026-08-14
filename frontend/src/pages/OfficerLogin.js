import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OfficerLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

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

  // =========================
  // VALIDATE FORM
  // =========================

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      newErrors.email = "Officer email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Enter a valid officer email";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    return newErrors;
  };

  // =========================
  // HANDLE LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email: formData.email.trim(),
          password: formData.password,
        }
      );

      // =========================
      // CHECK RESPONSE
      // =========================

      const data = response.data;

      if (!data || !data.user) {
        setErrors({
          server: "Invalid response received from server.",
        });
        return;
      }

      // =========================
      // CHECK OFFICER ROLE
      // =========================

      if (data.user.role !== "officer") {
        setErrors({
          server:
            "This account is not authorized as an officer.",
        });
        return;
      }

      // =========================
      // CHECK TOKEN
      // =========================

      if (!data.token) {
        setErrors({
          server: "Login token was not received from server.",
        });
        return;
      }

      // =========================
      // STORE LOGIN DATA
      // =========================

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      // =========================
      // REDIRECT
      // =========================

      navigate("/officer-dashboard");

    } catch (error) {
      console.error("Officer login error:", error);

      if (error.response) {
        setErrors({
          server:
            error.response.data?.message ||
            "Invalid officer email or password.",
        });
      } else if (error.request) {
        setErrors({
          server:
            "Unable to connect to the server. Please make sure the backend is running.",
        });
      } else {
        setErrors({
          server:
            "Something went wrong. Please try again.",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PAGE
  // =========================

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#f4f8ff",
      }}
    >

      <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4">

        <div className="card shadow-lg border-0 p-4">

          {/* LOGO */}

          <div className="text-center mb-3">

            <img
              src="/civicpulse-logo.png"
              alt="CivicPulse AI"
              style={{
                width: "70px",
                height: "70px",
                objectFit: "contain",
              }}
            />

          </div>


          {/* TITLE */}

          <h2 className="text-center mb-2">
            Officer Login
          </h2>

          <p className="text-center text-muted mb-4">
            Authorized Officers Only
          </p>


          {/* SERVER ERROR */}

          {errors.server && (
            <div
              className="alert alert-danger text-center"
              role="alert"
            >
              {errors.server}
            </div>
          )}


          {/* FORM */}

          <form onSubmit={handleSubmit}>

            {/* EMAIL */}

            <div className="mb-3">

              <label
                htmlFor="officerEmail"
                className="form-label"
              >
                Officer Email
              </label>

              <input
                id="officerEmail"
                type="email"
                className={`form-control ${
                  errors.email ? "is-invalid" : ""
                }`}
                name="email"
                placeholder="Enter Officer Email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
              />

              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}

            </div>


            {/* PASSWORD */}

            <div className="mb-3">

              <label
                htmlFor="officerPassword"
                className="form-label"
              >
                Password
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
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
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


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="btn btn-success w-100 py-2"
              disabled={loading}
            >
              {loading
                ? "Logging in..."
                : "Login as Officer"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default OfficerLogin;