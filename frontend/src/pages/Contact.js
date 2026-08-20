import React from "react";
import { Link } from "react-router-dom";
import "./Contact.css";

import translations from "../components/translations";
import { useAppSettings } from "../components/TopUtilityBar";

function Contact() {
  // ==================================================
  // LANGUAGE
  // ==================================================

  const { language } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  return (
    <div className="contact-page">

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
            data-bs-target="#contactNavbar"
            aria-controls="contactNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >

            <span className="navbar-toggler-icon"></span>

          </button>


          {/* NAVIGATION */}

          <div
            className="collapse navbar-collapse"
            id="contactNavbar"
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
                  className="nav-link"
                  to="/about"
                >
                  {t.about}
                </Link>

              </li>


              {/* CONTACT */}

              <li className="nav-item">

                <Link
                  className="nav-link active"
                  to="/contact"
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


      {/* ================= CONTACT CONTENT ================= */}

      <section className="contact-main">

        <div className="container">

          {/* HEADER */}

          <div className="contact-header text-center">

            <h1>
              {t.contactUs}
            </h1>

            <p>
              {t.contactSubtitle}
            </p>

          </div>


          {/* ================= CONTACT CARD ================= */}

          <div className="contact-card">

            <h2>
              {t.getInTouch}
            </h2>


            {/* EMAIL */}

            <div className="contact-item">

              <div className="contact-icon">
                ✉
              </div>

              <div>

                <h5>
                  {t.emailLabel}
                </h5>

                <p>
                  support@civicpulseai.com
                </p>

              </div>

            </div>


            {/* PHONE */}

            <div className="contact-item">

              <div className="contact-icon">
                ☎
              </div>

              <div>

                <h5>
                  {t.phone}
                </h5>

                <p>
                  +91 7028076858
                </p>

              </div>

            </div>


            {/* LOCATION */}

            <div className="contact-item">

              <div className="contact-icon">
                📍
              </div>

              <div>

                <h5>
                  {t.locationLabel}
                </h5>

                <p>
                  Thane, Maharashtra, India
                </p>

              </div>

            </div>

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

export default Contact;