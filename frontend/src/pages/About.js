import React from "react";

import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaCamera,
  FaChartLine,
} from "react-icons/fa";

import "./About.css";

import translations from "../components/translations";
import { useAppSettings } from "../components/TopUtilityBar";


function About() {

  // ==================================================
  // LANGUAGE & THEME
  // ==================================================

  const {
    language,
    darkMode,
  } = useAppSettings();


  const t =
    translations[language] ||
    translations.English;


  // ==================================================
  // ABOUT PAGE LANGUAGE CONTENT
  // ==================================================

  const aboutText = {

    English: {

      badge:
        "ABOUT CIVICPULSE AI",

      description1:
        "CivicPulse AI is a smart, citizen-centric civic grievance management platform designed to connect citizens with local authorities and make public problem reporting easier, faster and more transparent.",

      description2:
        "Citizens can report civic issues such as garbage accumulation, damaged roads, potholes, broken streetlights, water leakage, drainage problems and sanitation concerns. Every complaint can be tracked from submission until resolution.",

      description3:
        "The platform helps create a direct connection between citizens and responsible authorities. By using technology, complaint tracking and data-driven insights, CivicPulse AI aims to improve accountability and support the development of cleaner, safer and smarter cities.",

      feature1:
        "Real-time complaint tracking and status updates",

      feature2:
        "Photo and location-based civic issue reporting",

      feature3:
        "Transparent communication between citizens and authorities",

      feature4:
        "Citizen-focused resolution and public accountability",

      feature5:
        "Smart analytics to understand recurring civic issues",

      purpose:
        "Our Purpose",

      purposeDescription:
        "CivicPulse AI is built to simplify the process of reporting public problems and ensure that civic issues are properly documented, monitored and followed until they are resolved.",

      help:
        "How We Help",

      helpDescription:
        "The platform enables citizens to actively participate in improving their communities while helping authorities receive organized information about issues that require attention.",

      vision:
        "Our Vision",

      visionDescription:
        "To build smarter cities where technology improves communication, increases transparency and encourages citizens and authorities to work together.",

    },


    Marathi: {

      badge:
        "CIVICPULSE AI बद्दल",

      description1:
        "CivicPulse AI हे नागरिक-केंद्रित स्मार्ट नागरी तक्रार व्यवस्थापन प्लॅटफॉर्म आहे. हे नागरिकांना स्थानिक प्रशासनाशी जोडते आणि सार्वजनिक समस्यांची नोंदणी अधिक सोपी, जलद आणि पारदर्शक बनवते.",

      description2:
        "नागरिक कचरा साचणे, खराब रस्ते, खड्डे, बंद पथदिवे, पाण्याची गळती, ड्रेनेजच्या समस्या आणि स्वच्छतेशी संबंधित समस्या नोंदवू शकतात. प्रत्येक तक्रारीचा नोंदणीपासून निराकरणापर्यंत मागोवा घेता येतो.",

      description3:
        "हे प्लॅटफॉर्म नागरिक आणि संबंधित प्रशासन यांच्यामध्ये थेट संपर्क निर्माण करण्यास मदत करते. तंत्रज्ञान, तक्रार ट्रॅकिंग आणि डेटा-आधारित माहितीच्या मदतीने CivicPulse AI उत्तरदायित्व आणि पारदर्शकता वाढवण्यास तसेच अधिक स्वच्छ, सुरक्षित आणि स्मार्ट शहरांच्या विकासाला मदत करण्याचा प्रयत्न करते.",

      feature1:
        "रिअल-टाइम तक्रार ट्रॅकिंग आणि स्थिती अपडेट्स",

      feature2:
        "फोटो आणि स्थानाच्या आधारे नागरी समस्या नोंदवण्याची सुविधा",

      feature3:
        "नागरिक आणि अधिकाऱ्यांमधील पारदर्शक संवाद",

      feature4:
        "नागरिक-केंद्रित निराकरण आणि सार्वजनिक उत्तरदायित्व",

      feature5:
        "वारंवार होणाऱ्या नागरी समस्या समजण्यासाठी स्मार्ट ॲनालिटिक्स",

      purpose:
        "आमचा उद्देश",

      purposeDescription:
        "CivicPulse AI चा उद्देश सार्वजनिक समस्यांची नोंदणी प्रक्रिया सोपी करणे आणि नागरी समस्या योग्यरित्या नोंदवल्या, निरीक्षण केल्या आणि त्यांचे निराकरण होईपर्यंत त्यांचा मागोवा घेतला जाईल याची खात्री करणे आहे.",

      help:
        "आम्ही कशी मदत करतो",

      helpDescription:
        "हे प्लॅटफॉर्म नागरिकांना त्यांच्या परिसराच्या सुधारणेत सक्रियपणे सहभागी होण्यास सक्षम करते आणि अधिकाऱ्यांना लक्ष देण्याची गरज असलेल्या समस्यांची व्यवस्थित माहिती मिळवण्यास मदत करते.",

      vision:
        "आमचे व्हिजन",

      visionDescription:
        "तंत्रज्ञानाच्या मदतीने संवाद आणि पारदर्शकता वाढवणारी आणि नागरिक व अधिकारी यांना एकत्र काम करण्यास प्रोत्साहित करणारी स्मार्ट शहरे उभारणे.",

    },


    Hindi: {

      badge:
        "CIVICPULSE AI के बारे में",

      description1:
        "CivicPulse AI एक स्मार्ट और नागरिक-केंद्रित नागरिक शिकायत प्रबंधन प्लेटफॉर्म है। यह नागरिकों को स्थानीय प्रशासन से जोड़ता है और सार्वजनिक समस्याओं की रिपोर्टिंग को आसान, तेज और अधिक पारदर्शी बनाता है।",

      description2:
        "नागरिक कचरा जमा होना, खराब सड़कें, गड्ढे, खराब स्ट्रीट लाइट, पानी का रिसाव, ड्रेनेज की समस्याएं और स्वच्छता से जुड़ी समस्याओं की शिकायत दर्ज कर सकते हैं। प्रत्येक शिकायत को दर्ज करने से लेकर समाधान तक ट्रैक किया जा सकता है।",

      description3:
        "यह प्लेटफॉर्म नागरिकों और संबंधित अधिकारियों के बीच सीधा संपर्क बनाने में मदद करता है। तकनीक, शिकायत ट्रैकिंग और डेटा-आधारित जानकारी के माध्यम से CivicPulse AI जवाबदेही और पारदर्शिता को बेहतर बनाने तथा स्वच्छ, सुरक्षित और स्मार्ट शहरों के विकास में सहायता करता है।",

      feature1:
        "रीयल-टाइम शिकायत ट्रैकिंग और स्थिति अपडेट",

      feature2:
        "फोटो और स्थान के आधार पर नागरिक समस्या दर्ज करने की सुविधा",

      feature3:
        "नागरिकों और अधिकारियों के बीच पारदर्शी संवाद",

      feature4:
        "नागरिक-केंद्रित समाधान और सार्वजनिक जवाबदेही",

      feature5:
        "बार-बार होने वाली नागरिक समस्याओं को समझने के लिए स्मार्ट एनालिटिक्स",

      purpose:
        "हमारा उद्देश्य",

      purposeDescription:
        "CivicPulse AI का उद्देश्य सार्वजनिक समस्याओं की रिपोर्टिंग को आसान बनाना और यह सुनिश्चित करना है कि नागरिक समस्याओं को सही तरीके से दर्ज, मॉनिटर और समाधान होने तक ट्रैक किया जाए।",

      help:
        "हम कैसे मदद करते हैं",

      helpDescription:
        "यह प्लेटफॉर्म नागरिकों को अपने समुदाय को बेहतर बनाने में सक्रिय रूप से भाग लेने में सक्षम बनाता है और अधिकारियों को ध्यान देने योग्य समस्याओं की व्यवस्थित जानकारी प्राप्त करने में मदद करता है।",

      vision:
        "हमारा विज़न",

      visionDescription:
        "ऐसे स्मार्ट शहर बनाना जहाँ तकनीक बेहतर संवाद और पारदर्शिता को बढ़ावा दे तथा नागरिकों और अधिकारियों को मिलकर काम करने के लिए प्रोत्साहित करे।",

    },

  };


  const currentText =
    aboutText[language] ||
    aboutText.English;


  return (

    <div
      className={`about-page ${
        darkMode
          ? "dark-theme"
          : ""
      }`}
    >


      {/* ==================================================
          MAIN ABOUT SECTION
      ================================================== */}

      <section className="about-main">


        <div className="about-container">


          {/* BADGE */}

          <div className="about-badge">

            {currentText.badge}

          </div>



          {/* HEADER */}

          <div className="about-header">

            <h1>

              {t.whatIsCivicPulse}

            </h1>


            <div className="about-title-line" />

          </div>



          {/* MAIN CONTENT */}

          <div className="about-content-grid">


            {/* ==========================================
                LEFT CONTENT
            ========================================== */}

            <div className="about-text-section">


              <p>

                {currentText.description1}

              </p>


              <p>

                {currentText.description2}

              </p>


              <p>

                {currentText.description3}

              </p>



              {/* FEATURES */}

              <div className="about-features-list">


                <div className="about-feature-item">

                  <FaCheckCircle />

                  <span>

                    {currentText.feature1}

                  </span>

                </div>



                <div className="about-feature-item">

                  <FaCheckCircle />

                  <span>

                    {currentText.feature2}

                  </span>

                </div>



                <div className="about-feature-item">

                  <FaCheckCircle />

                  <span>

                    {currentText.feature3}

                  </span>

                </div>



                <div className="about-feature-item">

                  <FaCheckCircle />

                  <span>

                    {currentText.feature4}

                  </span>

                </div>



                <div className="about-feature-item">

                  <FaCheckCircle />

                  <span>

                    {currentText.feature5}

                  </span>

                </div>


              </div>


            </div>



            {/* ==========================================
                RIGHT VISUAL
            ========================================== */}

            <div className="about-visual-card">


              {/* BIG CIRCLE */}

              <div className="about-circle">


                {/* LOCATION PIN */}

                <div className="about-pin">


                  <div className="about-pin-inner">

                    <FaMapMarkerAlt />

                  </div>


                </div>


              </div>



              {/* FLOATING CAMERA */}

              <div
                className="
                  about-small-icon
                  icon-camera
                "
              >

                <FaCamera />

              </div>



              {/* FLOATING CHECK */}

              <div
                className="
                  about-small-icon
                  icon-check
                "
              >

                <FaCheckCircle />

              </div>



              {/* FLOATING CHART */}

              <div
                className="
                  about-small-icon
                  icon-chart
                "
              >

                <FaChartLine />

              </div>


            </div>


          </div>



          {/* ==========================================
              EXTRA INFORMATION SECTION
          ========================================== */}

          <div className="about-info-section">


            <div className="about-info-card">

              <h3>

                {currentText.purpose}

              </h3>


              <p>

                {currentText.purposeDescription}

              </p>


            </div>



            <div className="about-info-card">

              <h3>

                {currentText.help}

              </h3>


              <p>

                {currentText.helpDescription}

              </p>


            </div>



            <div className="about-info-card">

              <h3>

                {currentText.vision}

              </h3>


              <p>

                {currentText.visionDescription}

              </p>


            </div>


          </div>


        </div>


      </section>



      {/* ==================================================
          FOOTER
      ================================================== */}

      <footer className="footer">

        <div className="container text-center">


          <h5>

            CivicPulse AI

          </h5>


          <p>

            {t.smartCitySolutions}

          </p>


          <small>

            © 2026 CivicPulse AI. All rights reserved.

          </small>


        </div>

      </footer>


    </div>

  );

}


export default About;