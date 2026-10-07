import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBell,
  FaClipboardList,
  FaHome,
  FaMapMarkerAlt,
  FaQuestionCircle,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useAppSettings } from "../components/TopUtilityBar";
import translations from "../components/translations";
import "./CitizenIssuePages.css";

function CitizenIssuePages({ mode }) {
  const navigate = useNavigate();
  const { darkMode, language } = useAppSettings();
  const t = translations[language] || translations.English;

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackedComplaintId, setTrackedComplaintId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/citizen-login");
      return;
    }

    axios
      .get(
        `http://localhost:5000/api/complaints/${
          mode === "nearby" ? "nearby" : "my"
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setComplaints(response.data?.complaints || []);
      })
      .catch((error) => {
        console.error("Citizen issue page error:", error);

        if (
          error.response?.status === 401 ||
          error.response?.status === 403
        ) {
          navigate("/citizen-login");
        }
      })
      .finally(() => setLoading(false));
  }, [mode, navigate]);

  const isNearby = mode === "nearby";
  const isNotifications = mode === "notifications";

  const title = isNearby
    ? "Nearby Issues"
    : isNotifications
      ? "Notifications"
      : "Track Complaint";

  const description = isNearby
    ? "View complaints reported by other citizens in your city."
    : isNotifications
      ? "View updates about the status of your submitted complaints."
      : "Track the current status of your submitted complaints.";

  const icon = isNearby ? (
    <FaMapMarkerAlt />
  ) : isNotifications ? (
    <FaBell />
  ) : (
    <FaSearch />
  );

  const visibleComplaints = isNotifications
    ? complaints.filter(
        (complaint) =>
          (complaint.status || "").toLowerCase() === "resolved"
      )
    : complaints;

  const emptyMessage = isNotifications
    ? "No resolved notifications available."
    : "No complaints available.";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/citizen-login");
  };

  return (
    <div className={`citizen-issue-page${darkMode ? " dark" : ""}`}>
      <div
        style={{
          display: "flex",
          minHeight: "calc(100vh - 26px)",
        }}
      >
        {/* ================= SIDEBAR ================= */}
        <aside
          style={{
            width: "220px",
            minWidth: "220px",
            backgroundColor: "#212529",
            padding: "20px",
            position: "relative",
            minHeight: "calc(100vh - 26px)",
          }}
        >
          {/* Logo / Title */}
          <div className="text-center mb-4">
            <FaHome
              size={38}
              color="#198754"
              className="mb-2"
            />

            <h4 className="text-white mb-0">
              CivicPulse AI
            </h4>

            <small style={{ color: "#adb5bd" }}>
              {t.citizenPortal || "Citizen Portal"}
            </small>
          </div>

          {/* Navigation */}
          <nav
            className="d-flex flex-column gap-2"
            style={{
              minHeight: "calc(100vh - 150px)",
            }}
          >
            {/* Dashboard */}
            <Link
              to="/citizen-dashboard"
              className="btn btn-dark text-start text-white"
            >
              <FaHome className="me-2" />
              {t.dashboard || "Dashboard"}
            </Link>

            {/* My Complaints */}
            <Link
              to="/my-complaints"
              className="btn btn-dark text-start text-white"
            >
              <FaClipboardList className="me-2" />
              {t.myComplaints || "My Complaints"}
            </Link>

            {/* Report Complaint */}
            <Link
              to="/report-complaint"
              className="btn btn-dark text-start text-white"
            >
              <FaClipboardList className="me-2" />
              Report Complaint
            </Link>

            {/* Track Complaint - ACTIVE */}
            {mode === "track" && (
              <Link
                to="/track-complaint"
                className="btn btn-success text-start"
              >
                <FaSearch className="me-2" />
                Track Complaint
              </Link>
            )}

            {mode !== "track" && (
              <Link
                to="/track-complaint"
                className="btn btn-dark text-start text-white"
              >
                <FaSearch className="me-2" />
                Track Complaint
              </Link>
            )}

            {/* Nearby Issues */}
            {mode === "nearby" && (
              <Link
                to="/nearby-issues"
                className="btn btn-success text-start"
              >
                <FaMapMarkerAlt className="me-2" />
                Nearby Issues
              </Link>
            )}

            {mode !== "nearby" && (
              <Link
                to="/nearby-issues"
                className="btn btn-dark text-start text-white"
              >
                <FaMapMarkerAlt className="me-2" />
                Nearby Issues
              </Link>
            )}

            {/* Notifications */}
            {mode === "notifications" && (
              <Link
                to="/notifications"
                className="btn btn-success text-start"
              >
                <FaBell className="me-2" />
                Notifications
              </Link>
            )}

            {mode !== "notifications" && (
              <Link
                to="/notifications"
                className="btn btn-dark text-start text-white"
              >
                <FaBell className="me-2" />
                Notifications
              </Link>
            )}

            {/* Profile */}
            <Link
              to="/citizen-profile"
              className="btn btn-dark text-start text-white"
            >
              <FaUserCircle className="me-2" />
              {t.profile || "Profile"}
            </Link>

            {/* Help & Support */}
            <button
              type="button"
              className="btn btn-dark text-start text-white"
              onClick={() => navigate("/citizen-help")}
            >
              <FaQuestionCircle className="me-2" />
              {t.helpSupport || "Help & Support"}
            </button>

            {/* Logout */}
            <button
              type="button"
              className="btn btn-danger text-start mt-3"
              style={{
                position: "absolute",
                left: "20px",
                right: "20px",
                bottom: "20px",
              }}
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              {t.logout || "Logout"}
            </button>
          </nav>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div className="citizen-issue-container">

            {/* Back Button */}
            <button
              type="button"
              className="citizen-issue-back"
              onClick={() => navigate("/citizen-dashboard")}
            >
              <FaArrowLeft /> Back to Dashboard
            </button>

            {/* Header */}
            <header className="citizen-issue-header">
              <div>{icon}</div>

              <section>
                <span>CIVICPULSE AI</span>

                <h1>{title}</h1>

                <p>{description}</p>
              </section>
            </header>

            {/* Content */}
            <main className="citizen-issue-content">
              {loading ? (
                <p className="citizen-issue-message">
                  Loading complaints...
                </p>
              ) : visibleComplaints.length === 0 ? (
                <p className="citizen-issue-message">
                  {emptyMessage}
                </p>
              ) : (
                <div className="citizen-issue-list">
                  {visibleComplaints.map((complaint) => (
                    <article
                      key={complaint.id}
                      className="citizen-issue-card"
                    >
                      <div>
                        {/* Category / Complaint ID */}
                        <span className="citizen-issue-category">
                          {isNotifications
                            ? "Complaint Resolved"
                            : mode === "track"
                              ? `Complaint #${complaint.id}`
                              : complaint.category || "Other"}
                        </span>

                        {/* Title */}
                        <h2>
                          {complaint.title || "Complaint"}
                        </h2>

                        {/* Description */}
                        <p>
                          {isNotifications
                            ? "Your complaint has been successfully resolved."
                            : complaint.description ||
                              "No description available."}
                        </p>

                        {/* Location */}
                        <small>
                          <FaMapMarkerAlt />{" "}
                          {complaint.location ||
                            "Location not available"}
                        </small>

                        {/* Submitted Date */}
                        {mode === "track" &&
                          complaint.created_at && (
                            <small className="citizen-issue-date">
                              Submitted:{" "}
                              {new Date(
                                complaint.created_at
                              ).toLocaleString()}
                            </small>
                          )}

                        {/* Track Button */}
                        {mode === "track" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                setTrackedComplaintId(
                                  trackedComplaintId ===
                                    complaint.id
                                    ? null
                                    : complaint.id
                                )
                              }
                              style={{
                                marginTop: "14px",
                                padding: "8px 16px",
                                border: 0,
                                borderRadius: "18px",
                                background: "#24508b",
                                color: "#fff",
                                fontSize: "12px",
                                fontWeight: 700,
                                cursor: "pointer",
                              }}
                            >
                              {trackedComplaintId ===
                              complaint.id
                                ? "Hide Details"
                                : "Track Complaint"}
                            </button>

                            {/* Complaint Details */}
                            {trackedComplaintId ===
                              complaint.id && (
                              <div
                                style={{
                                  marginTop: "14px",
                                  padding: "14px",
                                  borderRadius: "10px",
                                  background: darkMode
                                    ? "#253244"
                                    : "#f4f8ff",
                                  color: darkMode
                                    ? "#e5e7eb"
                                    : "#17203b",
                                  fontSize: "13px",
                                }}
                              >
                                <strong>
                                  Complaint Details
                                </strong>

                                <p
                                  style={{
                                    margin: "8px 0 4px",
                                  }}
                                >
                                  Category:{" "}
                                  {complaint.category ||
                                    "Other"}
                                </p>

                                <p
                                  style={{
                                    margin: "4px 0",
                                  }}
                                >
                                  Location:{" "}
                                  {complaint.location || "-"}
                                </p>

                                <p
                                  style={{
                                    margin: "4px 0",
                                  }}
                                >
                                  Status:{" "}
                                  {complaint.status ||
                                    "Pending"}
                                </p>

                                {complaint.created_at && (
                                  <p
                                    style={{
                                      margin: "4px 0",
                                    }}
                                  >
                                    Submitted:{" "}
                                    {new Date(
                                      complaint.created_at
                                    ).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            )}
                          </>
                        )}
                      </div>

                      {/* Status */}
                      <strong
                        className={`citizen-issue-status ${(
                          complaint.status || "Pending"
                        )
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {complaint.status || "Pending"}
                      </strong>
                    </article>
                  ))}
                </div>
              )}
            </main>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CitizenIssuePages;