import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

function About() {
  return (
    <div className="about-page">

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

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#aboutNavbar"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="aboutNavbar"
          >
            <ul className="navbar-nav ms-auto align-items-lg-center">

              <li className="nav-item">
                <Link className="nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link active" to="/about">
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link" to="/#contact">
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


      {/* ================= ABOUT CONTENT ================= */}

      <section className="about-main">

        <div className="container">

          <div className="about-header text-center">
            <h1>About CivicPulse AI</h1>

            <p>
              Building a smarter, cleaner and safer city
              through technology and citizen participation.
            </p>
          </div>


          {/* ABOUT CIVICPULSE */}

          <div className="about-card">

            <h2>What is CivicPulse AI?</h2>

            <p>
              CivicPulse AI is a smart public grievance management
              platform designed to connect citizens with local
              authorities. It makes reporting civic problems easier,
              faster and more transparent.
            </p>

            <p>
              Citizens can report problems such as garbage,
              damaged roads, streetlight issues, water problems
              and other civic concerns. The platform helps
              authorities manage, prioritize and resolve these
              complaints efficiently.
            </p>

          </div>


          {/* HOW IT WORKS */}

          <div className="about-card">

            <h2>How It Works</h2>

            <div className="about-features">

              <div className="about-feature">
                <div className="about-feature-icon">
                  1
                </div>

                <h4>Report</h4>

                <p>
                  Citizens submit a complaint with relevant
                  details and location.
                </p>
              </div>


              <div className="about-feature">
                <div className="about-feature-icon">
                  2
                </div>

                <h4>Analyze</h4>

                <p>
                  AI helps classify and prioritize civic
                  complaints.
                </p>
              </div>


              <div className="about-feature">
                <div className="about-feature-icon">
                  3
                </div>

                <h4>Resolve</h4>

                <p>
                  Authorities work on the complaint and
                  update its progress.
                </p>
              </div>

            </div>

          </div>


          {/* OUR GOAL */}

          <div className="about-card goal-card">

            <h2>Our Goal</h2>

            <p>
              Our goal is to create a transparent and
              technology-driven civic management system where
              citizens can actively participate in improving
              their city.
            </p>

          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div className="container text-center">

          <h5>CivicPulseAI</h5>

          <p>
            Smart City. Smart Solutions.
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