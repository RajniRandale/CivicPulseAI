import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEye,
  FaEyeSlash,
  FaUserShield,
} from "react-icons/fa";

function AdminLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // INPUT CHANGE
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
    }));
  };

  // =========================
  // LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Admin email is required.";
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
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

      const { token, user } = response.data;

      // =========================
      // CHECK ADMIN ROLE
      // =========================

      if (!user || user.role !== "admin") {
        setErrors({
          email:
            "This account is not authorized as an administrator.",
        });

        setLoading(false);
        return;
      }

      // =========================
      // SAVE LOGIN
      // =========================

      localStorage.setItem("token", token);

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // =========================
      // ADMIN DASHBOARD
      // =========================

      navigate("/admin-dashboard");

    } catch (error) {
      console.error(
        "Admin login error:",
        error
      );

      if (error.response) {
        setErrors({
          email:
            error.response.data?.message ||
            "Invalid admin email or password.",
        });
      } else {
        setErrors({
          email:
            "Unable to connect to the server.",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#f4f8ff",
      }}
    >

      <div className="col-12 col-sm-10 col-md-6 col-lg-5 col-xl-4">

        <div className="card shadow-lg border-0">

          {/* HEADER */}

          <div
            className="card-header text-white text-center py-4"
            style={{
              backgroundColor: "#212529",
            }}
          >

            <FaUserShield
              size={38}
              className="mb-2"
            />

            <h3 className="mb-1">
              Admin Login
            </h3>

            <small>
              CivicPulse AI Administration
            </small>

          </div>


          {/* BODY */}

          <div className="card-body p-4">

            <form onSubmit={handleSubmit}>

              {/* EMAIL */}

              <div className="mb-3">

                <label className="form-label fw-bold">
                  Admin Email
                </label>

                <input
                  type="email"
                  name="email"
                  className={`form-control ${
                    errors.email
                      ? "is-invalid"
                      : ""
                  }`}
                  placeholder="Enter admin email"
                  value={formData.email}
                  onChange={handleChange}
                />

                {errors.email && (
                  <div className="invalid-feedback">
                    {errors.email}
                  </div>
                )}

              </div>


              {/* PASSWORD */}

              <div className="mb-4">

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


              {/* LOGIN */}

              <button
                type="submit"
                className="btn btn-dark w-100 py-2"
                disabled={loading}
              >
                {loading
                  ? "Logging in..."
                  : "Login as Admin"}
              </button>

            </form>


            {/* BACK */}

            <div className="text-center mt-4">

              <button
                type="button"
                className="btn btn-link"
                onClick={() =>
                  navigate("/")
                }
              >
                Back to Home
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default AdminLogin;