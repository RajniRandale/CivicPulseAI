import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  FaMap,
  FaImage,
  FaBell,
  FaChartBar,
  FaLock,
  FaThermometerHalf,
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaExclamationCircle,
} from "react-icons/fa";

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


  // ==================================================
  // REAL DASHBOARD STATS
  // ==================================================

  const [complaintStats, setComplaintStats] =
    useState({
      filed: 0,
      resolved: 0,
      inProgress: 0,
      pending: 0,
    });


  // ==================================================
  // GET REAL COMPLAINT COUNTS
  // ==================================================

  useEffect(() => {

    const fetchComplaintStats = async () => {

      try {

        const token =
          localStorage.getItem("token");


        const response =
          await fetch(
            "/api/complaints",
            {
              headers: {
                ...(token
                  ? {
                      Authorization: `Bearer ${token}`,
                    }
                  : {}),
              },
            }
          );


        if (!response.ok) {
          return;
        }


        const result =
          await response.json();


        // Supports different backend response structures

        const complaints =
          Array.isArray(result)
            ? result
            : result.complaints ||
              result.data ||
              [];


        const filed =
          complaints.length;


        const resolved =
          complaints.filter((complaint) => {

            const status =
              String(
                complaint.status || ""
              ).toLowerCase();

            return (
              status === "resolved" ||
              status === "completed" ||
              status === "closed"
            );

          }).length;


        const inProgress =
          complaints.filter((complaint) => {

            const status =
              String(
                complaint.status || ""
              ).toLowerCase();

            return (
              status === "in progress" ||
              status === "in_progress" ||
              status === "processing"
            );

          }).length;


        const pending =
          complaints.filter((complaint) => {

            const status =
              String(
                complaint.status || ""
              ).toLowerCase();

            return (
              status === "pending" ||
              status === "pending review" ||
              status === "under review" ||
              status === "submitted"
            );

          }).length;


        setComplaintStats({
          filed,
          resolved,
          inProgress,
          pending,
        });


      } catch (error) {

        console.error(
          "Error fetching complaint statistics:",
          error
        );

      }

    };


    fetchComplaintStats();

  }, []);


  // ==================================================
  // REPORT ISSUE
  // ==================================================

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


  // ==================================================
  // LOGIN POPUP
  // ==================================================

  const handlePopupOK = () => {

    setShowLoginPopup(false);

    navigate("/login");

  };


  // ==================================================
  // DASHBOARD STATS
  // ==================================================

  const stats = [

    {
      icon: <FaFileAlt />,
      iconClass: "filed",
      number: complaintStats.filed,

      label: isMarathi
        ? "दाखल तक्रारी"
        : isHindi
        ? "दर्ज शिकायतें"
        : "Complaints Filed",
    },


    {
      icon: <FaCheckCircle />,
      iconClass: "resolved",
      number: complaintStats.resolved,

      label: isMarathi
        ? "निकाली तक्रारी"
        : isHindi
        ? "हल की गई शिकायतें"
        : "Complaints Resolved",
    },


    {
      icon: <FaClock />,
      iconClass: "progress",
      number: complaintStats.inProgress,

      label: isMarathi
        ? "प्रगतीत"
        : isHindi
        ? "प्रगति पर"
        : "In Progress",
    },


    {
      icon: <FaExclamationCircle />,
      iconClass: "pending",
      number: complaintStats.pending,

      label: isMarathi
        ? "प्रलंबित"
        : isHindi
        ? "लंबित"
        : "Pending",
    },

  ];


  // ==================================================
  // PLATFORM FEATURES
  // ==================================================

  const features = [

    {
      icon: <FaMap />,

      title: isMarathi
        ? "इंटरॅक्टिव्ह लाईव्ह मॅप"
        : isHindi
        ? "इंटरैक्टिव लाइव मैप"
        : "Interactive Live Map",

      text: isMarathi
        ? "नोंदवलेल्या सर्व समस्या कॅटेगरी आधारित मार्करसह इंटरॅक्टिव्ह मॅपवर पहा."
        : isHindi
        ? "सभी दर्ज समस्याओं को श्रेणी आधारित मार्कर के साथ इंटरैक्टिव मैप पर देखें।"
        : "All reported issues displayed on an interactive map with category-based markers.",
    },


    {
      icon: <FaImage />,

      title: isMarathi
        ? "फोटो पुरावा"
        : isHindi
        ? "फोटो प्रमाण"
        : "Photo Evidence",

      text: isMarathi
        ? "तुमच्या तक्रारीसोबत फोटो अपलोड करून समस्येचा स्पष्ट पुरावा द्या."
        : isHindi
        ? "अपनी शिकायत के साथ फोटो अपलोड करके समस्या का स्पष्ट प्रमाण दें।"
        : "Upload images directly with your complaint for clear visual evidence.",
    },


    {
      icon: <FaBell />,

      title: isMarathi
        ? "रिअल-टाइम सूचना"
        : isHindi
        ? "रियल-टाइम सूचनाएं"
        : "Real-time Notifications",

      text: isMarathi
        ? "तुमच्या तक्रारीच्या स्थितीमध्ये बदल झाल्यावर त्वरित सूचना मिळवा."
        : isHindi
        ? "आपकी शिकायत की स्थिति बदलने पर तुरंत सूचना प्राप्त करें।"
        : "Get instant alerts when your complaint status changes.",
    },


    {
      icon: <FaChartBar />,

      title: isMarathi
        ? "अॅडमिन अॅनालिटिक्स"
        : isHindi
        ? "एडमिन एनालिटिक्स"
        : "Admin Analytics",

      text: isMarathi
        ? "तक्रारींचे ट्रेंड, कॅटेगरी आणि निराकरणाची प्रगती ट्रॅक करा."
        : isHindi
        ? "शिकायत ट्रेंड, श्रेणियों और समाधान प्रगति को ट्रैक करें।"
        : "Track complaint trends, category breakdowns and resolution progress.",
    },


    {
      icon: <FaLock />,

      title: isMarathi
        ? "सुरक्षित प्रमाणीकरण"
        : isHindi
        ? "सुरक्षित प्रमाणीकरण"
        : "Secure Authentication",

      text: isMarathi
        ? "नागरिक आणि अधिकाऱ्यांसाठी भूमिका आधारित सुरक्षित प्रवेश."
        : isHindi
        ? "नागरिकों और अधिकारियों के लिए भूमिका आधारित सुरक्षित पहुंच।"
        : "Secure authentication with role-based access for citizens and authorities.",
    },


    {
      icon: <FaThermometerHalf />,

      title: isMarathi
        ? "समस्या हीटमॅप"
        : isHindi
        ? "समस्या हीटमैप"
        : "Issue Heatmap",

      text: isMarathi
        ? "समस्यांची घनता पाहून महत्त्वाच्या भागांना प्राधान्य द्या."
        : isHindi
        ? "समस्याओं की घनता देखकर महत्वपूर्ण क्षेत्रों को प्राथमिकता दें।"
        : "Visualize issue density and help authorities prioritize high-impact zones.",
    },

  ];


  return (

    <div
      className={`home-page ${
        darkMode
          ? "dark-theme"
          : ""
      }`}
    >


      {/* HERO SECTION */}

      <section className="hero-section">

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


        {/* WAVE */}

        <div className="hero-wave">

          <svg
            viewBox="0 0 1440 100"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >

            <path d="M0,40 C360,110 1080,-30 1440,40 L1440,100 L0,100 Z" />

          </svg>

        </div>

      </section>



      {/* STATS SECTION */}

      <section className="stats-section">

        <div className="container stats-grid">

          {stats.map((stat, index) => (

            <div
              className="stat-card"
              key={index}
            >

              <div
                className={`stat-icon ${stat.iconClass}`}
              >

                {stat.icon}

              </div>


              <div className="stat-number">

                {stat.number}

              </div>


              <div className="stat-label">

                {stat.label}

              </div>

            </div>

          ))}

        </div>

      </section>



      {/* PLATFORM FEATURES */}

      <section
        className="platform-features-section"
        id="services"
      >

        <div className="container">


          <div className="platform-header">

            <span className="platform-badge">

              {isMarathi
                ? "प्लॅटफॉर्म"
                : isHindi
                ? "प्लेटफॉर्म"
                : "PLATFORM"}

            </span>


            <h2>

              {isMarathi
                ? "प्लॅटफॉर्म वैशिष्ट्ये"
                : isHindi
                ? "प्लेटफॉर्म सुविधाएँ"
                : "Platform Features"}

            </h2>


            <p>

              {isMarathi
                ? "सक्रिय नागरिकासाठी आवश्यक असलेली सर्व वैशिष्ट्ये"
                : isHindi
                ? "एक सक्रिय नागरिक के लिए आवश्यक सभी सुविधाएं"
                : "Everything a civic-engaged citizen needs"}

            </p>

          </div>



          <div className="platform-features-grid">

            {features.map((feature, index) => (

              <div
                className="platform-feature-card"
                key={index}
              >

                <div className="platform-feature-icon">

                  {feature.icon}

                </div>


                <h3>

                  {feature.title}

                </h3>


                <p>

                  {feature.text}

                </p>

              </div>

            ))}

          </div>


        </div>

      </section>



      {/* CONTACT SECTION */}

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



      {/* LOGIN POPUP */}

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