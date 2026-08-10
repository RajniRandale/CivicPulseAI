import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function CitizenLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Login Successful
    navigate("/citizen-dashboard");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow p-4">

            <h2 className="text-center mb-4">
              Citizen Login
            </h2>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
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

              <div className="mb-3">

                <label className="form-label">
                  Password
                </label>

                <div className="input-group">

                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                  />

                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>

                </div>

                {errors.password && (
                  <small className="text-danger">
                    {errors.password}
                  </small>
                )}

              </div>

              <div className="form-check mb-3">

                <input
                  className="form-check-input"
                  type="checkbox"
                  id="remember"
                />

                <label
                  className="form-check-label"
                  htmlFor="remember"
                >
                  Remember Me
                </label>

              </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
              >
                Login
              </button>

              <div className="text-center mt-3">
                Don't have an account?
                <br />
                <Link to="/register">
                  Register Here
                </Link>
              </div>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CitizenLogin;