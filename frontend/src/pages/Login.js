import React from "react";
import { Link } from "react-router-dom";

import {
  FaUser,
  FaUserTie,
  FaUserShield,
  FaSignInAlt,
} from "react-icons/fa";

import translations from "../components/translations";
import { useAppSettings } from "../components/TopUtilityBar";

import "./Login.css";

function Login() {
  const {
    language,
    darkMode,
  } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  return (
    <div
      className={`login-page ${
        darkMode ? "login-dark" : ""
      }`}
    >

      {/* ================= MAIN ================= */}

      <div className="login-wrapper">

        {/* LEFT SIDE */}

        <div className="login-intro">

          <div className="login-brand">

            <div className="login-logo">
              <img
                src="/civicpulse-logo.png"
                alt="CivicPulse AI"
              />
            </div>

            <div>
              <h2>
                CivicPulse AI
              </h2>

              <p>
                {language === "Marathi"
                  ? "स्मार्ट शहर. स्मार्ट उपाय."
                  : language === "Hindi"
                  ? "स्मार्ट शहर. स्मार्ट समाधान."
                  : "Smart City. Smart Solutions."}
              </p>
            </div>

          </div>


          <div className="login-intro-content">

            <span className="login-badge">
              CIVICPULSE AI
            </span>

            <h1>

              {language === "Marathi"
                ? "तुमच्या पोर्टलमध्ये प्रवेश करा"
                : language === "Hindi"
                ? "अपने पोर्टल में प्रवेश करें"
                : "Access Your Portal"}

            </h1>

            <p>

              {language === "Marathi"
                ? "नागरिक, अधिकारी किंवा ॲडमिन म्हणून तुमच्या संबंधित पोर्टलमध्ये सुरक्षितपणे लॉगिन करा."
                : language === "Hindi"
                ? "नागरिक, अधिकारी या एडमिन के रूप में अपने संबंधित पोर्टल में सुरक्षित रूप से लॉगिन करें।"
                : "Securely access your respective portal as a citizen, officer, or administrator."}

            </p>

          </div>

        </div>


        {/* RIGHT SIDE */}

        <div className="login-selection">

          <div className="login-selection-header">

            <div className="login-main-icon">
              <FaSignInAlt />
            </div>

            <h2>
              {t.login}
            </h2>

            <p>
              {t.chooseLoginType}
            </p>

          </div>


          {/* LOGIN OPTIONS */}

          <div className="login-options">

            {/* CITIZEN */}

            <Link
              to="/citizen-login"
              className="login-option citizen-option"
            >

              <div className="option-icon">
                <FaUser />
              </div>

              <div className="option-content">

                <h4>
                  {t.citizenLogin}
                </h4>

                <p>

                  {language === "Marathi"
                    ? "नागरी समस्या नोंदवा आणि तक्रारींचा मागोवा घ्या."
                    : language === "Hindi"
                    ? "नागरिक समस्याओं की रिपोर्ट करें और शिकायतों को ट्रैक करें।"
                    : "Report civic issues and track your complaints."}

                </p>

              </div>

              <div className="option-arrow">
                →
              </div>

            </Link>


            {/* OFFICER */}

            <Link
              to="/officer-login"
              className="login-option officer-option"
            >

              <div className="option-icon">
                <FaUserTie />
              </div>

              <div className="option-content">

                <h4>
                  {t.officerLogin}
                </h4>

                <p>

                  {language === "Marathi"
                    ? "असाइन केलेल्या तक्रारी व्यवस्थापित करा आणि अपडेट करा."
                    : language === "Hindi"
                    ? "सौंपी गई शिकायतों को प्रबंधित और अपडेट करें।"
                    : "Manage and update assigned civic complaints."}

                </p>

              </div>

              <div className="option-arrow">
                →
              </div>

            </Link>


            {/* ADMIN */}

            <Link
              to="/admin-login"
              className="login-option admin-option"
            >

              <div className="option-icon">
                <FaUserShield />
              </div>

              <div className="option-content">

                <h4>
                  {t.adminLogin}
                </h4>

                <p>

                  {language === "Marathi"
                    ? "तक्रारी, वापरकर्ते आणि नागरी सेवा व्यवस्थापित करा."
                    : language === "Hindi"
                    ? "शिकायतों, उपयोगकर्ताओं और नागरिक सेवाओं का प्रबंधन करें।"
                    : "Manage complaints, users, and civic services."}

                </p>

              </div>

              <div className="option-arrow">
                →
              </div>

            </Link>

          </div>


          {/* REGISTER */}

          <div className="login-register">

            <span>
              {t.noAccount}
            </span>

            <Link to="/register">
              {t.register}
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;