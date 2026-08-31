import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaClipboardList,
  FaTasks,
} from "react-icons/fa";
import { useAppSettings } from "../components/TopUtilityBar";
import "./OfficerComplaintPage.css";

const labels = {
  English: {
    assigned: "Assigned Complaints",
    update: "Update Complaint Status",
    resolved: "Resolved Complaints",
    assignedDescription: "Review all complaints assigned to you.",
    updateDescription: "Update the progress and resolution status of complaints.",
    resolvedDescription: "Review complaints that have been successfully resolved.",
    back: "Back to Dashboard",
    complaint: "Complaint",
    citizen: "Citizen",
    category: "Category",
    location: "Location",
    status: "Status",
    noComplaints: "No complaints available.",
    loading: "Loading complaints...",
    failed: "Failed to update complaint status.",
  },
  Marathi: {
    assigned: "सोपवलेल्या तक्रारी",
    update: "तक्रारीची स्थिती अपडेट करा",
    resolved: "सोडवलेल्या तक्रारी",
    assignedDescription: "तुम्हाला सोपवलेल्या सर्व तक्रारी तपासा.",
    updateDescription: "तक्रारीची प्रगती आणि निराकरणाची स्थिती अपडेट करा.",
    resolvedDescription: "यशस्वीरित्या सोडवलेल्या तक्रारी तपासा.",
    back: "डॅशबोर्डवर परत जा",
    complaint: "तक्रार",
    citizen: "नागरिक",
    category: "श्रेणी",
    location: "स्थान",
    status: "स्थिती",
    noComplaints: "तक्रारी उपलब्ध नाहीत.",
    loading: "तक्रारी लोड होत आहेत...",
    failed: "तक्रारीची स्थिती अपडेट करता आली नाही.",
  },
  Hindi: {
    assigned: "सौंपी गई शिकायतें",
    update: "शिकायत की स्थिति अपडेट करें",
    resolved: "सुलझाई गई शिकायतें",
    assignedDescription: "आपको सौंपी गई सभी शिकायतों की समीक्षा करें।",
    updateDescription: "शिकायत की प्रगति और समाधान की स्थिति अपडेट करें।",
    resolvedDescription: "सफलतापूर्वक सुलझाई गई शिकायतों की समीक्षा करें।",
    back: "डैशबोर्ड पर वापस जाएँ",
    complaint: "शिकायत",
    citizen: "नागरिक",
    category: "श्रेणी",
    location: "स्थान",
    status: "स्थिति",
    noComplaints: "कोई शिकायत उपलब्ध नहीं है।",
    loading: "शिकायतें लोड हो रही हैं...",
    failed: "शिकायत की स्थिति अपडेट नहीं हो सकी।",
  },
};

function OfficerComplaintPage({ mode }) {
  const navigate = useNavigate();
  const { language, darkMode } = useAppSettings();
  const text = labels[language] || labels.English;
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchComplaints = useCallback(async () => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (!token || !savedUser) {
      navigate("/officer-login");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/complaints/all",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setComplaints(response.data?.complaints || []);
    } catch (error) {
      console.error("Officer complaints page error:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/officer-login");
      } else {
        setComplaints([]);
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const handleStatusChange = async (id, status) => {
    const token = localStorage.getItem("token");
    setUpdatingId(id);

    try {
      const response = await axios.put(
        `http://localhost:5000/api/complaints/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedComplaint = response.data?.complaint || {};
      setComplaints((current) =>
        current.map((complaint) =>
          complaint.id === id
            ? { ...complaint, ...updatedComplaint, status }
            : complaint
        )
      );
    } catch (error) {
      console.error("Complaint status update error:", error);
      alert(text.failed);
    } finally {
      setUpdatingId(null);
    }
  };

  const visibleComplaints = complaints.filter((complaint) => {
    const status = (complaint.status || "Pending").toLowerCase();
    return mode === "resolved" ? status === "resolved" : mode === "update" ? status !== "resolved" : true;
  });

  const pageTitle = mode === "resolved" ? text.resolved : mode === "update" ? text.update : text.assigned;
  const pageDescription = mode === "resolved" ? text.resolvedDescription : mode === "update" ? text.updateDescription : text.assignedDescription;

  return (
    <div className={`officer-complaint-page${darkMode ? " dark" : ""}`}>
      <div className="officer-complaint-container">
        <button type="button" className="complaint-page-back" onClick={() => navigate("/officer-dashboard")}>
          <FaArrowLeft /> {text.back}
        </button>

        <header className="complaint-page-header">
          <div className="complaint-page-icon">
            {mode === "resolved" ? <FaCheckCircle /> : mode === "update" ? <FaTasks /> : <FaClipboardList />}
          </div>
          <div>
            <span>CIVICPULSE AI</span>
            <h1>{pageTitle}</h1>
            <p>{pageDescription}</p>
          </div>
        </header>

        <section className="complaint-page-table-section">
          {loading ? (
            <p className="complaint-page-message">{text.loading}</p>
          ) : visibleComplaints.length === 0 ? (
            <p className="complaint-page-message">{text.noComplaints}</p>
          ) : (
            <div className="complaint-page-table-wrap">
              <table className="complaint-page-table">
                <thead>
                  <tr>
                    <th>{text.complaint}</th>
                    <th>{text.citizen}</th>
                    <th>{text.category}</th>
                    <th>{text.location}</th>
                    <th>{text.status}</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleComplaints.map((complaint) => (
                    <tr key={complaint.id}>
                      <td>
                        <strong>{complaint.title || text.complaint}</strong>
                        <small>{complaint.description || ""}</small>
                      </td>
                      <td>{complaint.citizen_name || "-"}</td>
                      <td>{complaint.category || "Others"}</td>
                      <td>{complaint.location || "-"}</td>
                      <td>
                        {mode === "update" ? (
                          <select
                            value={complaint.status || "Pending"}
                            disabled={updatingId === complaint.id}
                            onChange={(event) => handleStatusChange(complaint.id, event.target.value)}
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span className={`complaint-status ${(complaint.status || "Pending").toLowerCase().replace(/\s+/g, "-")}`}>
                            {complaint.status || "Pending"}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default OfficerComplaintPage;
