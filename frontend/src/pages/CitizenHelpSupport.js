import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaClipboardList, FaEnvelope, FaPhone, FaQuestionCircle } from "react-icons/fa";
import { useAppSettings } from "../components/TopUtilityBar";
import "./CitizenHelpSupport.css";

function CitizenHelpSupport() {
  const navigate = useNavigate();
  const { darkMode } = useAppSettings();

  return (
    <div className={`citizen-help-page${darkMode ? " dark" : ""}`}>
      <main className="citizen-help-container">
        <button type="button" className="citizen-help-back" onClick={() => navigate("/citizen-dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>

        <header className="citizen-help-header">
          <div><FaQuestionCircle /></div>
          <section><span>CIVICPULSE AI</span><h1>Help & Support</h1><p>Find answers and get help with your citizen portal.</p></section>
        </header>

        <section className="citizen-help-grid">
          <article className="citizen-help-card">
            <FaClipboardList />
            <h2>How do I report a complaint?</h2>
            <p>Open Report Complaint, select a category, enter the details and location, then submit the complaint.</p>
          </article>
          <article className="citizen-help-card">
            <FaQuestionCircle />
            <h2>How can I track my complaint?</h2>
            <p>Open Track Complaint from your dashboard to view the complaint status and submitted details.</p>
          </article>
          <article className="citizen-help-card">
            <FaEnvelope />
            <h2>Need more assistance?</h2>
            <p>Contact the CivicPulse support team for help with your account or complaint.</p>
            <a href="mailto:support@civicpulse.ai">support@civicpulse.ai</a>
          </article>
          <article className="citizen-help-card">
            <FaPhone />
            <h2>Call Support</h2>
            <p>Speak with the CivicPulse support team for direct assistance.</p>
            <a href="tel:+917028076858">+91 7028076858</a>
          </article>
        </section>
      </main>
    </div>
  );
}

export default CitizenHelpSupport;
