import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Full name - only letters and spaces
    if (name === "fullName") {
      newValue = value.replace(/[^A-Za-z ]/g, "");
    }

    // Mobile - only numbers, maximum 10 digits
    if (name === "mobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccessMessage("");
  };

  // =========================
  // REGISTER
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    // Full name
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required.";
    } else if (formData.fullName.trim().length < 3) {
      newErrors.fullName = "Full Name must contain at least 3 characters.";
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    // Mobile
    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits.";
    }

    // Password
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.";
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (
      formData.confirmPassword !== formData.password
    ) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    // Stop if validation fails
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // =========================
    // CHECK EXISTING USERS
    // =========================

    let users = [];

    try {
      const savedUsers = localStorage.getItem("users");

      if (savedUsers) {
        users = JSON.parse(savedUsers);
      }
    } catch (error) {
      console.error("Error reading users:", error);
      users = [];
    }

    // Check duplicate email
    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() ===
        formData.email.trim().toLowerCase()
    );

    if (emailExists) {
      setErrors({
        email: "An account with this email already exists.",
      });
      return;
    }

    // Check duplicate mobile
    const mobileExists = users.some(
      (user) => user.mobile === formData.mobile
    );

    if (mobileExists) {
      setErrors({
        mobile: "An account with this mobile number already exists.",
      });
      return;
    }

    // =========================
    // CREATE USER
    // =========================

    const newUser = {
      id: "USER-" + Date.now(),
      fullName: formData.fullName.trim(),
      email: formData.email.trim().toLowerCase(),
      mobile: formData.mobile,
      password: formData.password,
      role: "citizen",
      createdAt: new Date().toISOString(),
    };

    // Add new user
    const updatedUsers = [...users, newUser];

    // Save users
    localStorage.setItem(
      "users",
      JSON.stringify(updatedUsers)
    );

    console.log("Registered User:", newUser);

    // =========================
    // SUCCESS
    // =========================

    setSuccessMessage(
      "Registration successful! Redirecting to login..."
    );

    setErrors({});

    // Clear form
    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });

    // Go to login after short delay
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  return (
    <div className="container mt-5 mb-5">

      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow-lg">

            {/* HEADER */}

            <div className="card-header bg-primary text-white text-center py-3">

              <h3 className="mb-0">
                Create Citizen Account
              </h3>

              <small>
                Register to report and track complaints
              </small>

            </div>

            <div className="card-body p-4">

              {/* SUCCESS MESSAGE */}

              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}

              {/* FORM */}

              <form onSubmit={handleSubmit}>

                {/* FULL NAME */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    <FaUser className="me-2" />
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    className={`form-control ${
                      errors.fullName ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your full name"
                    value={formData.fullName}
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
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />

                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}

                </div>

                {/* MOBILE */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    <FaPhone className="me-2" />
                    Mobile Number
                  </label>

                  <input
                    type="text"
                    name="mobile"
                    className={`form-control ${
                      errors.mobile ? "is-invalid" : ""
                    }`}
                    placeholder="Enter 10 digit mobile number"
                    value={formData.mobile}
                    onChange={handleChange}
                    maxLength="10"
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
                    Password
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
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
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
                    Minimum 8 characters with uppercase,
                    lowercase, number and special character.
                  </small>

                </div>

                {/* CONFIRM PASSWORD */}

                <div className="mb-4">

                  <label className="form-label fw-bold">
                    Confirm Password
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
                      placeholder="Confirm your password"
                      value={
                        formData.confirmPassword
                      }
                      onChange={handleChange}
                    />

                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
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

                {/* REGISTER BUTTON */}

                <button
                  type="submit"
                  className="btn btn-primary w-100 btn-lg"
                >
                  Register
                </button>

              </form>

              {/* LOGIN */}

              <div className="text-center mt-4">

                <span>
                  Already have an account?{" "}
                </span>

                <button
                  type="button"
                  className="btn btn-link p-0"
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login
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