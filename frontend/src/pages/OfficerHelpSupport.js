import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaArrowLeft,
  FaQuestionCircle,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaExclamationCircle,
  FaBookOpen,
} from "react-icons/fa";

import { useAppSettings } from "../components/TopUtilityBar";

import "./OfficerHelpSupport.css";

function OfficerHelpSupport() {
  const navigate = useNavigate();

  const { language, darkMode } = useAppSettings();

  const content = {
    English: {
      back: "Back to Dashboard",
      title: "Help & Support",
      subtitle:
        "Get help with your officer portal and complaint management.",
      quickHelp: "Quick Help",
      faq: "Frequently Asked Questions",
      email: "Email Support",
      phone: "Phone Support",
      hours: "Support Hours",
      emailValue: "support@civicpulseai.com",
      phoneValue: "+91 1800 123 4567",
      hoursValue: "Monday - Friday, 9:00 AM - 6:00 PM",
      q1: "How do I view assigned complaints?",
      a1:
        "Open Assigned Complaints from the officer dashboard to review complaints assigned to you.",
      q2: "How do I update complaint status?",
      a2:
        "Open the complaint and select the required status such as Pending, In Progress or Resolved.",
      q3: "What should I do if a complaint cannot be updated?",
      a3:
        "Refresh the page and try again. If the issue continues, contact support.",
      q4: "How do I logout?",
      a4:
        "Use the Logout button available at the bottom of the officer sidebar.",
      issueTitle: "Facing a technical issue?",
      issueText:
        "Contact the CivicPulse AI support team with your registered email and a short description of the issue.",
      report: "Report Technical Issue",
    },

    Marathi: {
      back: "डॅशबोर्डवर परत जा",
      title: "मदत आणि समर्थन",
      subtitle:
        "अधिकारी पोर्टल आणि तक्रार व्यवस्थापनासाठी मदत मिळवा.",
      quickHelp: "त्वरित मदत",
      faq: "वारंवार विचारले जाणारे प्रश्न",
      email: "ईमेल समर्थन",
      phone: "फोन समर्थन",
      hours: "समर्थन वेळ",
      emailValue: "support@civicpulseai.com",
      phoneValue: "+91 1800 123 4567",
      hoursValue: "सोमवार - शुक्रवार, सकाळी 9 ते संध्याकाळी 6",
      q1: "सोपवलेल्या तक्रारी कशा पहायच्या?",
      a1:
        "Officer Dashboard मधील Assigned Complaints वर जाऊन तुम्हाला सोपवलेल्या तक्रारी पाहू शकता.",
      q2: "तक्रारीची स्थिती कशी अपडेट करायची?",
      a2:
        "तक्रार उघडा आणि Pending, In Progress किंवा Resolved यापैकी योग्य स्थिती निवडा.",
      q3: "तक्रारीची स्थिती अपडेट होत नसेल तर काय करावे?",
      a3:
        "पेज refresh करून पुन्हा प्रयत्न करा. समस्या कायम राहिल्यास support शी संपर्क करा.",
      q4: "Logout कसे करायचे?",
      a4:
        "Officer sidebar च्या खाली असलेल्या Logout बटणाचा वापर करा.",
      issueTitle: "तांत्रिक समस्या येत आहे?",
      issueText:
        "तुमच्या registered email आणि समस्येच्या थोडक्यात वर्णनासह CivicPulse AI support team शी संपर्क करा.",
      report: "तांत्रिक समस्या नोंदवा",
    },

    Hindi: {
      back: "डैशबोर्ड पर वापस जाएँ",
      title: "मदद और सहायता",
      subtitle:
        "अधिकारी पोर्टल और शिकायत प्रबंधन के लिए सहायता प्राप्त करें।",
      quickHelp: "त्वरित सहायता",
      faq: "अक्सर पूछे जाने वाले प्रश्न",
      email: "ईमेल सहायता",
      phone: "फोन सहायता",
      hours: "सहायता समय",
      emailValue: "support@civicpulseai.com",
      phoneValue: "+91 1800 123 4567",
      hoursValue: "सोमवार - शुक्रवार, सुबह 9 बजे - शाम 6 बजे",
      q1: "सौंपी गई शिकायतें कैसे देखें?",
      a1:
        "Officer Dashboard में Assigned Complaints खोलकर आपको सौंपी गई शिकायतें देखें।",
      q2: "शिकायत की स्थिति कैसे अपडेट करें?",
      a2:
        "शिकायत खोलें और Pending, In Progress या Resolved में से सही स्थिति चुनें।",
      q3: "अगर शिकायत की स्थिति अपडेट नहीं हो रही है तो क्या करें?",
      a3:
        "पेज को refresh करके फिर प्रयास करें। समस्या जारी रहने पर support से संपर्क करें।",
      q4: "Logout कैसे करें?",
      a4:
        "Officer sidebar के नीचे दिए गए Logout बटन का उपयोग करें।",
      issueTitle: "तकनीकी समस्या आ रही है?",
      issueText:
        "अपने registered email और समस्या के संक्षिप्त विवरण के साथ CivicPulse AI support team से संपर्क करें।",
      report: "तकनीकी समस्या रिपोर्ट करें",
    },
  };

  const t = content[language] || content.English;

  return (
    <div
      className={
        darkMode
          ? "officer-help-page dark"
          : "officer-help-page"
      }
    >
      <div className="officer-help-container">

        <button
          type="button"
          className="help-back-btn"
          onClick={() => navigate("/officer-dashboard")}
        >
          <FaArrowLeft />
          <span>{t.back}</span>
        </button>

        <div className="help-header">
          <div className="help-title-icon">
            <FaQuestionCircle />
          </div>

          <div>
            <span className="help-brand">
              CIVICPULSE AI
            </span>

            <h1>{t.title}</h1>

            <p>{t.subtitle}</p>
          </div>
        </div>

        <section className="help-section">
          <div className="help-section-title">
            <FaBookOpen />
            <h2>{t.quickHelp}</h2>
          </div>

          <div className="help-contact-grid">

            <div className="help-contact-card">
              <div className="help-card-icon green">
                <FaEnvelope />
              </div>

              <div>
                <h3>{t.email}</h3>
                <p>{t.emailValue}</p>

                <a href={`mailto:${t.emailValue}`}>
                  {t.email}
                </a>
              </div>
            </div>

            <div className="help-contact-card">
              <div className="help-card-icon blue">
                <FaPhone />
              </div>

              <div>
                <h3>{t.phone}</h3>
                <p>{t.phoneValue}</p>

                <a href="tel:+9118001234567">
                  {t.phone}
                </a>
              </div>
            </div>

            <div className="help-contact-card">
              <div className="help-card-icon orange">
                <FaClock />
              </div>

              <div>
                <h3>{t.hours}</h3>
                <p>{t.hoursValue}</p>
              </div>
            </div>

          </div>
        </section>

        <section className="help-section">
          <div className="help-section-title">
            <FaQuestionCircle />
            <h2>{t.faq}</h2>
          </div>

          <div className="faq-list">

            <details>
              <summary>{t.q1}</summary>
              <p>{t.a1}</p>
            </details>

            <details>
              <summary>{t.q2}</summary>
              <p>{t.a2}</p>
            </details>

            <details>
              <summary>{t.q3}</summary>
              <p>{t.a3}</p>
            </details>

            <details>
              <summary>{t.q4}</summary>
              <p>{t.a4}</p>
            </details>

          </div>
        </section>

        <section className="issue-support-card">
          <div className="issue-icon">
            <FaExclamationCircle />
          </div>

          <div className="issue-content">
            <h2>{t.issueTitle}</h2>

            <p>{t.issueText}</p>

            <a
              href={`mailto:${t.emailValue}?subject=CivicPulse AI Officer Support`}
              className="issue-button"
            >
              <FaEnvelope />
              <span>{t.report}</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}

export default OfficerHelpSupport;