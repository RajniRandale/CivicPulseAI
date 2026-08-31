import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBell, FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { useAppSettings } from "../components/TopUtilityBar";
import "./CitizenIssuePages.css";

function CitizenIssuePages({ mode }) {
  const navigate = useNavigate();
  const { darkMode } = useAppSettings();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trackedComplaintId, setTrackedComplaintId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/citizen-login");
      return;
    }

    axios.get(
      `http://localhost:5000/api/complaints/${mode === "nearby" ? "nearby" : "my"}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => setComplaints(response.data?.complaints || []))
      .catch((error) => {
        console.error("Citizen issue page error:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          navigate("/citizen-login");
        }
      })
      .finally(() => setLoading(false));
  }, [mode, navigate]);

  const isNearby = mode === "nearby";
  const isNotifications = mode === "notifications";
  const title = isNearby ? "Nearby Issues" : isNotifications ? "Notifications" : "Track Complaint";
  const description = isNearby
    ? "View complaints reported by other citizens in your city."
    : isNotifications
      ? "View updates about the status of your submitted complaints."
      : "Track the current status of your submitted complaints.";
  const icon = isNearby ? <FaMapMarkerAlt /> : isNotifications ? <FaBell /> : <FaSearch />;
  const visibleComplaints = isNotifications
    ? complaints.filter(
        (complaint) =>
          (complaint.status || "").toLowerCase() === "resolved"
      )
    : complaints;
  const emptyMessage = isNotifications
    ? "No resolved notifications available."
    : "No complaints available.";

  return (
    <div className={`citizen-issue-page${darkMode ? " dark" : ""}`}>
      <div className="citizen-issue-container">
        <button type="button" className="citizen-issue-back" onClick={() => navigate("/citizen-dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <header className="citizen-issue-header">
          <div>{icon}</div>
          <section><span>CIVICPULSE AI</span><h1>{title}</h1><p>{description}</p></section>
        </header>
        <main className="citizen-issue-content">
          {loading ? <p className="citizen-issue-message">Loading complaints...</p> : visibleComplaints.length === 0 ? <p className="citizen-issue-message">{emptyMessage}</p> : (
            <div className="citizen-issue-list">{visibleComplaints.map((complaint) => <article key={complaint.id} className="citizen-issue-card"><div><span className="citizen-issue-category">{isNotifications ? "Complaint Resolved" : mode === "track" ? `Complaint #${complaint.id}` : complaint.category || "Other"}</span><h2>{complaint.title || "Complaint"}</h2><p>{isNotifications ? "Your complaint has been successfully resolved." : complaint.description || "No description available."}</p><small><FaMapMarkerAlt /> {complaint.location || "Location not available"}</small>{mode === "track" && complaint.created_at && <small className="citizen-issue-date">Submitted: {new Date(complaint.created_at).toLocaleString()}</small>}{mode === "track" && <><button type="button" onClick={() => setTrackedComplaintId(trackedComplaintId === complaint.id ? null : complaint.id)} style={{ marginTop: "14px", padding: "8px 16px", border: 0, borderRadius: "18px", background: "#24508b", color: "#fff", fontSize: "12px", fontWeight: 700, cursor: "pointer" }}>{trackedComplaintId === complaint.id ? "Hide Details" : "Track Complaint"}</button>{trackedComplaintId === complaint.id && <div style={{ marginTop: "14px", padding: "14px", borderRadius: "10px", background: darkMode ? "#253244" : "#f4f8ff", color: darkMode ? "#e5e7eb" : "#17203b", fontSize: "13px" }}><strong>Complaint Details</strong><p style={{ margin: "8px 0 4px" }}>Category: {complaint.category || "Other"}</p><p style={{ margin: "4px 0" }}>Location: {complaint.location || "-"}</p><p style={{ margin: "4px 0" }}>Status: {complaint.status || "Pending"}</p>{complaint.created_at && <p style={{ margin: "4px 0" }}>Submitted: {new Date(complaint.created_at).toLocaleString()}</p>}</div>}</>}</div><strong className={`citizen-issue-status ${(complaint.status || "Pending").toLowerCase().replace(/\s+/g, "-")}`}>{complaint.status || "Pending"}</strong></article>)}</div>
          )}
        </main>
      </div>
    </div>
  );
}

export default CitizenIssuePages;
