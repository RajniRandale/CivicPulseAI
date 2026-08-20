import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // =====================================
  // FETCH ALL COMPLAINTS
  // =====================================

  const fetchComplaints = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // Check login
      if (!token || !savedUser) {
        navigate("/login");
        return;
      }

      let loggedUser;

      try {
        loggedUser = JSON.parse(savedUser);
      } catch (error) {
        console.error("Invalid user data:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // Check admin role
      if (loggedUser.role !== "admin") {
        alert("Access denied. Admins only.");
        navigate("/login");
        return;
      }

      setUser(loggedUser);

      // Fetch complaints from backend
      const response = await axios.get(
        "http://localhost:5000/api/complaints/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(response.data.complaints || []);
    } catch (error) {
      console.error("Admin dashboard error:", error);

      if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert(
          error.response?.data?.message ||
            "Admin authentication failed."
        );

        navigate("/login");
      } else {
        console.error(
          "Unable to load complaints:",
          error.response?.data || error.message
        );
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =====================================
  // LOAD DASHBOARD
  // =====================================

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // =====================================
  // LOGOUT
  // =====================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =====================================
  // COUNTS
  // =====================================

  const total = complaints.length;

  const pending = complaints.filter(
    (complaint) =>
      (complaint.status || "Pending").toLowerCase() ===
      "pending"
  ).length;

  const inProgress = complaints.filter(
    (complaint) =>
      (complaint.status || "").toLowerCase() ===
      "in progress"
  ).length;

  const resolved = complaints.filter(
    (complaint) =>
      (complaint.status || "").toLowerCase() ===
      "resolved"
  ).length;

  // =====================================
  // CATEGORY COUNTS
  // =====================================

  const categoryCounts = {};

  complaints.forEach((complaint) => {
    const category = complaint.category || "Others";

    categoryCounts[category] =
      (categoryCounts[category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCategoryCount =
    categoryData.length > 0
      ? Math.max(
          ...categoryData.map((item) => item[1])
        )
      : 1;

  // =====================================
  // DEPARTMENT DATA
  // =====================================

  // For now categories are displayed as departments.
  const departmentData = categoryData;

  const maxDepartmentCount =
    departmentData.length > 0
      ? Math.max(
          ...departmentData.map((item) => item[1])
        )
      : 1;

  // =====================================
  // LOADING
  // =====================================

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="spinner-border text-success"></div>

        <p>
          Loading Admin Dashboard...
        </p>
      </div>
    );
  }

  // =====================================
  // DASHBOARD
  // =====================================

  return (
    <div className="admin-dashboard">

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside className="admin-sidebar">

        {/* BRAND */}

        <div className="admin-brand">

          <div className="admin-brand-icon">
            🏙️
          </div>

          <div>
            <h4>
              CivicPulse AI
            </h4>

            <span>
              Admin Panel
            </span>
          </div>

        </div>

        {/* MENU */}

        <nav className="admin-menu">

          {/* DASHBOARD */}

          <button
            type="button"
            className="admin-menu-item active"
            onClick={() =>
              navigate("/admin-dashboard")
            }
          >
            <span>▦</span>
            Dashboard
          </button>

          {/* COMPLAINTS */}

          <button
            type="button"
            className="admin-menu-item"
            onClick={() =>
              navigate("/admin-complaints")
            }
          >
            <span>▤</span>
            Complaints
          </button>

          {/* CATEGORIES */}

          <button
            type="button"
            className="admin-menu-item"
          >
            <span>◆</span>
            Categories
          </button>

          {/* DEPARTMENTS */}

          <button
            type="button"
            className="admin-menu-item"
          >
            <span>♟</span>
            Departments
          </button>

          {/* USERS */}

          <button
            type="button"
            className="admin-menu-item"
          >
            <span>♣</span>
            Users
          </button>

          {/* ANALYTICS */}

          <button
            type="button"
            className="admin-menu-item"
          >
            <span>▥</span>
            Analytics
          </button>

          {/* REPORTS */}

          <button
            type="button"
            className="admin-menu-item"
          >
            <span>▣</span>
            Reports
          </button>

          {/* SETTINGS */}

          <button
            type="button"
            className="admin-menu-item"
          >
            <span>⚙</span>
            Settings
          </button>

        </nav>

        {/* LOGOUT */}

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
        >
          ⇥
          <span>
            Logout
          </span>
        </button>

      </aside>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <main className="admin-main">

        {/* HEADER */}

        <div className="admin-header">

          <div>

            <h1>
              Dashboard
            </h1>

            <p>
              Welcome back,{" "}
              {user?.name || "Admin"}
            </p>

          </div>

          <div className="date-selector">

            {new Date().toLocaleDateString(
              "en-IN",
              {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }
            )}

            <span>
              📅
            </span>

          </div>

        </div>

        {/* =====================================
            STAT CARDS
        ===================================== */}

        <div className="stats-grid">

          {/* TOTAL */}

          <div className="stat-card">

            <div className="stat-icon green">
              📋
            </div>

            <div>

              <p>
                Total Complaints
              </p>

              <h2>
                {total.toLocaleString()}
              </h2>

              <small className="positive">
                ↑ Total registered complaints
              </small>

            </div>

          </div>

          {/* IN PROGRESS */}

          <div className="stat-card">

            <div className="stat-icon blue">
              🔄
            </div>

            <div>

              <p>
                In Progress
              </p>

              <h2>
                {inProgress}
              </h2>

              <small className="positive">
                ↑ Currently being handled
              </small>

            </div>

          </div>

          {/* RESOLVED */}

          <div className="stat-card">

            <div className="stat-icon green">
              ✓
            </div>

            <div>

              <p>
                Resolved
              </p>

              <h2>
                {resolved}
              </h2>

              <small className="positive">
                ↑ Successfully resolved
              </small>

            </div>

          </div>

          {/* PENDING */}

          <div className="stat-card">

            <div className="stat-icon orange">
              ⏳
            </div>

            <div>

              <p>
                Pending
              </p>

              <h2>
                {pending}
              </h2>

              <small className="negative">
                ↓ Waiting for action
              </small>

            </div>

          </div>

        </div>

        {/* =====================================
            ANALYTICS
        ===================================== */}

        <div className="analytics-grid">

          {/* COMPLAINT OVERVIEW */}

          <div className="analytics-card">

            <h3>
              Complaints Overview
            </h3>

            <div className="overview-chart">

              <div className="y-axis">

                <span>
                  {total}
                </span>

                <span>
                  {Math.round(total * 0.75)}
                </span>

                <span>
                  {Math.round(total * 0.5)}
                </span>

                <span>
                  {Math.round(total * 0.25)}
                </span>

                <span>
                  0
                </span>

              </div>

              <div className="chart-area">

                <div className="chart-bars">

                  {/* REGISTERED */}

                  <div
                    className="chart-bar registered"
                    style={{
                      height:
                        total > 0
                          ? "75%"
                          : "5%",
                    }}
                  ></div>

                  {/* IN PROGRESS */}

                  <div
                    className="chart-bar progress"
                    style={{
                      height:
                        total > 0
                          ? `${Math.max(
                              (inProgress / total) *
                                100,
                              5
                            )}%`
                          : "5%",
                    }}
                  ></div>

                  {/* RESOLVED */}

                  <div
                    className="chart-bar resolved"
                    style={{
                      height:
                        total > 0
                          ? `${Math.max(
                              (resolved / total) *
                                100,
                              5
                            )}%`
                          : "5%",
                    }}
                  ></div>

                </div>

                <div className="chart-labels">

                  <span>
                    Registered
                  </span>

                  <span>
                    In Progress
                  </span>

                  <span>
                    Resolved
                  </span>

                </div>

              </div>

            </div>

            <div className="chart-legend">

              <span>
                <i className="legend-green"></i>
                Registered
              </span>

              <span>
                <i className="legend-blue"></i>
                Resolved
              </span>

            </div>

          </div>

          {/* TOP CATEGORIES */}

          <div className="analytics-card">

            <h3>
              Top Complaint Categories
            </h3>

            {categoryData.length === 0 ? (

              <div className="empty-data">
                No complaint data available
              </div>

            ) : (

              <div className="category-list">

                {categoryData.map(
                  ([category, count], index) => {

                    const percentage =
                      total > 0
                        ? Math.round(
                            (count / total) * 100
                          )
                        : 0;

                    return (
                      <div
                        className="category-row"
                        key={category}
                      >

                        <div className="category-name">

                          <span
                            className={`category-dot dot-${index}`}
                          ></span>

                          <span>
                            {category}
                          </span>

                        </div>

                        <div className="category-value">

                          <div className="category-progress">

                            <div
                              style={{
                                width: `${(
                                  (count /
                                    maxCategoryCount) *
                                  100
                                )}%`,
                              }}
                            ></div>

                          </div>

                          <strong>
                            {percentage}%
                          </strong>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

          {/* DEPARTMENT */}

          <div className="analytics-card">

            <h3>
              Complaints by Department
            </h3>

            {departmentData.length === 0 ? (

              <div className="empty-data">
                No complaint data available
              </div>

            ) : (

              <div className="department-chart">

                {departmentData.map(
                  ([department, count], index) => {

                    const height =
                      Math.max(
                        (count /
                          maxDepartmentCount) *
                          100,
                        8
                      );

                    return (
                      <div
                        className="department-column"
                        key={department}
                      >

                        <div className="department-value">
                          {count}
                        </div>

                        <div className="bar-wrapper">

                          <div
                            className={`department-bar bar-${index}`}
                            style={{
                              height: `${height}%`,
                            }}
                          ></div>

                        </div>

                        <span>
                          {department.length > 12
                            ? department.substring(
                                0,
                                12
                              ) + "..."
                            : department}
                        </span>

                      </div>
                    );
                  }
                )}

              </div>

            )}

          </div>

        </div>

        {/* =====================================
            RECENT COMPLAINTS
        ===================================== */}

        <div className="recent-card">

          <div className="recent-header">

            <h3>
              Recent Complaints
            </h3>

            <button
              type="button"
              onClick={() =>
                navigate("/admin-complaints")
              }
            >
              View All
            </button>

          </div>

          <div className="recent-table">

            {complaints.length === 0 ? (

              <div className="empty-data">
                No complaints available.
              </div>

            ) : (

              complaints
                .slice(0, 5)
                .map((complaint) => {

                  const status =
                    complaint.status ||
                    "Pending";

                  const statusClass =
                    status
                      .toLowerCase()
                      .replace(/\s+/g, "-");

                  return (
                    <div
                      className="recent-row"
                      key={complaint.id}
                    >

                      <span>
                        #{complaint.id}
                      </span>

                      <strong>
                        {complaint.category ||
                          "Others"}
                      </strong>

                      <span>
                        {complaint.location ||
                          "Location not available"}
                      </span>

                      <span
                        className={`status-badge ${statusClass}`}
                      >
                        {status}
                      </span>

                    </div>
                  );
                })

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;