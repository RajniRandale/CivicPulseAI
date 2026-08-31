import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaQuestionCircle,
  FaSignOutAlt,
  FaPlus,
  FaFileAlt,
  FaInbox,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =====================================
  // LOAD COMPLAINTS FROM BACKEND
  // =====================================

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem("token");

      // Check login
      if (!token) {
        navigate("/citizen-login");
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await axios.get(
          "http://localhost:5000/api/complaints/my",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          "Complaints received:",
          response.data
        );

        setComplaints(response.data.complaints || []);
      } catch (error) {
        console.error(
          "Fetch complaints error:",
          error
        );

        if (error.response) {
          if (error.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            navigate("/citizen-login");
            return;
          }

          if (error.response.status === 403) {
            setError(
              "Your login session has expired. Please login again."
            );
            return;
          }

          setError(
            error.response.data.message ||
              "Failed to load complaints."
          );
        } else {
          setError(
            "Unable to connect to the backend server."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [navigate]);

  // =====================================
  // STATUS BADGE
  // =====================================

  const getStatusBadge = (status) => {
    if (status === "Resolved") {
      return "badge bg-success";
    }

    if (status === "In Progress") {
      return "badge bg-primary";
    }

    return "badge bg-warning text-dark";
  };

  // =====================================
  // FORMAT DATE
  // =====================================

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }
    );
  };

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/citizen-login");
  };

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="container-fluid p-0">
        <div className="row g-0">

          {/* SIDEBAR */}

          <div
            className="col-md-2"
            style={{
              backgroundColor: "#212529",
              minHeight: "100vh",
              padding: "20px 16px",
              position: "relative",
            }}
          >
            <div className="text-center mb-4">

              <FaHome
                size={35}
                color="#198754"
                className="mb-2"
              />

              <h4 className="text-white mb-0">
                CivicPulse AI
              </h4>

              <small
                style={{
                  color: "#adb5bd",
                }}
              >
                Citizen Portal
              </small>

            </div>

            <div
              className="d-flex flex-column gap-2"
              style={{ minHeight: "calc(100vh - 120px)" }}
            >

              <Link
                to="/citizen-dashboard"
                className="btn btn-dark text-start text-white"
              >
                <FaHome className="me-2" />
                Dashboard
              </Link>

              <Link
                to="/my-complaints"
                className="btn btn-success text-start"
              >
                <FaClipboardList className="me-2" />
                My Complaints
              </Link>

              <Link
                to="/citizen-profile"
                className="btn btn-dark text-start text-white"
              >
                <FaUser className="me-2" />
                Profile
              </Link>

              <button
                className="btn btn-dark text-start text-white"
                onClick={() => navigate("/citizen-help")}
              >
                <FaQuestionCircle className="me-2" />
                Help & Support
              </button>

              <button
                className="btn btn-danger text-start mt-3"
                style={{ position: "absolute", left: "16px", right: "16px", bottom: "20px" }}
                onClick={handleLogout}
              >
                <FaSignOutAlt className="me-2" />
                Logout
              </button>

            </div>
          </div>

          {/* LOADING */}

          <div className="col-md-10 p-5">

            <div className="text-center mt-5">

              <FaSpinner
                className="fa-spin"
                size={40}
                color="#198754"
              />

              <h4 className="mt-3">
                Loading complaints...
              </h4>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // =====================================
  // MAIN UI
  // =====================================

  return (
    <div className="container-fluid p-0">

      <div className="row g-0">

        {/* =================================
            SIDEBAR
        ================================= */}

        <div
          className="col-md-2"
          style={{
            backgroundColor: "#212529",
            minHeight: "100vh",
            padding: "20px 16px",
            position: "relative",
          }}
        >

          {/* LOGO */}

          <div className="text-center mb-4">

            <FaHome
              size={35}
              color="#198754"
              className="mb-2"
            />

            <h4 className="text-white mb-0">
              CivicPulse AI
            </h4>

            <small
              style={{
                color: "#adb5bd",
              }}
            >
              Citizen Portal
            </small>

          </div>

          {/* MENU */}

          <div
            className="d-flex flex-column gap-2"
            style={{ minHeight: "calc(100vh - 120px)" }}
          >

            <Link
              to="/citizen-dashboard"
              className="btn btn-dark text-start text-white"
            >
              <FaHome className="me-2" />
              Dashboard
            </Link>

            <Link
              to="/my-complaints"
              className="btn btn-success text-start"
            >
              <FaClipboardList className="me-2" />
              My Complaints
            </Link>

            <Link
              to="/citizen-profile"
              className="btn btn-dark text-start text-white"
            >
              <FaUser className="me-2" />
              Profile
            </Link>

            <button
              className="btn btn-dark text-start text-white"
              onClick={() => navigate("/citizen-help")}
            >
              <FaQuestionCircle className="me-2" />
              Help & Support
            </button>

            <button
              className="btn btn-danger text-start mt-3"
              style={{ position: "absolute", left: "16px", right: "16px", bottom: "20px" }}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>

          </div>

        </div>

        {/* =================================
            MAIN CONTENT
        ================================= */}

        <div className="col-md-10 p-4">

          {/* HEADER */}

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>

              <h1 className="mb-1">

                <FaClipboardList
                  className="me-2"
                  color="#198754"
                />

                My Complaints

              </h1>

              <p className="text-muted mb-0">
                View all complaints registered by you.
              </p>

            </div>

            {/* NEW COMPLAINT */}

            <Link
              to="/report-complaint"
              className="btn btn-success"
            >
              <FaPlus className="me-2" />
              New Complaint
            </Link>

          </div>

          {/* =================================
              ERROR
          ================================= */}

          {error && (
            <div className="alert alert-danger">

              <FaExclamationCircle className="me-2" />

              {error}

            </div>
          )}

          {/* =================================
              NO COMPLAINTS
          ================================= */}

          {!error && complaints.length === 0 ? (

            <div className="card shadow-sm">

              <div className="card-body text-center py-5">

                <FaInbox
                  size={60}
                  color="#6c757d"
                  className="mb-3"
                />

                <h3 className="mt-3">
                  No Complaints Found
                </h3>

                <p className="text-muted">
                  You have not registered any complaints yet.
                </p>

                <Link
                  to="/report-complaint"
                  className="btn btn-success"
                >
                  <FaPlus className="me-2" />
                  Report Your First Complaint
                </Link>

              </div>

            </div>

          ) : (

            /* =================================
               COMPLAINT TABLE
            ================================= */

            <div className="card shadow-sm">

              <div className="card-header bg-success text-white">

                <h5 className="mb-0">

                  <FaFileAlt className="me-2" />

                  Registered Complaints (
                  {complaints.length}
                  )

                </h5>

              </div>

              <div className="card-body">

                <div className="table-responsive">

                  <table className="table table-hover align-middle">

                    <thead className="table-light">

                      <tr>

                        <th>
                          Complaint ID
                        </th>

                        <th>
                          Title
                        </th>

                        <th>
                          Category
                        </th>

                        <th>
                          Location
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Date
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {complaints.map(
                        (complaint) => (

                          <tr
                            key={complaint.id}
                          >

                            <td>

                              <strong>
                                GCP-
                                {complaint.id}
                              </strong>

                            </td>

                            <td>
                              {complaint.title || "-"}
                            </td>

                            <td>
                              {complaint.category || "-"}
                            </td>

                            <td>
                              {complaint.location || "-"}
                            </td>

                            <td>

                              <span
                                className={getStatusBadge(
                                  complaint.status ||
                                    "Pending"
                                )}
                              >
                                {complaint.status ||
                                  "Pending"}
                              </span>

                            </td>

                            <td>
                              {formatDate(
                                complaint.created_at
                              )}
                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default MyComplaints;