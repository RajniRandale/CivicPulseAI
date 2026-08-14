import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaUserCircle,
  FaEnvelope,
  FaIdCard,
  FaUserShield,
  FaArrowLeft,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
} from "react-icons/fa";

function CitizenProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // ==============================
  // LOAD LOGGED-IN USER
  // ==============================
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (!userData) {
      navigate("/citizen-login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);

      setUser(parsedUser);
      setName(parsedUser.name || "");
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      navigate("/citizen-login");
    }
  }, [navigate]);

  // ==============================
  // SAVE NAME
  // ==============================
  const handleSaveName = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      alert("Please enter your name.");
      return;
    }

    const updatedUser = {
      ...user,
      name: trimmedName,
    };

    // Update React state
    setUser(updatedUser);

    // Update localStorage
    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );

    setName(trimmedName);
    setIsEditing(false);

    alert("Name updated successfully!");
  };

  // ==============================
  // CANCEL EDIT
  // ==============================
  const handleCancelEdit = () => {
    setName(user.name || "");
    setIsEditing(false);
  };

  // ==============================
  // LOGOUT
  // ==============================
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/citizen-login");
  };

  // ==============================
  // LOADING
  // ==============================
  if (!user) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <h4>Loading profile...</h4>
        </div>
      </div>
    );
  }

  return (
    <div
      className="container mt-5 mb-5"
      style={{ maxWidth: "700px" }}
    >
      <div className="card shadow-lg border-0">

        {/* ================= HEADER ================= */}

        <div className="card-header bg-success text-white p-4">
          <div className="d-flex align-items-center">

            <FaUserCircle
              size={60}
              className="me-3"
            />

            <div>
              <h3 className="mb-1">
                Citizen Profile
              </h3>

              <small>
                Manage your account information
              </small>
            </div>

          </div>
        </div>

        {/* ================= BODY ================= */}

        <div className="card-body p-4">

          {/* ================= NAME ================= */}

          <div className="mb-4">

            <label className="fw-bold mb-2">
              <FaUserCircle className="text-success me-2" />
              Full Name
            </label>

            {isEditing ? (

              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                autoFocus
              />

            ) : (

              <div className="form-control bg-light">
                {user.name || "Not available"}
              </div>

            )}

          </div>

          {/* ================= EMAIL ================= */}

          <div className="mb-4">

            <label className="fw-bold mb-2">
              <FaEnvelope className="text-success me-2" />
              Email Address
            </label>

            <div className="form-control bg-light">
              {user.email || "Not available"}
            </div>

          </div>

          {/* ================= CITIZEN ID ================= */}

          <div className="mb-4">

            <label className="fw-bold mb-2">
              <FaIdCard className="text-success me-2" />
              Citizen ID
            </label>

            <div className="form-control bg-light">
              {user.id || "Not available"}
            </div>

          </div>

          {/* ================= ACCOUNT TYPE ================= */}

          <div className="mb-4">

            <label className="fw-bold mb-2">
              <FaUserShield className="text-success me-2" />
              Account Type
            </label>

            <div className="form-control bg-light text-capitalize">
              {user.role || "citizen"}
            </div>

          </div>

          {/* ================= BUTTONS ================= */}

          <div className="d-flex gap-2 flex-wrap">

            {/* BACK */}

            <Link
              to="/citizen-dashboard"
              className="btn btn-success"
            >
              <FaArrowLeft className="me-2" />
              Back to Dashboard
            </Link>

            {/* EDIT MODE */}

            {!isEditing ? (

              <button
                type="button"
                className="btn btn-outline-success"
                onClick={() => setIsEditing(true)}
              >
                <FaEdit className="me-2" />
                Edit Profile
              </button>

            ) : (

              <>
                {/* SAVE */}

                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleSaveName}
                >
                  <FaSave className="me-2" />
                  Save
                </button>

                {/* CANCEL */}

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleCancelEdit}
                >
                  <FaTimes className="me-2" />
                  Cancel
                </button>
              </>

            )}

            {/* LOGOUT */}

            <button
              type="button"
              className="btn btn-danger"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default CitizenProfile;