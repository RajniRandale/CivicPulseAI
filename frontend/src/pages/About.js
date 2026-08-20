import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

import translations from "../components/translations";
import { useAppSettings } from "../components/TopUtilityBar";

function About() {
  // ==================================================
  // LANGUAGE
  // ==================================================

  const { language } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  return (
    <div className="about-page">

      {/* ================= NAVBAR ================= */}

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">

        <div className="container">

          {/* LOGO */}

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
                {t.smartCitySolutions}
              </small>

            </div>

          </Link>


          {/* MOBILE MENU */}

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#aboutNavbar"
            aria-controls="aboutNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>


          {/* NAVIGATION */}

          <div
            className="collapse navbar-collapse"
            id="aboutNavbar"
          >

            <ul className="navbar-nav ms-auto align-items-lg-center">

              {/* HOME */}

              <li className="nav-item">

                <Link
                  className="nav-link"
                  to="/"
                >
                  {t.home}
                </Link>

              </li>


              {/* ABOUT */}

              <li className="nav-item">

                <Link
                  className="nav-link active"
                  to="/about"
                >
                  {t.about}
                </Link>

              </li>


              {/* CONTACT */}

              <li className="nav-item">

                <Link
                  className="nav-link"
                  to="/#contact"
                >
                  {t.contact}
                </Link>

              </li>


              {/* LOGIN */}

              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">

                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm login-btn"
                >
                  {t.login}
                </Link>

              </li>


              {/* REGISTER */}

              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">

                <Link
                  to="/register"
                  className="btn btn-success btn-sm register-btn"
                >
                  {t.register}
                </Link>

              </li>

            </ul>

          </div>

        </div>

      </nav>


      {/* ================= ABOUT CONTENT ================= */}

      <section className="about-main">

        <div className="container">

          {/* HEADER */}

          <div className="about-header text-center">

            <h1>
              {t.aboutTitle}
            </h1>

            <p>
              {t.aboutSubtitle}
            </p>

          </div>


          {/* ================= ABOUT CIVICPULSE ================= */}

          <div className="about-card">

            <h2>
              {t.whatIsCivicPulse}
            </h2>

            <p>
              {t.aboutDescription1}
            </p>

            <p>
              {t.aboutDescription2}
            </p>

          </div>


          {/* ================= HOW IT WORKS ================= */}

          <div className="about-card">

            <h2>
              {t.howItWorks}
            </h2>

            <div className="about-features">


              {/* REPORT */}

              <div className="about-feature">

                <div className="about-feature-icon">
                  1
                </div>

                <h4>
                  {t.report}
                </h4>

                <p>
                  {t.reportDescription}
                </p>

              </div>


              {/* ANALYZE */}

              <div className="about-feature">

                <div className="about-feature-icon">
                  2
                </div>

                <h4>
                  {t.analyze}
                </h4>

                <p>
                  {t.analyzeDescription}
                </p>

              </div>


              {/* RESOLVE */}

              <div className="about-feature">

                <div className="about-feature-icon">
                  3
                </div>

                <h4>
                  {t.resolve}
                </h4>

                <p>
                  {t.resolveDescription}
                </p>

              </div>

            </div>

          </div>


          {/* ================= OUR GOAL ================= */}

          <div className="about-card goal-card">

            <h2>
              {t.ourGoal}
            </h2>

            <p>
              {t.goalDescription}
            </p>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="container text-center">

          <h5>
            CivicPulseAI
          </h5>

          <p>
            {t.smartCitySolutions}
          </p>

          <small>
            © 2026 CivicPulseAI. All rights reserved.
          </small>

        </div>

      </footer>

    </div>
  );
}

export default About;