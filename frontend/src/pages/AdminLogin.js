import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AdminLogin() {
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
      newErrors.email = "Enter a valid admin email";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    alert("Admin Login Successful");
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">

        <div className="col-md-6">

          <div className="card shadow-lg p-4">

            <h2 className="text-center mb-2">
              🛡️ Admin Login
            </h2>

            <p className="text-center text-danger">
              Authorized Personnel Only
            </p>

            <form onSubmit={handleSubmit}>

              <div className="mb-3">

                <label className="form-label">
                  Admin Email
                </label>

                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Enter Admin Email"
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
                    className="btn border border-start-0 bg-white"
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

              <button
                type="submit"
                className="btn btn-dark w-100"
              >
                Login as Admin
              </button>

            </form>

          </div>

        </div>

      </div>
    </div>
  );
}

export default AdminLogin;