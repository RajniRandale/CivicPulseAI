import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

function CitizenLogin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // =========================
  // HANDLE INPUT
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
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

      console.log("LOGIN RESPONSE:", response.data);

      // =========================
      // CHECK USER
      // =========================

      const user = response.data.user;

      if (!user) {
        setErrors({
          email: "User information was not received.",
        });
        return;
      }

      // =========================
      // CITIZEN CHECK
      // =========================

      if (user.role && user.role.toLowerCase() !== "citizen") {
        setErrors({
          email:
            "This account is not registered as a citizen account.",
        });

        return;
      }

      // =========================
      // CLEAR OLD LOGIN DATA
      // =========================

      localStorage.removeItem("currentUser");

      // =========================
      // SAVE LOGIN DATA
      // =========================

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      // This is the important part
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          id: user._id || user.id || null,
          name: user.name || "",
          email: user.email || formData.email.trim(),
          role: user.role || "citizen",
        })
      );

      console.log(
        "CURRENT USER:",
        localStorage.getItem("currentUser")
      );

      // =========================
      // GO TO DASHBOARD
      // =========================

      navigate("/citizen-dashboard", {
        replace: true,
      });

    } catch (error) {
      console.error("Login error:", error);

      if (error.response) {
        setErrors({
          email:
            error.response.data?.message ||
            "Invalid email or password",
        });
      } else {
        setErrors({
          email:
            "Unable to connect to the server. Make sure your backend is running.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#f4f8ff",
        padding: "20px",
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: "100%",
          maxWidth: "450px",
          border: "none",
          borderRadius: "15px",
        }}
      >

        <h2 className="text-center mb-2">
          Citizen Login
        </h2>

        <p className="text-center text-muted mb-4">
          Login to your CivicPulse AI account
        </p>

        <form onSubmit={handleSubmit}>

          {/* EMAIL */}

          <div className="mb-3">

            <label className="form-label">
              Email
            </label>

            <input
              type="email"
              className={`form-control ${
                errors.email ? "is-invalid" : ""
              }`}
              name="email"
              placeholder="Enter Email"
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

          <div className="mb-3">

            <label className="form-label">
              Password
            </label>

            <div className="input-group">

              <input
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

          </div>

          {/* REMEMBER ME */}

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

          {/* LOGIN */}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

          {/* REGISTER */}

          <div className="text-center mt-3">

            <span>
              Don't have an account?
            </span>

            <br />

            <Link to="/register">
              Register Here
            </Link>

          </div>

        </form>

      </div>
    </div>
  );
}

export default CitizenLogin;