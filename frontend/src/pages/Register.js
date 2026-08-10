import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Full Name - Only letters and spaces
    if (name === "fullName") {
      newValue = value.replace(/[^A-Za-z ]/g, "");
    }

    // Mobile - Only 10 digits
    if (name === "mobile") {
      newValue = value.replace(/\D/g, "").slice(0, 10);
    }

    setFormData({
      ...formData,
      [name]: newValue,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full Name is required";
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^\d{10}$/.test(formData.mobile)) {
      newErrors.mobile = "Mobile number must be exactly 10 digits";
    }

    if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, number, special character and be at least 8 characters.";
    }

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage("");
      return;
    }

    setErrors({});
    setSuccessMessage("Registration Successful!");

    console.log(formData);

    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow p-4">

            <h2 className="text-center mb-4">
              Create Account
            </h2>

            {successMessage && (
              <div className="alert alert-success">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Full Name */}

              <div className="mb-3">
                <label className="form-label">
                  Full Name
                </label>

                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter Full Name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

                {errors.fullName && (
                  <small className="text-danger">
                    {errors.fullName}
                  </small>
                )}

              </div>

              {/* Email */}

              <div className="mb-3">
                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <small className="text-danger">
                    {errors.email}
                  </small>
                )}

              </div>

              {/* Mobile */}

              <div className="mb-3">
                <label className="form-label">
                  Mobile Number
                </label>

                <input
                  type="text"
                  name="mobile"
                  className="form-control"
                  placeholder="Enter Mobile Number"
                  value={formData.mobile}
                  onChange={handleChange}
                />

                {errors.mobile && (
                  <small className="text-danger">
                    {errors.mobile}
                  </small>
                )}

              </div>

              {/* Password */}

              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <div className="input-group">

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="form-control"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
{showPassword ? <FaEyeSlash /> : <FaEye />}                  </button>

                </div>

                {errors.password && (
                  <small className="text-danger">
                    {errors.password}
                  </small>
                )}

              </div>

              {/* Confirm Password */}

              <div className="mb-3">

                <label className="form-label">
                  Confirm Password
                </label>

                <div className="input-group">

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
{showConfirmPassword ? <FaEyeSlash /> : <FaEye />}                  </button>

                </div>

                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword}
                  </small>
                )}

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Register
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Register;