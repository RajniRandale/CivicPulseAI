import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaClipboardCheck,
  FaBell,
  FaCheckCircle,
  FaLock,
} from "react-icons/fa";

import { useAppSettings } from "../components/TopUtilityBar";

import "./HowItWorks.css";

function HowItWorks() {
  const navigate = useNavigate();

  const { language, darkMode } = useAppSettings();

  const [showLoginPopup, setShowLoginPopup] =
    useState(false);

  const content = {
    English: {
      back: "Back to Home",
      badge: "SIMPLE PROCESS",
      title: "How CivicPulse AI Works",
      subtitle:
        "Report civic issues, track their progress, and help build a better city in just a few simple steps.",

      step1Title: "Report the Issue",
      step1Text:
        "Login to your account and report a civic issue by providing the issue category, description, location, and photo.",

      step2Title: "Complaint Review",
      step2Text:
        "Your complaint is reviewed and forwarded to the appropriate department or officer for further action.",

      step3Title: "Track Progress",
      step3Text:
        "Receive updates and track the status of your complaint directly from your dashboard.",

      step4Title: "Resolution",
      step4Text:
        "Once the issue is resolved, you can view the final status and help us make your city better.",

      start: "Report an Issue",

      loginRequired: "Login Required",
      loginMessage:
        "Please login first to report a civic issue.",
      cancel: "Cancel",
      login: "Login",
    },

    Marathi: {
      back: "मुख्यपृष्ठावर परत जा",
      badge: "सोप्या पायऱ्या",
      title: "CivicPulse AI कसे कार्य करते",
      subtitle:
        "नागरी समस्या नोंदवा, तिची प्रगती पहा आणि काही सोप्या पायऱ्यांमध्ये चांगले शहर घडविण्यास मदत करा.",

      step1Title: "समस्या नोंदवा",
      step1Text:
        "तुमच्या खात्यात लॉगिन करा आणि समस्येचा प्रकार, वर्णन, ठिकाण आणि फोटो देऊन नागरी समस्या नोंदवा.",

      step2Title: "तक्रारीचे परीक्षण",
      step2Text:
        "तुमची तक्रार तपासली जाते आणि पुढील कारवाईसाठी संबंधित विभाग किंवा अधिकाऱ्याकडे पाठवली जाते.",

      step3Title: "प्रगती पहा",
      step3Text:
        "तुमच्या डॅशबोर्डमधून तक्रारीची स्थिती आणि प्रत्येक अपडेट पाहू शकता.",

      step4Title: "समस्या निराकरण",
      step4Text:
        "समस्या सोडवल्यानंतर अंतिम स्थिती पहा आणि चांगले शहर घडविण्यास मदत करा.",

      start: "समस्या नोंदवा",

      loginRequired: "लॉगिन आवश्यक",
      loginMessage:
        "नागरी समस्या नोंदवण्यासाठी कृपया आधी लॉगिन करा.",
      cancel: "रद्द करा",
      login: "लॉगिन",
    },

    Hindi: {
      back: "होम पर वापस जाएँ",
      badge: "सरल चरण",
      title: "CivicPulse AI कैसे काम करता है",
      subtitle:
        "नागरिक समस्या दर्ज करें, उसकी प्रगति ट्रैक करें और कुछ आसान चरणों में बेहतर शहर बनाने में मदद करें।",

      step1Title: "समस्या दर्ज करें",
      step1Text:
        "अपने खाते में लॉगिन करें और समस्या का प्रकार, विवरण, स्थान और फोटो देकर नागरिक समस्या दर्ज करें।",

      step2Title: "शिकायत की समीक्षा",
      step2Text:
        "आपकी शिकायत की समीक्षा की जाती है और आगे की कार्रवाई के लिए संबंधित विभाग या अधिकारी को भेजा जाता है।",

      step3Title: "प्रगति ट्रैक करें",
      step3Text:
        "अपने डैशबोर्ड से शिकायत की स्थिति और सभी अपडेट ट्रैक करें।",

      step4Title: "समाधान",
      step4Text:
        "समस्या हल होने के बाद अंतिम स्थिति देखें और बेहतर शहर बनाने में मदद करें।",

      start: "समस्या दर्ज करें",

      loginRequired: "लॉगिन आवश्यक है",
      loginMessage:
        "नागरिक समस्या दर्ज करने के लिए कृपया पहले लॉगिन करें।",
      cancel: "रद्द करें",
      login: "लॉगिन",
    },
  };

  const t =
    content[language] ||
    content.English;

  const steps = [
    {
      number: "01",
      icon: <FaMapMarkerAlt />,
      title: t.step1Title,
      text: t.step1Text,
    },
    {
      number: "02",
      icon: <FaClipboardCheck />,
      title: t.step2Title,
      text: t.step2Text,
    },
    {
      number: "03",
      icon: <FaBell />,
      title: t.step3Title,
      text: t.step3Text,
    },
    {
      number: "04",
      icon: <FaCheckCircle />,
      title: t.step4Title,
      text: t.step4Text,
    },
  ];


  // ==========================================
  // REPORT ISSUE BUTTON
  // ==========================================

  const handleReportIssue = () => {

    const token =
      localStorage.getItem("token");

    const user =
      localStorage.getItem("user");

    // USER LOGIN NAHI
    if (!token || !user) {

      setShowLoginPopup(true);

      return;
    }

    // USER LOGIN AAHE
    navigate("/report-complaint");
  };


  // ==========================================
  // LOGIN POPUP BUTTON
  // ==========================================

  const handleLogin = () => {

    setShowLoginPopup(false);

    navigate("/login");
  };


  return (
    <div
      className={
        darkMode
          ? "how-page dark"
          : "how-page"
      }
    >

      <div className="how-container">

        {/* BACK BUTTON */}

        <button
          type="button"
          className="how-back-btn"
          onClick={() => navigate("/")}
        >
          <FaArrowLeft />

          <span>
            {t.back}
          </span>

        </button>


        {/* HEADER */}

        <div className="how-header">

          <span className="how-badge">
            {t.badge}
          </span>

          <h1>
            {t.title}
          </h1>

          <p>
            {t.subtitle}
          </p>

        </div>


        {/* STEPS */}

        <div className="how-steps">

          {steps.map((step) => (

            <div
              className="how-step-card"
              key={step.number}
            >

              <div className="step-number-large">
                {step.number}
              </div>


              <div className="step-icon">
                {step.icon}
              </div>


              <div className="step-content">

                <h2>
                  {step.title}
                </h2>

                <p>
                  {step.text}
                </p>

              </div>

            </div>

          ))}

        </div>


        {/* BOTTOM CARD */}

        <div className="how-bottom-card">

          <h2>

            {language === "Marathi"
              ? "चांगल्या शहरासाठी आजच सुरुवात करा"
              : language === "Hindi"
              ? "बेहतर शहर के लिए आज ही शुरुआत करें"
              : "Start Making Your City Better Today"}

          </h2>


          <p>

            {language === "Marathi"
              ? "तुमच्या परिसरातील नागरी समस्या नोंदवा आणि बदलाचा भाग बना."
              : language === "Hindi"
              ? "अपने क्षेत्र की नागरिक समस्या दर्ज करें और बदलाव का हिस्सा बनें।"
              : "Report civic issues in your locality and become part of the change."}

          </p>


          <button
            type="button"
            onClick={handleReportIssue}
          >
            {t.start}
          </button>

        </div>

      </div>


      {/* ==========================================
          LOGIN REQUIRED POPUP
      ========================================== */}

      {showLoginPopup && (

        <div
          className="how-login-popup-overlay"
          onClick={() =>
            setShowLoginPopup(false)
          }
        >

          <div
            className={
              darkMode
                ? "how-login-popup dark-popup"
                : "how-login-popup"
            }
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="how-login-popup-icon">

              <FaLock />

            </div>


            <h3>
              {t.loginRequired}
            </h3>


            <p>
              {t.loginMessage}
            </p>


            <div className="how-login-popup-buttons">

              <button
                type="button"
                className="how-popup-cancel"
                onClick={() =>
                  setShowLoginPopup(false)
                }
              >
                {t.cancel}
              </button>


              <button
                type="button"
                className="how-popup-login"
                onClick={handleLogin}
              >
                {t.login}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default HowItWorks;