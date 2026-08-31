import React from "react";
import "./Contact.css";

import translations from "../components/translations";
import { useAppSettings } from "../components/TopUtilityBar";

function Contact() {
  // ==================================================
  // LANGUAGE & THEME
  // ==================================================

  const { language, darkMode } = useAppSettings();

  const t =
    translations[language] ||
    translations.English;

  return (
    <div
      className={`contact-page ${
        darkMode ? "dark-theme" : ""
      }`}
    >

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