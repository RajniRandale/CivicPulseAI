import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaChartBar,
  FaClipboardList,
  FaCog,
  FaFileAlt,
  FaSitemap,
  FaUsers,
} from "react-icons/fa";
import { useAppSettings } from "../components/TopUtilityBar";
import "./AdminManagementPage.css";

const pageConfig = {
  complaints: {
    title: "Complaints",
    description: "Review complaints submitted by citizens.",
    icon: <FaClipboardList />,
  },
  departments: {
    title: "Departments",
    description: "Manage civic departments handling complaints.",
    icon: <FaSitemap />,
  },
  users: {
    title: "Users",
    description: "View registered citizens and portal users.",
    icon: <FaUsers />,
  },
  analytics: {
    title: "Analytics",
    description: "Understand complaint volume and resolution progress.",
    icon: <FaChartBar />,
  },
  reports: {
    title: "Reports",
    description: "Review a summary of the complaint records.",
    icon: <FaFileAlt />,
  },
  settings: {
    title: "Settings",
    description: "Admin portal settings and account information.",
    icon: <FaCog />,
  },
};

const menuItems = [
  ["Dashboard", "/admin-dashboard"],
  ["Complaints", "/admin-complaints"],
  ["Departments", "/admin-departments"],
  ["Users", "/admin-users"],
  ["Analytics", "/admin-analytics"],
  ["Reports", "/admin-reports"],
  ["Settings", "/admin-settings"],
];

const departmentNames = [
  "Garbage & Waste Management",
  "Road Damage / Potholes",
  "Street Light",
  "Drainage & Sewerage",
  "Water Supply",
  "Other",
];

function AdminManagementPage({ type }) {
  const navigate = useNavigate();
  const { darkMode } = useAppSettings();
  const config = pageConfig[type];
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(type === "complaints" || type === "departments" || type === "analytics" || type === "reports");

  useEffect(() => {
    if (!loading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    axios.get("http://localhost:5000/api/complaints/all", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => setComplaints(response.data?.complaints || []))
      .catch((error) => {
        console.error("Admin management page error:", error);
        if (error.response?.status === 401) {
          navigate("/admin-login");
        }
        setComplaints([]);
      })
      .finally(() => setLoading(false));
  }, [loading, navigate]);

  const total = complaints.length;
  const resolved = complaints.filter((item) => item.status === "Resolved").length;
  const pending = complaints.filter((item) => !item.status || item.status === "Pending").length;
  const inProgress = complaints.filter((item) => item.status === "In Progress").length;
  const departmentCounts = complaints.reduce((counts, complaint) => {
    const department = complaint.category || "Other";
    counts[department] = (counts[department] || 0) + 1;
    return counts;
  }, {});

  const departments = departmentNames.map((department) => [
    department,
    departmentCounts[department] || 0,
  ]);

  const renderBody = () => {
    if (loading) return <p className="admin-page-message">Loading data...</p>;

    if (type === "departments") {
      if (departments.length === 0) {
        return <p className="admin-page-message">No departments available.</p>;
      }

      return <div className="admin-department-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", padding: "25px" }}>{departments.map(([department, count]) => <div className="admin-department-card" key={department} style={{ display: "flex", alignItems: "center", gap: "14px", padding: "20px", border: "1px solid #e1e9e5", borderRadius: "12px", background: darkMode ? "#253244" : "#f8fbf9" }}><FaSitemap style={{ color: "#178a56", fontSize: "24px" }} /><div><strong>{department}</strong><span style={{ display: "block", marginTop: "5px", color: darkMode ? "#cbd5e1" : "#68746e", fontSize: "13px" }}>{count} complaint{count === 1 ? "" : "s"}</span></div></div>)}</div>;
    }

    if (type === "users") {
      return <p className="admin-page-message">User records will appear here when user management is connected.</p>;
    }

    if (type === "settings") {
      return <div className="admin-settings-content"><h3>Admin Portal</h3><p>Use the utility bar to control language and theme preferences.</p></div>;
    }

    if (type === "analytics") {
      return <div className="admin-metric-grid"><div><strong>{total}</strong><span>Total complaints</span></div><div><strong>{pending}</strong><span>Pending</span></div><div><strong>{inProgress}</strong><span>In progress</span></div><div><strong>{resolved}</strong><span>Resolved</span></div></div>;
    }

    if (type === "reports") {
      return <div className="admin-report-summary"><p>Total complaint records: <strong>{total}</strong></p><p>Resolved records: <strong>{resolved}</strong></p><p>Open records: <strong>{total - resolved}</strong></p></div>;
    }

    if (complaints.length === 0) return <p className="admin-page-message">No complaints available.</p>;

    return <div className="admin-management-table-wrap"><table><thead><tr><th>ID</th><th>Category</th><th>Location</th><th>Status</th></tr></thead><tbody>{complaints.map((complaint) => <tr key={complaint.id}><td>#{complaint.id}</td><td>{complaint.category || "Others"}</td><td>{complaint.location || "-"}</td><td>{complaint.status || "Pending"}</td></tr>)}</tbody></table></div>;
  };

  return <div className={`admin-management-page${darkMode ? " dark" : ""}`}>
    <aside className="admin-management-sidebar">
      <div className="admin-management-brand"><strong>CivicPulse AI</strong><span>Admin Portal</span></div>
      <nav>{menuItems.map(([label, path]) => <button type="button" className={path === window.location.pathname ? "active" : ""} key={path} onClick={() => navigate(path)}>{label}</button>)}</nav>
    </aside>
    <main className="admin-management-main">
      <button type="button" className="admin-management-back" onClick={() => navigate("/admin-dashboard")}><FaArrowLeft /> Back to Dashboard</button>
      <header className="admin-management-header"><div className="admin-management-icon">{config.icon}</div><div><span>CIVICPULSE AI</span><h1>{config.title}</h1><p>{config.description}</p></div></header>
      <section className="admin-management-content">{renderBody()}</section>
    </main>
  </div>;
}

export default AdminManagementPage;
