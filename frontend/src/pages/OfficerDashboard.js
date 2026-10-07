import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaCity,
  FaTachometerAlt,
  FaClipboardList,
  FaTasks,
  FaCheckCircle,
  FaBell,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserTie,
  FaClock,
  FaChartBar,
} from "react-icons/fa";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

import "./OfficerDashboard.css";

function OfficerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==================================================
  // GLOBAL SETTINGS
  // ==================================================

  const {
    language,
    darkMode,
  } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  // ==================================================
  // LANGUAGE LABELS
  // ==================================================

  const labels = {
    English: {
      dashboard: "Dashboard",
      assignedComplaints: "Assigned Complaints",
      updateStatus: "Update Status",
      resolvedComplaints: "Resolved Complaints",
      notifications: "Notifications",
      helpSupport: "Help & Support",
      officerPortal: "Officer Portal",
      welcomeBack: "Welcome back",

      reviewAssigned:
        "Review assigned complaints, update their status, and help resolve civic issues efficiently.",

      complaintsAssigned:
        "Complaints assigned to you",

      complaintsAwaiting:
        "Complaints awaiting action",

      successfullyResolved:
        "Successfully resolved complaints",

      management: "Management",

      officerFunctions:
        "Officer Functions",

      functionsSubtitle:
        "Quickly access your complaint management tools.",

      viewAssigned:
        "View Assigned Complaints",

      viewAssignedDesc:
        "Review and manage complaints assigned to you.",

      updateComplaintStatus:
        "Update Complaint Status",

      updateStatusDesc:
        "Update complaint progress and resolution status.",

      viewResolved:
        "View Resolved Complaints",

      viewResolvedDesc:
        "Check complaints that have been successfully resolved.",

      refresh: "Refresh",
      logout: "Logout",
      pending: "Pending",
      resolved: "Resolved",
      officer: "Officer",
      municipalOfficer: "Municipal Officer",
      municipalDepartment: "Municipal Department",
      noComplaints: "No complaints available",
      loading: "Loading dashboard...",

      accessDenied:
        "Access denied. Officers only.",
    },

    Marathi: {
      dashboard: "डॅशबोर्ड",

      assignedComplaints:
        "सोपवलेल्या तक्रारी",

      updateStatus:
        "स्थिती अपडेट करा",

      resolvedComplaints:
        "सोडवलेल्या तक्रारी",

      notifications:
        "सूचना",

      helpSupport:
        "मदत आणि समर्थन",

      officerPortal:
        "अधिकारी पोर्टल",

      welcomeBack:
        "पुन्हा स्वागत आहे",

      reviewAssigned:
        "सोपवलेल्या तक्रारी तपासा, त्यांची स्थिती अपडेट करा आणि नागरी समस्या कार्यक्षमतेने सोडविण्यास मदत करा.",

      complaintsAssigned:
        "तुम्हाला सोपवलेल्या तक्रारी",

      complaintsAwaiting:
        "कारवाईची प्रतीक्षा करणाऱ्या तक्रारी",

      successfullyResolved:
        "यशस्वीरित्या सोडवलेल्या तक्रारी",

      management:
        "व्यवस्थापन",

      officerFunctions:
        "अधिकारी कार्ये",

      functionsSubtitle:
        "तुमची तक्रार व्यवस्थापन साधने सहज वापरा.",

      viewAssigned:
        "सोपवलेल्या तक्रारी पहा",

      viewAssignedDesc:
        "तुम्हाला सोपवलेल्या तक्रारी तपासा आणि व्यवस्थापित करा.",

      updateComplaintStatus:
        "तक्रारीची स्थिती अपडेट करा",

      updateStatusDesc:
        "तक्रारीची प्रगती आणि निराकरणाची स्थिती अपडेट करा.",

      viewResolved:
        "सोडवलेल्या तक्रारी पहा",

      viewResolvedDesc:
        "यशस्वीरित्या सोडवलेल्या तक्रारी तपासा.",

      refresh:
        "रिफ्रेश",

      logout:
        "लॉगआउट",

      pending:
        "प्रलंबित",

      resolved:
        "सोडवलेल्या",

      officer:
        "अधिकारी",

      municipalOfficer:
        "महानगरपालिका अधिकारी",

      municipalDepartment:
        "महानगरपालिका विभाग",

      noComplaints:
        "तक्रारी उपलब्ध नाहीत",

      loading:
        "डॅशबोर्ड लोड होत आहे...",

      accessDenied:
        "प्रवेश नाकारला. फक्त अधिकाऱ्यांसाठी.",
    },

    Hindi: {
      dashboard:
        "डैशबोर्ड",

      assignedComplaints:
        "सौंपी गई शिकायतें",

      updateStatus:
        "स्थिति अपडेट करें",

      resolvedComplaints:
        "सुलझाई गई शिकायतें",

      notifications:
        "सूचनाएँ",

      helpSupport:
        "मदद और सहायता",

      officerPortal:
        "अधिकारी पोर्टल",

      welcomeBack:
        "वापसी पर स्वागत है",

      reviewAssigned:
        "सौंपी गई शिकायतों की समीक्षा करें, उनकी स्थिति अपडेट करें और नागरिक समस्याओं को कुशलतापूर्वक हल करने में मदद करें।",

      complaintsAssigned:
        "आपको सौंपी गई शिकायतें",

      complaintsAwaiting:
        "कार्रवाई की प्रतीक्षा कर रही शिकायतें",

      successfullyResolved:
        "सफलतापूर्वक सुलझाई गई शिकायतें",

      management:
        "प्रबंधन",

      officerFunctions:
        "अधिकारी कार्य",

      functionsSubtitle:
        "अपने शिकायत प्रबंधन उपकरणों तक आसानी से पहुँचें।",

      viewAssigned:
        "सौंपी गई शिकायतें देखें",

      viewAssignedDesc:
        "आपको सौंपी गई शिकायतों की समीक्षा और प्रबंधन करें।",

      updateComplaintStatus:
        "शिकायत की स्थिति अपडेट करें",

      updateStatusDesc:
        "शिकायत की प्रगति और समाधान की स्थिति अपडेट करें।",

      viewResolved:
        "सुलझाई गई शिकायतें देखें",

      viewResolvedDesc:
        "सफलतापूर्वक सुलझाई गई शिकायतें देखें।",

      refresh:
        "रिफ्रेश",

      logout:
        "लॉगआउट",

      pending:
        "लंबित",

      resolved:
        "सुलझाई गई",

      officer:
        "अधिकारी",

      municipalOfficer:
        "नगरपालिका अधिकारी",

      municipalDepartment:
        "नगरपालिका विभाग",

      noComplaints:
        "कोई शिकायत उपलब्ध नहीं",

      loading:
        "डैशबोर्ड लोड हो रहा है...",

      accessDenied:
        "प्रवेश अस्वीकृत। केवल अधिकारियों के लिए।",
    },
  };

  const lang =
    labels[language] ||
    labels.English;

  // ==================================================
  // STATES
  // ==================================================

  const [user, setUser] =
    useState(null);

  const [complaints, setComplaints] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [viewFilter, setViewFilter] =
    useState(() => {
      if (location.pathname === "/officer-update-status") {
        return "active";
      }

      if (location.pathname === "/officer-resolved-complaints") {
        return "resolved";
      }

      return "all";
    });

  const [updatingComplaintId, setUpdatingComplaintId] =
    useState(null);

  const [relatedByComplaint, setRelatedByComplaint] =
    useState({});

  const [openRelatedComplaintId, setOpenRelatedComplaintId] =
    useState(null);

  const [loadingRelatedComplaintId, setLoadingRelatedComplaintId] =
    useState(null);

  useEffect(() => {
    if (location.pathname === "/officer-update-status") {
      setViewFilter("active");
      return;
    }

    if (location.pathname === "/officer-resolved-complaints") {
      setViewFilter("resolved");
      return;
    }

    setViewFilter("all");
  }, [location.pathname]);

  // ==================================================
  // FETCH COMPLAINTS
  // ==================================================

  const fetchComplaints =
    useCallback(async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("token");

        const savedUser =
          localStorage.getItem("user");

        // NO LOGIN
        if (!token || !savedUser) {
          navigate("/officer-login");
          return;
        }

        // PARSE USER
        let loggedUser;

        try {
          loggedUser =
            JSON.parse(savedUser);
        } catch (error) {
          console.error(
            "Invalid user data:",
            error
          );

          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "currentUser"
          );

          navigate(
            "/officer-login"
          );

          return;
        }

        // OFFICER CHECK
        if (
          !loggedUser.role ||
          loggedUser.role.toLowerCase() !==
            "officer"
        ) {
          alert(
            language === "Marathi"
              ? "प्रवेश नाकारला. फक्त अधिकाऱ्यांसाठी."
              : language === "Hindi"
                ? "प्रवेश अस्वीकृत। केवल अधिकारियों के लिए।"
                : "Access denied. Officers only."
          );

          navigate("/login");
          return;
        }

        setUser(loggedUser);

        // FETCH COMPLAINTS
        const response =
          await axios.get(
            "http://localhost:5000/api/complaints/all",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setComplaints(
          response.data?.complaints ||
            []
        );

      } catch (error) {
        console.error(
          "Officer dashboard error:",
          error
        );

        if (
          error.response?.status ===
            401 ||
          error.response?.status ===
            403
        ) {
          localStorage.removeItem(
            "token"
          );

          localStorage.removeItem(
            "user"
          );

          localStorage.removeItem(
            "currentUser"
          );

          navigate(
            "/officer-login"
          );

          return;
        }

        setComplaints([]);

      } finally {
        setLoading(false);
      }
    }, [
      navigate,
      language,
    ]);

  // ==================================================
  // LOAD
  // ==================================================

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const showComplaintSection = (filter) => {
    const route = filter === "active"
      ? "/officer-update-status"
      : filter === "resolved"
        ? "/officer-resolved-complaints"
        : "/officer-assigned-complaints";

    navigate(route);
  };

  const handleStatusChange = async (complaintId, status) => {
    const token = localStorage.getItem("token");

    try {
      setUpdatingComplaintId(complaintId);

      const response = await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedComplaint = response.data?.complaint;

      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          complaint.id === complaintId
            ? { ...complaint, ...updatedComplaint, status }
            : complaint
        )
      );
    } catch (error) {
      console.error("Complaint status update error:", error);

      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate("/officer-login");
      } else {
        alert("Failed to update complaint status.");
      }
    } finally {
      setUpdatingComplaintId(null);
    }
  };

  const handleShowRelatedComplaints = async (complaintId) => {
    if (openRelatedComplaintId === complaintId) {
      setOpenRelatedComplaintId(null);
      return;
    }

    if (relatedByComplaint[complaintId]) {
      setOpenRelatedComplaintId(complaintId);
      return;
    }

    try {
      setLoadingRelatedComplaintId(complaintId);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:5000/api/complaints/${complaintId}/related`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRelatedByComplaint((current) => ({
        ...current,
        [complaintId]: response.data?.complaints || [],
      }));
      setOpenRelatedComplaintId(complaintId);
    } catch (error) {
      console.error("Related complaint fetch error:", error);
      alert("Unable to load related complaints.");
    } finally {
      setLoadingRelatedComplaintId(null);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "currentUser"
    );

    navigate("/login");
  };

  // ==================================================
  // COUNTS
  // ==================================================

  const totalComplaints =
    complaints.length;

  const pendingComplaints =
    complaints.filter(
      (item) =>
        (
          item.status ||
          "Pending"
        ).toLowerCase() ===
        "pending"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (item) =>
        (
          item.status ||
          ""
        ).toLowerCase() ===
        "resolved"
    ).length;

  const visibleComplaints =
    complaints.filter((complaint) => {
      const status = (
        complaint.status ||
        "Pending"
      ).toLowerCase();

      if (viewFilter === "resolved") {
        return status === "resolved";
      }

      if (viewFilter === "active") {
        return status !== "resolved";
      }

      return true;
    });

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div
        className="officer-loading"
        data-theme={
          darkMode
            ? "dark"
            : "light"
        }
      >
        <div className="spinner-border text-success"></div>

        <p>
          {lang.loading}
        </p>
      </div>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div
      className="officer-layout"
      data-theme={
        darkMode
          ? "dark"
          : "light"
      }
    >

      {/* SIDEBAR */}

      <aside className="officer-sidebar">

        {/* BRAND */}

        <div className="officer-brand">

          <div className="officer-brand-icon">
            <FaCity />
          </div>

          <div>
            <h4>
              CivicPulse AI
            </h4>

            <span>
              {lang.officerPortal}
            </span>
          </div>

        </div>

        <div className="sidebar-divider"></div>

        {/* MENU */}

        <nav className="officer-menu">

          {/* DASHBOARD */}

          <button
            type="button"
            className="officer-menu-item active"
            onClick={() =>
              navigate(
                "/officer-dashboard"
              )
            }
          >
            <FaTachometerAlt />

            <span>
              {lang.dashboard}
            </span>
          </button>


          {/* ASSIGNED COMPLAINTS */}

          <button
            type="button"
            className="officer-menu-item"
            onClick={() =>
              showComplaintSection("all")
            }
          >
            <FaClipboardList />

            <span>
              {lang.assignedComplaints}
            </span>
          </button>


          {/* UPDATE STATUS */}

          <button
            type="button"
            className="officer-menu-item"
            onClick={() =>
              showComplaintSection("active")
            }
          >
            <FaTasks />

            <span>
              {lang.updateStatus}
            </span>
          </button>


          {/* RESOLVED */}

          <button
            type="button"
            className="officer-menu-item"
            onClick={() =>
              showComplaintSection("resolved")
            }
          >
            <FaCheckCircle />

            <span>
              {lang.resolvedComplaints}
            </span>
          </button>


          {/* NOTIFICATIONS */}

          <button
            type="button"
            className="officer-menu-item"
            onClick={() =>
              navigate("/officer-notifications")
            }
          >
            <FaBell />

            <span>
              {lang.notifications}
            </span>
          </button>


          {/* HELP & SUPPORT */}

          <button
            type="button"
            className="officer-menu-item"
            onClick={() =>
              navigate("/officer-help")
            }
          >
            <FaQuestionCircle />

            <span>
              {lang.helpSupport}
            </span>
          </button>

        </nav>


        {/* BOTTOM */}

        <div className="sidebar-bottom">

          {/* PROFILE */}

          <div className="officer-profile-card">

            <div className="profile-icon">
              <FaUserTie />
            </div>

            <div className="profile-info">

              <strong>
                {user?.name ||
                  lang.officer}
              </strong>

              <span>
                {user?.designation ||
                  lang.municipalOfficer}
              </span>

            </div>

          </div>


          {/* LOGOUT */}

          <button
            type="button"
            className="officer-logout"
            onClick={
              handleLogout
            }
          >
            <FaSignOutAlt />

            <span>
              {lang.logout}
            </span>
          </button>

        </div>

      </aside>


      {/* MAIN */}

      <main className="officer-main">

        {/* HEADER */}

        <header className="officer-top-header">

          <div>

            <span className="dashboard-label">
              CIVICPULSE AI
            </span>

            <h1>
              {lang.dashboard}
            </h1>

            <p>
              {lang.reviewAssigned}
            </p>

          </div>

          <div className="officer-date-selector">
            {new Date().toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            <span>📅</span>
          </div>


        </header>


        {/* HERO */}

        <section className="officer-hero">

          <div className="hero-content">

            <span className="hero-label">
              {lang.officerPortal}
            </span>

            <h2>
              {lang.welcomeBack},{" "}
              {user?.name ||
                lang.officer}!
            </h2>

            <p>
              {lang.reviewAssigned}
            </p>

          </div>


          <div className="hero-pattern">
            <FaCity />
          </div>

        </section>


        {/* STATS */}

        <section
          className="officer-stats"
          id="assigned-section"
        >

          {/* ASSIGNED */}

          <div className="officer-stat-card">

            <div className="stat-icon blue">
              <FaClipboardList />
            </div>

            <div className="stat-content">

              <span>
                {lang.assignedComplaints}
              </span>

              <strong>
                {totalComplaints}
              </strong>

              <small>
                {lang.complaintsAssigned}
              </small>

            </div>

          </div>


          {/* PENDING */}

          <div className="officer-stat-card">

            <div className="stat-icon orange">
              <FaClock />
            </div>

            <div className="stat-content">

              <span>
                {lang.pending}{" "}
                {language ===
                "English"
                  ? "Complaints"
                  : language ===
                    "Marathi"
                  ? "तक्रारी"
                  : "शिकायतें"}
              </span>

              <strong>
                {pendingComplaints}
              </strong>

              <small>
                {lang.complaintsAwaiting}
              </small>

            </div>

          </div>


          {/* RESOLVED */}

          <div
            className="officer-stat-card"
            id="resolved-section"
          >

            <div className="stat-icon green">
              <FaCheckCircle />
            </div>

            <div className="stat-content">

              <span>
                {lang.resolvedComplaints}
              </span>

              <strong>
                {resolvedComplaints}
              </strong>

              <small>
                {lang.successfullyResolved}
              </small>

            </div>

          </div>

        </section>


        {/* MANAGEMENT */}

        <section className="management-section">

          <div className="section-heading">

            <div>

              <span>
                {lang.management}
              </span>

              <h2>
                {lang.officerFunctions}
              </h2>

              <p>
                {lang.functionsSubtitle}
              </p>

            </div>

            <FaChartBar className="section-chart-icon" />

          </div>


          {/* FUNCTION CARDS */}

          <div className="function-grid">

            {/* VIEW ASSIGNED */}

            <button
              type="button"
              className="function-card"
              onClick={() =>
                showComplaintSection("all")
              }
            >
              <div className="function-icon blue">
                <FaClipboardList />
              </div>

              <div>
                <h3>
                  {lang.viewAssigned}
                </h3>

                <p>
                  {lang.viewAssignedDesc}
                </p>
              </div>

            </button>


            {/* UPDATE STATUS */}

            <button
              type="button"
              className="function-card"
              onClick={() =>
                showComplaintSection("active")
              }
            >
              <div className="function-icon orange">
                <FaTasks />
              </div>

              <div>
                <h3>
                  {lang.updateComplaintStatus}
                </h3>

                <p>
                  {lang.updateStatusDesc}
                </p>
              </div>

            </button>


            {/* RESOLVED */}

            <button
              type="button"
              className="function-card"
              onClick={() =>
                showComplaintSection("resolved")
              }
            >
              <div className="function-icon green">
                <FaCheckCircle />
              </div>

              <div>
                <h3>
                  {lang.viewResolved}
                </h3>

                <p>
                  {lang.viewResolvedDesc}
                </p>
              </div>

            </button>

          </div>

        </section>


        {/* COMPLAINT LIST */}

        <section
          className="complaints-section"
          id="complaint-list"
        >

          <div className="complaints-header">

            <div>

              <span>
                {lang.assignedComplaints}
              </span>

              <h2>
                {t.complaints ||
                  (
                    language ===
                    "Marathi"
                      ? "तक्रारी"
                      : language ===
                        "Hindi"
                      ? "शिकायतें"
                      : "Complaints"
                  )}
              </h2>

            </div>


            <button
              type="button"
              className="refresh-btn"
              onClick={
                fetchComplaints
              }
            >
              🔄{" "}
              {lang.refresh}
            </button>

          </div>


          {visibleComplaints.length ===
          0 ? (

            <div className="empty-complaints">

              <FaClipboardList />

              <h3>
                {lang.noComplaints}
              </h3>

            </div>

          ) : (

            <div className="complaints-table-wrap">

              <table className="complaints-table">

                <thead>

                  <tr>
                    <th>Complaint</th>
                    <th>Citizen</th>
                    <th>Category</th>
                    <th>Department</th>
                    <th>Priority</th>
                    <th>Same Issue</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Image</th>
                    <th>Created</th>
                  </tr>

                </thead>


                <tbody>

                  {visibleComplaints
                    .slice(0, 10)
                    .map((complaint) => (
                      <React.Fragment key={complaint.id}>
                        <tr>
                          <td>
                            <strong>#{complaint.id}</strong>
                            <small>{complaint.title}</small>
                          </td>

                          <td>
                            <strong>
                              {complaint.citizen_name ||
                                lang.officer}
                            </strong>

                            {complaint.citizen_email && (
                              <small>
                                {
                                  complaint.citizen_email
                                }
                              </small>
                            )}
                          </td>

                          <td>
                            <span className="category-badge">
                              {complaint.category ||
                                "Others"}
                            </span>
                          </td>

                          <td>{complaint.department || user?.department || "-"}</td>

                          <td>
                            <span
                              className={`priority-badge ${(
                                complaint.priority || "Low"
                              ).toLowerCase()}`}
                            >
                              {complaint.priority || "Low"}
                            </span>
                          </td>

                          <td>
                            {complaint.related_complaint_count > 1 ? (
                              <button
                                type="button"
                                className="related-complaints-button"
                                onClick={() =>
                                  handleShowRelatedComplaints(complaint.id)
                                }
                                disabled={
                                  loadingRelatedComplaintId === complaint.id
                                }
                              >
                                {loadingRelatedComplaintId === complaint.id
                                  ? "Loading..."
                                  : `${complaint.related_complaint_count} related complaints`}
                              </button>
                            ) : (
                              "-"
                            )}
                          </td>
                          <td>📍 {complaint.location || "-"}</td>
                          <td>
                            <select
                              className={`status-select ${
                                (
                                  complaint.status ||
                                  "Pending"
                                )
                                  .toLowerCase()
                                  .replace(/\s+/g, "-")
                              }`}
                              value={complaint.status || "Pending"}
                              disabled={updatingComplaintId === complaint.id}
                              onChange={(event) =>
                                handleStatusChange(
                                  complaint.id,
                                  event.target.value
                                )
                              }
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Resolved">Resolved</option>
                              <option value="Rejected">Rejected</option>
                            </select>
                          </td>
                          <td>
                            {complaint.image?.startsWith("/uploads/") ? (
                              <a
                                href={`http://localhost:5000${complaint.image}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Open complaint ${complaint.id} image`}
                              >
                                <img
                                  src={`http://localhost:5000${complaint.image}`}
                                  alt={`Complaint ${complaint.id}`}
                                  className="complaint-image-thumbnail"
                                />
                              </a>
                            ) : (
                              complaint.image || "-"
                            )}
                          </td>
                          <td>
                            {complaint.created_at
                              ? new Date(complaint.created_at).toLocaleString()
                              : "-"}
                          </td>
                        </tr>

                        {openRelatedComplaintId === complaint.id && (
                          <tr className="related-complaints-row">
                            <td colSpan="10">
                              <strong>
                                {complaint.duplicate_group_label ||
                                  "Possible Duplicate / Same Issue"}
                              </strong>
                              <div className="related-complaints-list">
                                {(relatedByComplaint[complaint.id] || []).map(
                                  (related) => (
                                    <div key={related.id}>
                                      <strong>#{related.id}</strong>{" "}
                                      {related.citizen_name || "Citizen"} —{" "}
                                      {related.title || related.description} —{" "}
                                      {related.location} — {related.status}
                                    </div>
                                  )
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

    </div>
  );
}

export default OfficerDashboard;