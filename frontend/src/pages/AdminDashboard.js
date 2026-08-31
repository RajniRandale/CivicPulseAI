import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./AdminDashboard.css";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

function AdminDashboard() {
  const navigate = useNavigate();

  // ==================================================
  // GLOBAL LANGUAGE + THEME
  // ==================================================

  const {
    language,
    darkMode,
  } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  // ==================================================
  // THEME COLORS
  // ==================================================

  const theme = {
    pageBg: darkMode
      ? "#111827"
      : "#f8fafc",

    sidebarBg: darkMode
      ? "#0f172a"
      : "#ffffff",

    cardBg: darkMode
      ? "#1f2937"
      : "#ffffff",

    inputBg: darkMode
      ? "#374151"
      : "#ffffff",

    text: darkMode
      ? "#f9fafb"
      : "#111827",

    mutedText: darkMode
      ? "#cbd5e1"
      : "#64748b",

    border: darkMode
      ? "#374151"
      : "#e2e8f0",

    hoverBg: darkMode
      ? "#273449"
      : "#f1f5f9",

    headerBg: darkMode
      ? "#1f2937"
      : "#ffffff",
  };

  // ==================================================
  // STATES
  // ==================================================

  const [user, setUser] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==================================================
  // FETCH COMPLAINTS
  // ==================================================

  const fetchComplaints = useCallback(
    async () => {
      try {
        const token =
          localStorage.getItem("token");

        const savedUser =
          localStorage.getItem("user");

        if (!token || !savedUser) {
          navigate("/admin-login", {
            replace: true,
          });
          return;
        }

        let loggedUser;

        try {
          loggedUser =
            JSON.parse(savedUser);
        } catch (error) {
          console.error(
            "Invalid user data:",
            error
          );

          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem(
            "currentUser"
          );

          navigate("/admin-login", {
            replace: true,
          });

          return;
        }

        if (
          !loggedUser.role ||
          loggedUser.role.toLowerCase() !==
            "admin"
        ) {
          alert(
            language === "Marathi"
              ? "प्रवेश नाकारला. फक्त ॲडमिनसाठी."
              : language === "Hindi"
              ? "प्रवेश अस्वीकृत। केवल एडमिन के लिए।"
              : "Access denied. Admins only."
          );

          localStorage.removeItem("token");
          localStorage.removeItem("user");
          localStorage.removeItem(
            "currentUser"
          );

          navigate("/login", {
            replace: true,
          });

          return;
        }

        setUser(loggedUser);

        try {
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
            response.data?.complaints || []
          );
        } catch (complaintError) {
          console.error(
            "Failed to load complaints:",
            complaintError.response?.data ||
              complaintError.message
          );

          // Dashboard should remain open
          setComplaints([]);
        }

      } catch (error) {
        console.error(
          "Admin dashboard error:",
          error
        );
      } finally {
        setLoading(false);
      }
    },
    [navigate, language]
  );

  // ==================================================
  // LOAD DASHBOARD
  // ==================================================

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem(
      "currentUser"
    );

    navigate("/login", {
      replace: true,
    });
  };

  // ==================================================
  // COUNTS
  // ==================================================

  const total =
    complaints.length;

  const pending =
    complaints.filter(
      (complaint) =>
        (
          complaint.status ||
          "Pending"
        ).toLowerCase() === "pending"
    ).length;

  const inProgress =
    complaints.filter(
      (complaint) =>
        (
          complaint.status ||
          ""
        ).toLowerCase() ===
        "in progress"
    ).length;

  const resolved =
    complaints.filter(
      (complaint) =>
        (
          complaint.status ||
          ""
        ).toLowerCase() ===
        "resolved"
    ).length;

  // ==================================================
  // CATEGORY DATA
  // ==================================================

  const categoryCounts = {};

  complaints.forEach(
    (complaint) => {
      const category =
        complaint.category ||
        "Others";

      categoryCounts[category] =
        (categoryCounts[category] || 0) +
        1;
    }
  );

  const categoryData =
    Object.entries(categoryCounts)
      .sort(
        (a, b) =>
          b[1] - a[1]
      )
      .slice(0, 5);

  const maxCategoryCount =
    categoryData.length > 0
      ? Math.max(
          ...categoryData.map(
            (item) => item[1]
          )
        )
      : 1;

  // ==================================================
  // DEPARTMENT DATA
  // ==================================================

  const departmentData =
    categoryData;

  const maxDepartmentCount =
    departmentData.length > 0
      ? Math.max(
          ...departmentData.map(
            (item) => item[1]
          )
        )
      : 1;

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div
        className="admin-loading"
        style={{
          minHeight: "100vh",
          backgroundColor:
            theme.pageBg,
          color: theme.text,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="spinner-border text-success"></div>

        <p className="mt-3">
          {language === "Marathi"
            ? "ॲडमिन डॅशबोर्ड लोड होत आहे..."
            : language === "Hindi"
            ? "एडमिन डैशबोर्ड लोड हो रहा है..."
            : "Loading Admin Dashboard..."}
        </p>
      </div>
    );
  }

  // ==================================================
  // DASHBOARD
  // ==================================================

  return (
    <div
      className="admin-dashboard"
      style={{
        minHeight: "100vh",
        backgroundColor:
          theme.pageBg,
        color: theme.text,
        transition:
          "all 0.25s ease",
      }}
    >

      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className="admin-sidebar"
        style={{
          backgroundColor:
            theme.sidebarBg,
          color: theme.text,
          borderRight:
            `1px solid ${theme.border}`,
        }}
      >

        {/* BRAND */}

        <div
          className="admin-brand"
          style={{
            color: theme.text,
          }}
        >
          <div className="admin-brand-icon">
            🏙️
          </div>

          <div>
            <h4
              style={{
                color: theme.text,
              }}
            >
              CivicPulse AI
            </h4>

            <span
              style={{
                color: theme.mutedText,
              }}
            >
              {t.adminPanel ||
                t.adminPortal ||
                "Admin Panel"}
            </span>
          </div>
        </div>

        {/* MENU */}

        <nav className="admin-menu">

          <button
            type="button"
            className="admin-menu-item active"
            onClick={() =>
              navigate(
                "/admin-dashboard"
              )
            }
            style={{
              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            <span>▦</span>

            {t.dashboard ||
              t.adminDashboard ||
              "Dashboard"}
          </button>

          <button
            type="button"
            className="admin-menu-item"
            onClick={() =>
              navigate(
                "/admin-complaints"
              )
            }
            style={{
              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            <span>▤</span>

            {t.complaints ||
              "Complaints"}
          </button>

          <button
            type="button"
            className="admin-menu-item"
            onClick={() => navigate("/admin-departments")}
            style={{
              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            <span>♟</span>

            {t.departments ||
              "Departments"}
          </button>

          <button
            type="button"
            className="admin-menu-item"
            onClick={() => navigate("/admin-users")}
            style={{
              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            <span>♣</span>

            {t.users ||
              "Users"}
          </button>

          <button
            type="button"
            className="admin-menu-item"
            onClick={() => navigate("/admin-analytics")}
            style={{
              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            <span>▥</span>

            {t.analytics ||
              "Analytics"}
          </button>

          <button
            type="button"
            className="admin-menu-item"
            onClick={() => navigate("/admin-reports")}
            style={{
              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            <span>▣</span>

            {t.reports ||
              "Reports"}
          </button>

          <button
            type="button"
            className="admin-menu-item"
            onClick={() => navigate("/admin-settings")}
            style={{
              color: darkMode
                ? "#ffffff"
                : "#111827",
            }}
          >
            <span>⚙</span>

            {t.settings ||
              "Settings"}
          </button>

        </nav>

        {/* LOGOUT */}

        <button
          type="button"
          className="admin-logout"
          onClick={handleLogout}
          style={{
            color: darkMode
              ? "#ffffff"
              : "#111827",
          }}
        >
          ⇥

          <span>
            {t.logout ||
              "Logout"}
          </span>
        </button>

      </aside>

      {/* ==================================================
          MAIN
      ================================================== */}

      <main
        className="admin-main"
        style={{
          backgroundColor:
            theme.pageBg,
          color: theme.text,
          transition:
            "all 0.25s ease",
        }}
      >

        {/* HEADER */}

        <div
          className="admin-header"
          style={{
            backgroundColor:
              theme.headerBg,
            color: theme.text,
            borderColor:
              theme.border,
          }}
        >
          <div>

            <h1
              style={{
                color: theme.text,
              }}
            >
              {t.dashboard ||
                t.adminDashboard ||
                "Dashboard"}
            </h1>

            <p
              style={{
                color: theme.mutedText,
              }}
            >
              {language === "Marathi"
                ? "स्वागत आहे"
                : language === "Hindi"
                ? "वापसी पर स्वागत है"
                : "Welcome back"}
              ,{" "}
              {user?.name ||
                "Admin"}
            </p>

          </div>

          <div
            className="date-selector"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
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

        {/* ==================================================
            STAT CARDS
        ================================================== */}

        <div className="stats-grid">

          {/* TOTAL */}

          <div
            className="stat-card"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
            <div className="stat-icon green">
              📋
            </div>

            <div>
              <p
                style={{
                  color: theme.mutedText,
                }}
              >
                {t.total ||
                  "Total"}{" "}
                {t.complaints ||
                  "Complaints"}
              </p>

              <h2
                style={{
                  color: theme.text,
                }}
              >
                {total.toLocaleString()}
              </h2>

              <small>
                {language === "Marathi"
                  ? "↑ एकूण नोंदवलेल्या तक्रारी"
                  : language === "Hindi"
                  ? "↑ कुल दर्ज की गई शिकायतें"
                  : "↑ Total registered complaints"}
              </small>
            </div>
          </div>

          {/* IN PROGRESS */}

          <div
            className="stat-card"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
            <div className="stat-icon blue">
              🔄
            </div>

            <div>
              <p
                style={{
                  color: theme.mutedText,
                }}
              >
                {t.inProgress ||
                  "In Progress"}
              </p>

              <h2
                style={{
                  color: theme.text,
                }}
              >
                {inProgress}
              </h2>

              <small>
                {language === "Marathi"
                  ? "↑ सध्या हाताळल्या जात आहेत"
                  : language === "Hindi"
                  ? "↑ वर्तमान में संभाली जा रही हैं"
                  : "↑ Currently being handled"}
              </small>
            </div>
          </div>

          {/* RESOLVED */}

          <div
            className="stat-card"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
            <div className="stat-icon green">
              ✓
            </div>

            <div>
              <p
                style={{
                  color: theme.mutedText,
                }}
              >
                {t.resolved ||
                  "Resolved"}
              </p>

              <h2
                style={{
                  color: theme.text,
                }}
              >
                {resolved}
              </h2>

              <small>
                {language === "Marathi"
                  ? "↑ यशस्वीरित्या सोडवलेल्या"
                  : language === "Hindi"
                  ? "↑ सफलतापूर्वक हल की गई"
                  : "↑ Successfully resolved"}
              </small>
            </div>
          </div>

          {/* PENDING */}

          <div
            className="stat-card"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
            <div className="stat-icon orange">
              ⏳
            </div>

            <div>
              <p
                style={{
                  color: theme.mutedText,
                }}
              >
                {t.pending ||
                  "Pending"}
              </p>

              <h2
                style={{
                  color: theme.text,
                }}
              >
                {pending}
              </h2>

              <small>
                {language === "Marathi"
                  ? "↓ कारवाईची प्रतीक्षा"
                  : language === "Hindi"
                  ? "↓ कार्रवाई की प्रतीक्षा"
                  : "↓ Waiting for action"}
              </small>
            </div>
          </div>

        </div>

        {/* ==================================================
            ANALYTICS
        ================================================== */}

        <div className="analytics-grid">

          {/* OVERVIEW */}

          <div
            className="analytics-card categories-analytics-card"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
            <h3
              style={{
                color: theme.text,
              }}
            >
              {t.complaintsOverview ||
                "Complaints Overview"}
            </h3>

            <div className="overview-chart">

              <div className="y-axis">
                <span>{total}</span>

                <span>
                  {Math.round(
                    total * 0.75
                  )}
                </span>

                <span>
                  {Math.round(
                    total * 0.5
                  )}
                </span>

                <span>
                  {Math.round(
                    total * 0.25
                  )}
                </span>

                <span>0</span>
              </div>

              <div className="chart-area">

                <div className="chart-bars">

                  <div
                    className="chart-bar registered"
                    style={{
                      height:
                        total > 0
                          ? "75%"
                          : "5%",
                    }}
                  ></div>

                  <div
                    className="chart-bar progress"
                    style={{
                      height:
                        total > 0
                          ? `${Math.max(
                              (inProgress /
                                total) *
                                100,
                              5
                            )}%`
                          : "5%",
                    }}
                  ></div>

                  <div
                    className="chart-bar resolved"
                    style={{
                      height:
                        total > 0
                          ? `${Math.max(
                              (resolved /
                                total) *
                                100,
                              5
                            )}%`
                          : "5%",
                    }}
                  ></div>

                </div>

                <div className="chart-labels">

                  <span>
                    {language === "Marathi"
                      ? "नोंदवलेल्या"
                      : language === "Hindi"
                      ? "पंजीकृत"
                      : "Registered"}
                  </span>

                  <span>
                    {t.inProgress ||
                      "In Progress"}
                  </span>

                  <span>
                    {t.resolved ||
                      "Resolved"}
                  </span>

                </div>

              </div>

            </div>

            <div className="chart-legend">

              <span>
                <i className="legend-green"></i>

                {language === "Marathi"
                  ? "नोंदवलेल्या"
                  : language === "Hindi"
                  ? "पंजीकृत"
                  : "Registered"}
              </span>

              <span>
                <i className="legend-blue"></i>

                {t.resolved ||
                  "Resolved"}
              </span>

            </div>
          </div>

          {/* CATEGORIES */}

          <div
            className="analytics-card"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
            <h3
              style={{
                color: theme.text,
              }}
            >
              {t.topComplaintCategories ||
                "Top Complaint Categories"}
            </h3>

            {categoryData.length === 0 ? (

              <div
                className="empty-data"
                style={{
                  color: theme.mutedText,
                }}
              >
                {language === "Marathi"
                  ? "तक्रारींचा डेटा उपलब्ध नाही"
                  : language === "Hindi"
                  ? "शिकायत डेटा उपलब्ध नहीं है"
                  : "No complaint data available"}
              </div>

            ) : (

              <div className="category-list">

                {categoryData.map(
                  (
                    [category, count],
                    index
                  ) => {

                    const percentage =
                      total > 0
                        ? Math.round(
                            (count /
                              total) *
                              100
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

                          <span
                            style={{
                              color:
                                theme.text,
                            }}
                          >
                            {category}
                          </span>

                        </div>

                        <div className="category-value">

                          <div className="category-progress">

                            <div
                              style={{
                                width:
                                  `${
                                    (
                                      count /
                                      maxCategoryCount
                                    ) *
                                    100
                                  }%`,
                              }}
                            ></div>

                          </div>

                          <strong
                            style={{
                              color:
                                theme.text,
                            }}
                          >
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

          <div
            className="analytics-card"
            style={{
              backgroundColor:
                theme.cardBg,
              color: theme.text,
              border:
                `1px solid ${theme.border}`,
            }}
          >
            <h3
              style={{
                color: theme.text,
              }}
            >
              {t.complaintsByDepartment ||
                "Complaints by Department"}
            </h3>

            {departmentData.length === 0 ? (

              <div
                className="empty-data"
                style={{
                  color:
                    theme.mutedText,
                }}
              >
                {language === "Marathi"
                  ? "तक्रारींचा डेटा उपलब्ध नाही"
                  : language === "Hindi"
                  ? "शिकायत डेटा उपलब्ध नहीं है"
                  : "No complaint data available"}
              </div>

            ) : (

              <div className="department-chart">

                {departmentData.map(
                  (
                    [department, count],
                    index
                  ) => {

                    const height =
                      Math.max(
                        (
                          count /
                          maxDepartmentCount
                        ) *
                          100,
                        8
                      );

                    return (
                      <div
                        className="department-column"
                        key={department}
                      >

                        <div
                          className="department-value"
                          style={{
                            color:
                              theme.text,
                          }}
                        >
                          {count}
                        </div>

                        <div className="bar-wrapper">

                          <div
                            className={`department-bar bar-${index}`}
                            style={{
                              height:
                                `${height}%`,
                            }}
                          ></div>

                        </div>

                        <span
                          style={{
                            color:
                              theme.mutedText,
                          }}
                        >
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

        {/* ==================================================
            RECENT COMPLAINTS
        ================================================== */}

        <div
          className="recent-card"
          style={{
            backgroundColor:
              theme.cardBg,
            color: theme.text,
            border:
              `1px solid ${theme.border}`,
          }}
        >

          <div className="recent-header">

            <h3
              style={{
                color: theme.text,
              }}
            >
              {t.recentActivity ||
                "Recent Complaints"}
            </h3>

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/admin-complaints"
                )
              }
            >
              {t.viewAllComplaints ||
                "View All"}
            </button>

          </div>

          <div className="recent-table">

            {complaints.length === 0 ? (

              <div
                className="empty-data"
                style={{
                  color:
                    theme.mutedText,
                }}
              >
                {language === "Marathi"
                  ? "तक्रारी उपलब्ध नाहीत."
                  : language === "Hindi"
                  ? "कोई शिकायत उपलब्ध नहीं है।"
                  : "No complaints available."}
              </div>

            ) : (

              complaints
                .slice(0, 5)
                .map(
                  (complaint) => {

                    const status =
                      complaint.status ||
                      "Pending";

                    const statusClass =
                      status
                        .toLowerCase()
                        .replace(
                          /\s+/g,
                          "-"
                        );

                    return (
                      <div
                        className="recent-row"
                        key={complaint.id}
                      >

                        <span
                          style={{
                            color:
                              theme.mutedText,
                          }}
                        >
                          #{complaint.id}
                        </span>

                        <strong
                          style={{
                            color:
                              theme.text,
                          }}
                        >
                          {complaint.category ||
                            "Others"}
                        </strong>

                        <span
                          style={{
                            color:
                              theme.mutedText,
                          }}
                        >
                          {complaint.location ||
                            (
                              language ===
                              "Marathi"
                                ? "स्थान उपलब्ध नाही"
                                : language ===
                                  "Hindi"
                                ? "स्थान उपलब्ध नहीं"
                                : "Location not available"
                            )}
                        </span>

                        <span
                          className={`status-badge ${statusClass}`}
                        >
                          {status}
                        </span>

                      </div>
                    );
                  }
                )

            )}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AdminDashboard;