import React from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";

import {
  useAppSettings,
} from "./TopUtilityBar";

import "./MainNavbar.css";

function MainNavbar() {
  const location = useLocation();

  const { language } =
    useAppSettings();

  const isHindi =
    language === "Hindi";

  const isMarathi =
    language === "Marathi";

  const isActive = (path) =>
    location.pathname === path;

  return (
    <nav className="main-navbar navbar navbar-expand-lg navbar-light bg-white shadow-sm">

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
              {isMarathi
                ? "स्मार्ट शहर. स्मार्ट उपाय."
                : isHindi
                ? "स्मार्ट शहर. स्मार्ट समाधान."
                : "Smart City. Smart Solutions."}
            </small>

          </div>

        </Link>


        {/* MOBILE BUTTON */}

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>


        {/* NAVIGATION */}

        <div
          className="collapse navbar-collapse"
          id="mainNavbar"
        >

          <ul className="navbar-nav ms-auto align-items-lg-center">

            {/* HOME */}

            <li className="nav-item">

              <Link
                className={
                  `nav-link ${
                    isActive("/")
                      ? "active"
                      : ""
                  }`
                }
                to="/"
              >
                {isMarathi
                  ? "मुख्यपृष्ठ"
                  : isHindi
                  ? "होम"
                  : "Home"}
              </Link>

            </li>


            {/* HOW IT WORKS */}

            <li className="nav-item">

              <Link
                className={
                  `nav-link ${
                    isActive("/how-it-works")
                      ? "active"
                      : ""
                  }`
                }
                to="/how-it-works"
              >
                {isMarathi
                  ? "हे कसे कार्य करते"
                  : isHindi
                  ? "यह कैसे काम करता है"
                  : "How It Works"}
              </Link>

            </li>


            {/* DAILY NEWS */}

            <li className="nav-item">

              <Link
                className={
                  `nav-link ${
                    isActive("/daily-news")
                      ? "active"
                      : ""
                  }`
                }
                to="/daily-news"
              >
                {isMarathi
                  ? "दैनिक बातम्या"
                  : isHindi
                  ? "दैनिक समाचार"
                  : "Daily News"}
              </Link>

            </li>


            {/* ABOUT */}

            <li className="nav-item">

              <Link
                className={
                  `nav-link ${
                    isActive("/about")
                      ? "active"
                      : ""
                  }`
                }
                to="/about"
              >
                {isMarathi
                  ? "आमच्याबद्दल"
                  : isHindi
                  ? "हमारे बारे में"
                  : "About"}
              </Link>

            </li>


            {/* CONTACT */}

            <li className="nav-item">

              <Link
                className={
                  `nav-link ${
                    isActive("/contact")
                      ? "active"
                      : ""
                  }`
                }
                to="/contact"
              >
                {isMarathi
                  ? "संपर्क"
                  : isHindi
                  ? "संपर्क"
                  : "Contact"}
              </Link>

            </li>


            {/* LOGIN */}

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


            {/* REGISTER */}

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
  );
}

export default MainNavbar;