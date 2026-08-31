import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  FaArrowLeft,
  FaBell,
  FaClipboardList,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

import { useAppSettings } from "../components/TopUtilityBar";

import "./OfficerNotifications.css";

function OfficerNotifications() {
  const navigate = useNavigate();

  const { language, darkMode } = useAppSettings();

  const [allRead, setAllRead] = useState(false);
  const [readNotifications, setReadNotifications] = useState(() => new Set());
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const content = {
    English: {
      back: "Back to Dashboard",
      title: "Notifications",
      subtitle:
        "Stay updated with your assigned complaints and important activities.",
      today: "Today",
      earlier: "Earlier",
      noNotifications: "No new notifications",
      assignedTitle: "New Complaint Assigned",
      assignedText:
        "A new complaint has been assigned to you. Please review it and take the required action.",
      pendingTitle: "Complaint Pending",
      pendingText:
        "You have a complaint that is still awaiting an update.",
      resolvedTitle: "Complaint Resolved",
      resolvedText:
        "A complaint has been successfully marked as resolved.",
      infoTitle: "System Update",
      infoText:
        "Your officer portal is working properly and your information is up to date.",
      justNow: "Just now",
      minutesAgo: "10 minutes ago",
      hoursAgo: "2 hours ago",
      yesterday: "Yesterday",
      markRead: "Mark all as read",
      allRead: "All notifications marked as read",
    },

    Marathi: {
      back: "डॅशबोर्डवर परत जा",
      title: "सूचना",
      subtitle:
        "तुमच्या सोपवलेल्या तक्रारी आणि महत्त्वाच्या अपडेट्सची माहिती मिळवा.",
      today: "आज",
      earlier: "आधीच्या",
      noNotifications: "नवीन सूचना नाहीत",
      assignedTitle: "नवीन तक्रार सोपवण्यात आली",
      assignedText:
        "तुम्हाला नवीन तक्रार सोपवण्यात आली आहे. कृपया ती तपासा आणि आवश्यक कारवाई करा.",
      pendingTitle: "तक्रार प्रलंबित आहे",
      pendingText:
        "तुमच्याकडे अशी तक्रार आहे ज्याची स्थिती अजून अपडेट करायची आहे.",
      resolvedTitle: "तक्रार सोडवण्यात आली",
      resolvedText:
        "एक तक्रार यशस्वीरित्या सोडवण्यात आली आहे.",
      infoTitle: "सिस्टम अपडेट",
      infoText:
        "तुमचे Officer Portal योग्य प्रकारे कार्यरत आहे आणि तुमची माहिती अपडेट आहे.",
      justNow: "आत्ताच",
      minutesAgo: "10 मिनिटांपूर्वी",
      hoursAgo: "2 तासांपूर्वी",
      yesterday: "काल",
      markRead: "सर्व वाचले म्हणून चिन्हांकित करा",
      allRead: "सर्व सूचना वाचलेल्या म्हणून चिन्हांकित केल्या",
    },

    Hindi: {
      back: "डैशबोर्ड पर वापस जाएँ",
      title: "सूचनाएं",
      subtitle:
        "अपनी सौंपी गई शिकायतों और महत्वपूर्ण गतिविधियों की जानकारी प्राप्त करें।",
      today: "आज",
      earlier: "पहले की",
      noNotifications: "कोई नई सूचना नहीं",
      assignedTitle: "नई शिकायत सौंपी गई",
      assignedText:
        "आपको एक नई शिकायत सौंपी गई है। कृपया उसकी समीक्षा करें और आवश्यक कार्रवाई करें।",
      pendingTitle: "शिकायत लंबित है",
      pendingText:
        "आपके पास एक शिकायत है जिसकी स्थिति अभी अपडेट की जानी है।",
      resolvedTitle: "शिकायत हल हो गई",
      resolvedText:
        "एक शिकायत को सफलतापूर्वक हल के रूप में चिह्नित किया गया है।",
      infoTitle: "सिस्टम अपडेट",
      infoText:
        "आपका Officer Portal सही तरीके से कार्य कर रहा है और आपकी जानकारी अपडेट है।",
      justNow: "अभी",
      minutesAgo: "10 मिनट पहले",
      hoursAgo: "2 घंटे पहले",
      yesterday: "कल",
      markRead: "सभी को पढ़ा हुआ चिन्हित करें",
      allRead: "सभी सूचनाओं को पढ़ा हुआ चिन्हित किया गया",
    },
  };

  const t = content[language] || content.English;

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      if (!token || !savedUser) {
        navigate("/officer-login");
        return;
      }

      try {
        const response = await axios.get(
          "http://localhost:5000/api/complaints/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const complaints = response.data?.complaints || [];

        setNotifications(
          complaints.map((complaint) => {
            const status = (complaint.status || "Pending").toLowerCase();
            const type = status === "resolved"
              ? "resolved"
              : status === "pending" || status === "in progress"
                ? "pending"
                : "info";

            return {
              id: complaint.id,
              type,
              title: complaint.title || complaint.category || "Complaint",
              text: complaint.description || complaint.status || "",
              time: complaint.created_at
                ? new Date(complaint.created_at).toLocaleString()
                : "",
              icon: type === "resolved"
                ? <FaCheckCircle />
                : type === "pending"
                  ? <FaClock />
                  : <FaClipboardList />,
              unread: status !== "resolved",
              createdAt: complaint.created_at,
            };
          })
        );
      } catch (error) {
        console.error("Officer notifications error:", error);

        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/officer-login");
          return;
        }

        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [navigate]);

  const handleMarkAllRead = () => {
    setAllRead(true);
  };

  const handleNotificationRead = (id) => {
    if (allRead) {
      return;
    }

    setReadNotifications((currentReadNotifications) => {
      const nextReadNotifications = new Set(currentReadNotifications);
      nextReadNotifications.add(id);
      return nextReadNotifications;
    });
  };

  const renderNotification = (notification) => {
    const isUnread =
      notification.unread &&
      !allRead &&
      !readNotifications.has(notification.id);

    return (
      <div
        className={`notification-card ${
          !isUnread ? "read" : ""
        }`}
        key={notification.id}
        role="button"
        tabIndex={isUnread ? 0 : -1}
        onClick={() => handleNotificationRead(notification.id)}
        onKeyDown={(event) => {
          if (isUnread && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            handleNotificationRead(notification.id);
          }
        }}
      >
        <div
          className={`notification-icon ${notification.type}`}
        >
          {notification.icon}
        </div>

        <div className="notification-content">
          <div className="notification-content-top">
            <h3>
              {notification.title}
            </h3>

            <span>
              {notification.time}
            </span>
          </div>

          <p>
            {notification.text}
          </p>
        </div>

        {isUnread && (
          <div className="unread-dot" />
        )}
      </div>
    );
  };

  return (
    <div
      className={
        darkMode
          ? "officer-notification-page dark"
          : "officer-notification-page"
      }
    >
      <div className="notification-container">

        {/* BACK BUTTON */}

        <button
          type="button"
          className="notification-back-btn"
          onClick={() =>
            navigate("/officer-dashboard")
          }
        >
          <FaArrowLeft />

          <span>
            {t.back}
          </span>
        </button>


        {/* HEADER */}

        <div className="notification-header">

          <div className="notification-title-area">

            <div className="notification-main-icon">
              <FaBell />
            </div>

            <div>
              <span className="notification-label">
                CIVICPULSE AI
              </span>

              <h1>
                {t.title}
              </h1>

              <p>
                {t.subtitle}
              </p>
            </div>

          </div>


          <button
            type="button"
            className="mark-read-btn"
            onClick={handleMarkAllRead}
            disabled={allRead}
          >
            <FaCheckCircle />

            {allRead
              ? t.allRead
              : t.markRead}
          </button>

        </div>


        {/* TODAY */}

        <section className="notification-section">

          <h2 className="notification-section-title">
            {t.today}
          </h2>

          <div className="notification-list">

            {loading ? (
              <p className="notification-empty-message">Loading...</p>
            ) : notifications.length === 0 ? (
              <p className="notification-empty-message">
                {t.noNotifications}
              </p>
            ) : (
              notifications
                .filter((notification) => {
                  if (!notification.createdAt) return true;
                  return new Date(notification.createdAt).toDateString() ===
                    new Date().toDateString();
                })
                .map(renderNotification)
            )}

          </div>

        </section>


        {/* EARLIER */}

        <section className="notification-section">

          <h2 className="notification-section-title">
            {t.earlier}
          </h2>

          <div className="notification-list">

            {!loading && notifications
              .filter((notification) => {
                if (!notification.createdAt) return false;
                return new Date(notification.createdAt).toDateString() !==
                  new Date().toDateString();
              })
              .map(renderNotification)}

          </div>

        </section>

      </div>
    </div>
  );
}

export default OfficerNotifications;