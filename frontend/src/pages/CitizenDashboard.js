import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import translations from "../components/translations";
import { useAppSettings } from "../components/TopUtilityBar";

import {
  FaTachometerAlt,
  FaClipboardList,
  FaPlusCircle,
  FaSearch,
  FaBell,
  FaSignOutAlt,
  FaMapMarkerAlt,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaCity,
  FaUser,
  FaQuestionCircle,
} from "react-icons/fa";

function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ==================================================
  // LANGUAGE
  // ==================================================

  const { language } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  // ==================================================
  // LOAD LOGGED-IN CITIZEN COMPLAINTS
  // ==================================================

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/citizen-login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setComplaints(
          response.data.complaints || []
        );
      } catch (error) {
        console.error(
          "Failed to fetch complaints:",
          error
        );

        if (
          error.response &&
          (error.response.status === 401 ||
            error.response.status === 403)
        ) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");

          navigate("/citizen-login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/citizen-login");
  };

  // ==================================================
  // DATE FORMAT
  // ==================================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString("en-IN");
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="container-fluid">
        <div className="text-center py-5">

          <FaClipboardList
            size={45}
            className="text-success mb-3"
          />

          <h4>
            {t.loadingComplaints}
          </h4>

          <p className="text-muted">
            {t.pleaseWait}
          </p>

        </div>
      </div>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div className="container-fluid">

      <div className="row">

        {/* ================= SIDEBAR ================= */}

        <div
          className="col-md-2"
          style={{
            backgroundColor: "#212529",
            minHeight: "100vh",
            padding: "20px",
          }}
        >

          {/* LOGO */}

          <div className="text-center mb-4">

            <FaCity
              size={38}
              className="text-success mb-2"
            />

            <h4 className="text-white mb-0">
              CivicPulse AI
            </h4>

            <small className="text-secondary">
              {t.citizenPortal}
            </small>

          </div>


          {/* MENU */}

          <div className="d-grid gap-2">

            {/* DASHBOARD */}

            <Link
              to="/citizen-dashboard"
              className="btn btn-success text-start"
            >
              <FaTachometerAlt className="me-2" />
              {t.dashboard}
            </Link>


            {/* MY COMPLAINTS */}

            <Link
              to="/my-complaints"
              className="btn btn-dark text-start text-white"
            >
              <FaClipboardList className="me-2" />
              {t.myComplaints}
            </Link>


            {/* PROFILE */}

            <Link
              to="/citizen-profile"
              className="btn btn-dark text-start text-white"
            >
              <FaUser className="me-2" />
              {t.profile}
            </Link>


            {/* HELP */}

            <button
              type="button"
              className="btn btn-dark text-start text-white"
            >
              <FaQuestionCircle className="me-2" />
              {t.helpSupport}
            </button>


            {/* LOGOUT */}

            <button
              type="button"
              className="btn btn-danger text-start mt-3"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              {t.logout}
            </button>

          </div>

        </div>


        {/* ================= MAIN CONTENT ================= */}

        <div className="col-md-10 p-4">

          {/* WELCOME */}

          <div className="mb-4">

            <h1>
              {t.welcomeCitizen}
            </h1>

            <p className="text-muted">
              {t.manageComplaints}
            </p>

          </div>


          {/* ================= QUICK ACTIONS ================= */}

          <div className="row g-4 mb-4">

            {/* REPORT COMPLAINT */}

            <div className="col-md-3">

              <Link
                to="/report-complaint"
                className="text-decoration-none"
              >

                <div className="card shadow-sm h-100">

                  <div className="card-body text-center">

                    <FaFileAlt
                      size={42}
                      className="text-success mb-3"
                    />

                    <h5>
                      {t.reportComplaint}
                    </h5>

                    <p className="text-muted mb-0">
                      {t.registerNewComplaint}
                    </p>

                  </div>

                </div>

              </Link>

            </div>


            {/* TRACK COMPLAINT */}

            <div className="col-md-3">

              <div
                className="card shadow-sm h-100"
                style={{
                  cursor: "pointer",
                }}
                onClick={() =>
                  navigate("/my-complaints")
                }
              >

                <div className="card-body text-center">

                  <FaSearch
                    size={42}
                    className="text-primary mb-3"
                  />

                  <h5>
                    {t.trackComplaint}
                  </h5>

                  <p className="text-muted mb-0">
                    {t.trackComplaintDetails}
                  </p>

                </div>

              </div>

            </div>


            {/* NEARBY ISSUES */}

            <div className="col-md-3">

              <div className="card shadow-sm h-100">

                <div className="card-body text-center">

                  <FaMapMarkerAlt
                    size={42}
                    className="text-danger mb-3"
                  />

                  <h5>
                    {t.nearbyIssues}
                  </h5>

                  <p className="text-muted mb-0">
                    {t.viewNearbyComplaints}
                  </p>

                </div>

              </div>

            </div>


            {/* NOTIFICATIONS */}

            <div className="col-md-3">

              <div className="card shadow-sm h-100">

                <div className="card-body text-center">

                  <FaBell
                    size={42}
                    className="text-warning mb-3"
                  />

                  <h5>
                    {t.notifications}
                  </h5>

                  <p className="text-muted mb-0">
                    {t.viewNotifications}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= STATISTICS ================= */}

          <div className="row g-4 mb-4">

            {/* TOTAL */}

            <div className="col-md-4">

              <div className="card shadow-sm h-100">

                <div className="card-body text-center">

                  <FaClipboardList
                    size={32}
                    className="text-primary mb-2"
                  />

                  <h2>
                    {complaints.length}
                  </h2>

                  <p className="text-muted mb-0">
                    {t.totalComplaints}
                  </p>

                </div>

              </div>

            </div>


            {/* PENDING */}

            <div className="col-md-4">

              <div className="card shadow-sm h-100">

                <div className="card-body text-center">

                  <FaClock
                    size={32}
                    className="text-warning mb-2"
                  />

                  <h2>
                    {
                      complaints.filter(
                        (item) =>
                          !item.status ||
                          item.status === "Pending"
                      ).length
                    }
                  </h2>

                  <p className="text-muted mb-0">
                    {t.pendingComplaints}
                  </p>

                </div>

              </div>

            </div>


            {/* RESOLVED */}

            <div className="col-md-4">

              <div className="card shadow-sm h-100">

                <div className="card-body text-center">

                  <FaCheckCircle
                    size={32}
                    className="text-success mb-2"
                  />

                  <h2>
                    {
                      complaints.filter(
                        (item) =>
                          item.status ===
                          "Resolved"
                      ).length
                    }
                  </h2>

                  <p className="text-muted mb-0">
                    {t.resolvedComplaints}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* ================= RECENT COMPLAINTS ================= */}

          <div className="card shadow-sm">

            <div className="card-header bg-success text-white">

              <h5 className="mb-0">

                <FaClipboardList className="me-2" />

                {t.recentComplaints}

              </h5>

            </div>


            <div className="card-body">

              {complaints.length === 0 ? (

                <div className="text-center py-5">

                  <FaClipboardList
                    size={55}
                    className="text-muted mb-3"
                  />

                  <h4>
                    {t.noComplaints}
                  </h4>

                  <p className="text-muted">
                    {t.firstComplaint}
                  </p>

                  <Link
                    to="/report-complaint"
                    className="btn btn-success"
                  >

                    <FaPlusCircle className="me-2" />

                    {t.reportComplaint}

                  </Link>

                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-hover align-middle">

                    <thead>

                      <tr>

                        <th>
                          {t.complaintId}
                        </th>

                        <th>
                          {t.complaint}
                        </th>

                        <th>
                          {t.category}
                        </th>

                        <th>
                          {t.date}
                        </th>

                      </tr>

                    </thead>


                    <tbody>

                      {complaints
                        .slice(0, 5)
                        .map((item, index) => (

                          <tr
                            key={
                              item.id || index
                            }
                          >

                            <td>

                              <strong>
                                GCP-{item.id}
                              </strong>

                            </td>

                            <td>
                              {item.title || "-"}
                            </td>

                            <td>
                              {item.category || "-"}
                            </td>

                            <td>
                              {formatDate(
                                item.created_at
                              )}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>


                  {/* VIEW ALL */}

                  {complaints.length > 5 && (

                    <div className="text-center mt-3">

                      <Link
                        to="/my-complaints"
                        className="btn btn-outline-success"
                      >
                        {t.viewAllComplaints}
                      </Link>

                    </div>

                  )}

                </div>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CitizenDashboard;