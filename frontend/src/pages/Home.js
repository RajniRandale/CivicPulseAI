import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-page">

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
              <strong>CivicPulse AI</strong>
              <small>Smart City. Smart Solutions.</small>
            </div>
          </Link>


          {/* MOBILE MENU */}

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


          {/* NAVIGATION */}

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
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/about"
                >
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link
                  className="nav-link"
                  to="/contact"
                >
                  Contact
                </Link>
              </li>

              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <Link
                  to="/login"
                  className="btn btn-outline-primary btn-sm login-btn"
                >
                  Login
                </Link>
              </li>

              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <Link
                  to="/register"
                  className="btn btn-success btn-sm register-btn"
                >
                  Register
                </Link>
              </li>

            </ul>
          </div>

        </div>
      </nav>


      {/* ================= HERO SECTION ================= */}

      <section className="hero-section">

        {/* BLURRED BACKGROUND IMAGE */}

        <div
          className="hero-background"
          style={{
            backgroundImage: 'url("/city-image.png.webp")'
          }}
        ></div>


        {/* OVERLAY */}

        <div className="hero-overlay"></div>


        {/* HERO CONTENT */}

        <div className="container hero-container">

          <div className="row align-items-center w-100">

            <div className="col-lg-7 hero-content">

              <h1>
                Together for a
                <br />
                <span>Better City</span>
              </h1>

              <p>
                Report civic issues, track progress, and help
                us build a cleaner, safer and smarter city.
              </p>

              <div className="hero-buttons">

                <Link
                  to="/report-complaint"
                  className="btn report-btn"
                >
                  Report an Issue
                </Link>

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

            {/* REPORT */}

            <div className="col-md-6 col-lg-4">

              <div className="feature-card">

                <div className="feature-icon report-icon">
                  ⊙
                </div>

                <h5>Report</h5>

                <p>
                  Easily report civic issues in your locality.
                </p>

              </div>

            </div>


            {/* NOTIFICATIONS */}

            <div className="col-md-6 col-lg-4">

              <div className="feature-card">

                <div className="feature-icon notify-icon">
                  🔔
                </div>

                <h5>Get Notified</h5>

                <p>
                  Receive updates and notifications about your
                  complaints.
                </p>

              </div>

            </div>


            {/* IMPACT */}

            <div className="col-md-6 col-lg-4">

              <div className="feature-card">

                <div className="feature-icon impact-icon">
                  ✨
                </div>

                <h5>Make Impact</h5>

                <p>
                  Together, let's build a cleaner and better city.
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
            Have a Civic Issue?
          </h2>

          <p>
            Report it and help make your city better.
          </p>

          <Link
            to="/report-complaint"
            className="btn report-btn"
          >
            Report an Issue
          </Link>

        </div>

      </section>


     
    </div>
  );
}

export default Home;