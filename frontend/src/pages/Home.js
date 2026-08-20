import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import heroBg from "../assets/hero-bg.jpg";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import "./Home.css";

function Home() {
  const navigate = useNavigate();

  const {
    darkMode,
    language,
  } = useAppSettings();

  const isHindi =
    language === "Hindi";

  const isMarathi =
    language === "Marathi";

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const handleReportIssue = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const token =
      localStorage.getItem("token");

    const user =
      localStorage.getItem("user");

    if (!token || !user) {
      setShowLoginPopup(true);
      return;
    }

    navigate("/report-complaint");
  };

  const handlePopupOK = () => {
    setShowLoginPopup(false);
    navigate("/login");
  };

  return (
    <div
      className={`home-page ${
        darkMode
          ? "dark-theme"
          : ""
      }`}
    >

      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">

        <div className="container">

          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
          >

            <div className="brand-icon">

              <img
                src="/civicpulse-logo.png"
                alt="CivicPulse AI Logo"
              />

            </div>

            <div className="brand-text">

              <strong>
                CivicPulse AI
              </strong>

              <small>
                {isMarathi
                  ? "स्मार्ट शहर. स्मार्ट उपाय."
                  : isHindi
                  ? "स्मार्ट शहर. स्मार्ट समाधान."
                  : "Smart City. Smart Solutions."}
              </small>

            </div>

          </Link>


          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>


          <div
            className="collapse navbar-collapse"
            id="mainNavbar"
          >

            <ul className="navbar-nav ms-auto align-items-lg-center">

              <li className="nav-item">

                <Link
                  className="nav-link active"
                  to="/"
                >
                  {isMarathi
                    ? "मुख्यपृष्ठ"
                    : isHindi
                    ? "होम"
                    : "Home"}
                </Link>

              </li>


              <li className="nav-item">

                <Link
                  className="nav-link"
                  to="/about"
                >
                  {isMarathi
                    ? "आमच्याबद्दल"
                    : isHindi
                    ? "हमारे बारे में"
                    : "About"}
                </Link>

              </li>


              <li className="nav-item">

                <Link
                  className="nav-link"
                  to="/contact"
                >
                  {isMarathi
                    ? "संपर्क"
                    : isHindi
                    ? "संपर्क"
                    : "Contact"}
                </Link>

              </li>


              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">

                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm login-btn"
                >
                  {isMarathi
                    ? "लॉगिन"
                    : isHindi
                    ? "लॉगिन"
                    : "Login"}
                </Link>

              </li>


              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">

                <Link
                  to="/register"
                  className="btn btn-success btn-sm register-btn"
                >
                  {isMarathi
                    ? "नोंदणी"
                    : isHindi
                    ? "पंजीकरण"
                    : "Register"}
                </Link>

              </li>

            </ul>

          </div>

        </div>

      </nav>


      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">

        {/* YOUR UPLOADED CITY IMAGE */}

        <div
          className="hero-background"
          style={{
            backgroundImage: `url(${heroBg})`,
          }}
        ></div>


        {/* OVERLAY */}

        <div className="hero-overlay"></div>


        {/* HERO CONTENT */}

        <div className="container hero-container">

          <div className="row align-items-center w-100">

            <div className="col-lg-8 hero-content">

              <h1>

                {isMarathi ? (
                  <>
                    चांगल्या शहरासाठी
                    <br />
                    <span>एकत्र</span>
                  </>
                ) : isHindi ? (
                  <>
                    बेहतर शहर के लिए
                    <br />
                    <span>साथ मिलकर</span>
                  </>
                ) : (
                  <>
                    Together for a
                    <br />
                    <span>Better City</span>
                  </>
                )}

              </h1>


              <p>

                {isMarathi
                  ? "नागरी समस्या नोंदवा, प्रगतीचा मागोवा घ्या आणि स्वच्छ, सुरक्षित व स्मार्ट शहर उभारण्यास मदत करा."
                  : isHindi
                  ? "नागरिक समस्याओं की रिपोर्ट करें, प्रगति को ट्रैक करें और एक स्वच्छ, सुरक्षित और स्मार्ट शहर बनाने में मदद करें।"
                  : "Report civic issues, track progress, and help us build a cleaner, safer and smarter city."}

              </p>


              <div className="hero-buttons">

                <button
                  type="button"
                  className="btn report-btn"
                  onClick={handleReportIssue}
                >

                  {isMarathi
                    ? "समस्या नोंदवा"
                    : isHindi
                    ? "समस्या दर्ज करें"
                    : "Report an Issue"}

                </button>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= FEATURES ================= */}

      <section
        className="features-section"
        id="services"
      >

        <div className="container">

          <div className="row g-3">


            <div className="col-md-6 col-lg-4">

              <div className="feature-card">

                <div className="feature-icon report-icon">
                  ⊙
                </div>

                <h5>
                  {isMarathi
                    ? "नोंदवा"
                    : isHindi
                    ? "रिपोर्ट करें"
                    : "Report"}
                </h5>

                <p>
                  {isMarathi
                    ? "तुमच्या परिसरातील नागरी समस्या सहज नोंदवा."
                    : isHindi
                    ? "अपने क्षेत्र की नागरिक समस्याओं की आसानी से रिपोर्ट करें."
                    : "Easily report civic issues in your locality."}
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-4">

              <div className="feature-card">

                <div className="feature-icon notify-icon">
                  🔔
                </div>

                <h5>
                  {isMarathi
                    ? "सूचना मिळवा"
                    : isHindi
                    ? "सूचना प्राप्त करें"
                    : "Get Notified"}
                </h5>

                <p>
                  {isMarathi
                    ? "तुमच्या तक्रारींबद्दल अपडेट्स आणि सूचना मिळवा."
                    : isHindi
                    ? "अपनी शिकायतों के बारे में अपडेट और सूचनाएं प्राप्त करें."
                    : "Receive updates and notifications about your complaints."}
                </p>

              </div>

            </div>


            <div className="col-md-6 col-lg-4">

              <div className="feature-card">

                <div className="feature-icon impact-icon">
                  ✨
                </div>

                <h5>
                  {isMarathi
                    ? "परिणाम घडवा"
                    : isHindi
                    ? "बदलाव लाएं"
                    : "Make Impact"}
                </h5>

                <p>
                  {isMarathi
                    ? "एकत्रितपणे स्वच्छ आणि चांगले शहर घडवूया."
                    : isHindi
                    ? "आइए मिलकर एक स्वच्छ और बेहतर शहर बनाएं."
                    : "Together, let's build a cleaner and better city."}
                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= CONTACT ================= */}

      <section
        className="contact-section"
        id="contact"
      >

        <div className="container text-center">

          <h2>

            {isMarathi
              ? "नागरी समस्या आहे?"
              : isHindi
              ? "क्या कोई नागरिक समस्या है?"
              : "Have a Civic Issue?"}

          </h2>


          <p>

            {isMarathi
              ? "समस्या नोंदवा आणि तुमचे शहर अधिक चांगले बनवण्यास मदत करा."
              : isHindi
              ? "समस्या दर्ज करें और अपने शहर को बेहतर बनाने में मदद करें."
              : "Report it and help make your city better."}

          </p>


          <button
            type="button"
            className="btn report-btn"
            onClick={handleReportIssue}
          >

            {isMarathi
              ? "समस्या नोंदवा"
              : isHindi
              ? "समस्या दर्ज करें"
              : "Report an Issue"}

          </button>

        </div>

      </section>


      {/* ================= LOGIN POPUP ================= */}

      {showLoginPopup && (

        <div
          className="login-popup-overlay"
          onClick={() =>
            setShowLoginPopup(false)
          }
        >

          <div
            className="login-popup"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="login-popup-icon">
              🔒
            </div>


            <h4>

              {isMarathi
                ? "लॉगिन आवश्यक"
                : isHindi
                ? "लॉगिन आवश्यक है"
                : "Login Required"}

            </h4>


            <p>

              {isMarathi
                ? "तक्रार नोंदवण्यासाठी कृपया आधी लॉगिन करा."
                : isHindi
                ? "शिकायत दर्ज करने के लिए कृपया पहले लॉगिन करें."
                : "Please login first to report an issue."}

            </p>


            <div className="d-flex gap-2 justify-content-center">

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() =>
                  setShowLoginPopup(false)
                }
              >
                {isMarathi
                  ? "रद्द करा"
                  : isHindi
                  ? "रद्द करें"
                  : "Cancel"}
              </button>


              <button
                type="button"
                className="login-popup-button"
                onClick={handlePopupOK}
              >
                {isMarathi
                  ? "लॉगिन"
                  : isHindi
                  ? "लॉगिन"
                  : "Login"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Home;