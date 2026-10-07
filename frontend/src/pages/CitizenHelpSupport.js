import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaClipboardList,
  FaEnvelope,
  FaHome,
  FaPhone,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";
import { useAppSettings } from "../components/TopUtilityBar";
import translations from "../components/translations";
import "./CitizenHelpSupport.css";

function CitizenHelpSupport() {
  const navigate = useNavigate();
  const { darkMode, language } = useAppSettings();
  const t = translations[language] || translations.English;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/citizen-login");
  };

  return (
    <div
      className={`citizen-help-page${darkMode ? " dark" : ""}`}
      style={{
        display: "flex",
        minHeight: "calc(100vh - 26px)",
        padding: 0,
        margin: 0,
        width: "100%",
      }}
    >
      {/* ================================
          LEFT SIDEBAR
      ================================= */}
      <aside
        style={{
          width: "220px",
          minWidth: "220px",
          backgroundColor: "#212529",
          minHeight: "calc(100vh - 26px)",
          padding: "20px 14px",
          position: "relative",
          flexShrink: 0,
        }}
      >
        {/* Logo / Portal Name */}
        <div className="text-center mb-4">
          <FaHome
            size={38}
            color="#198754"
            className="mb-2"
          />

          <h4
            className="text-white mb-0"
            style={{ fontWeight: "600" }}
          >
            CivicPulse AI
          </h4>

          <small style={{ color: "#adb5bd" }}>
            {t.citizenPortal || "Citizen Portal"}
          </small>
        </div>

        {/* Sidebar Navigation */}
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

          {/* Profile */}
          <Link
            to="/citizen-profile"
            className="btn btn-dark text-start text-white"
          >
            <FaUserCircle className="me-2" />
            {t.profile || "Profile"}
          </Link>

          {/* Help & Support - ACTIVE */}
          <button
            type="button"
            className="btn btn-success text-start"
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
              left: "14px",
              right: "14px",
              bottom: "20px",
            }}
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            {t.logout || "Logout"}
          </button>
        </nav>
      </aside>

      {/* ================================
          MAIN HELP & SUPPORT CONTENT
      ================================= */}
      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "auto",
        }}
      >
        <div
          className="citizen-help-container"
          style={{
            width: "100%",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "40px 30px",
          }}
        >
          {/* Back Button */}
          <button
            type="button"
            className="citizen-help-back"
            onClick={() => navigate("/citizen-dashboard")}
          >
            <FaArrowLeft />
            <span>Back to Dashboard</span>
          </button>

          {/* Header */}
          <header className="citizen-help-header">
            <div>
              <FaQuestionCircle />
            </div>

            <section>
              <span>CIVICPULSE AI</span>
              <h1>Help & Support</h1>
              <p>
                Find answers and get help with your citizen portal.
              </p>
            </section>
          </header>

          {/* Help Cards */}
          <section className="citizen-help-grid">

            {/* Card 1 */}
            <article className="citizen-help-card">
              <FaClipboardList />

              <h2>
                How do I report a complaint?
              </h2>

              <p>
                Open Report Complaint, select a category,
                enter the details and location, then submit
                the complaint.
              </p>
            </article>

            {/* Card 2 */}
            <article className="citizen-help-card">
              <FaQuestionCircle />

              <h2>
                How can I track my complaint?
              </h2>

              <p>
                Open Track Complaint from your dashboard to
                view the complaint status and submitted
                details.
              </p>
            </article>

            {/* Card 3 */}
            <article className="citizen-help-card">
              <FaEnvelope />

              <h2>
                Need more assistance?
              </h2>

              <p>
                Contact the CivicPulse support team for help
                with your account or complaint.
              </p>

              <a href="mailto:support@civicpulse.ai">
                support@civicpulse.ai
              </a>
            </article>

            {/* Card 4 */}
            <article className="citizen-help-card">
              <FaPhone />

              <h2>
                Call Support
              </h2>

              <p>
                Speak with the CivicPulse support team for
                direct assistance.
              </p>

              <a href="tel:+917028076858">
                +91 7028076858
              </a>
            </article>

          </section>
        </div>
      </main>
    </div>
  );
}

export default CitizenHelpSupport;