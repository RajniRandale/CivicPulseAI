import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaArrowLeft,
  FaClipboardList,
  FaEnvelope,
  FaHome,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";
import { useAppSettings } from "../components/TopUtilityBar";
import translations from "../components/translations";

function CitizenProfile() {
  const navigate = useNavigate();
  const { language } = useAppSettings();
  const t = translations[language] || translations.English;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedCurrentUser = localStorage.getItem("currentUser");
    const token = localStorage.getItem("token");

    if (!savedUser) {
      navigate("/citizen-login");
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);
      const parsedCurrentUser = savedCurrentUser
        ? JSON.parse(savedCurrentUser)
        : {};

      setUser({
        ...parsedCurrentUser,
        ...parsedUser,
        mobile:
          parsedUser.mobile ||
          parsedCurrentUser.mobile ||
          parsedUser.phone ||
          parsedCurrentUser.phone ||
          "",
      });

        if (token) {
          axios.get("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          }).then((response) => {
            const backendUser = response.data?.user;
            if (backendUser) {
              const mergedUser = {
                ...backendUser,
                mobile:
                  backendUser.mobile ||
                  parsedUser.mobile ||
                  parsedCurrentUser.mobile ||
                  parsedUser.phone ||
                  parsedCurrentUser.phone ||
                  "",
              };
              setUser(mergedUser);
              localStorage.setItem("user", JSON.stringify(mergedUser));
            }
          }).catch((error) => {
            console.error("Failed to load profile from backend:", error);
          });
        }
    } catch (error) {
      console.error("User data error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/citizen-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");
    navigate("/citizen-login");
  };

  if (!user) {
    return <div className="container mt-5 text-center"><h4>Loading profile...</h4></div>;
  }

  return (
    <div className="container-fluid p-0">
      <div className="row g-0">
        <aside className="col-md-2" style={{ backgroundColor: "#212529", minHeight: "100vh", padding: "20px", position: "relative" }}>
          <div className="text-center mb-4">
            <FaHome size={38} color="#198754" className="mb-2" />
            <h4 className="text-white mb-0">CivicPulse AI</h4>
            <small style={{ color: "#adb5bd" }}>{t.citizenPortal}</small>
          </div>

          <nav
            className="d-flex flex-column gap-2"
            style={{ minHeight: "calc(100vh - 120px)" }}
          >
            <Link to="/citizen-dashboard" className="btn btn-dark text-start text-white"><FaHome className="me-2" />{t.dashboard}</Link>
            <Link to="/my-complaints" className="btn btn-dark text-start text-white"><FaClipboardList className="me-2" />{t.myComplaints}</Link>
            <Link to="/citizen-profile" className="btn btn-success text-start"><FaUserCircle className="me-2" />{t.profile}</Link>
            <button type="button" className="btn btn-dark text-start text-white" onClick={() => navigate("/citizen-help")}><FaQuestionCircle className="me-2" />{t.helpSupport}</button>
            <button type="button" className="btn btn-danger text-start mt-3" style={{ position: "absolute", left: "20px", right: "20px", bottom: "20px" }} onClick={handleLogout}><FaSignOutAlt className="me-2" />{t.logout}</button>
          </nav>
        </aside>

        <main className="col-md-10">
          <div className="container mt-5 mb-5" style={{ maxWidth: "750px" }}>
            <Link to="/citizen-dashboard" className="btn btn-outline-secondary mb-3"><FaArrowLeft className="me-2" />Back to Dashboard</Link>

            <div className="card shadow-lg border-0">
              <div className="card-header bg-success text-white p-4 d-flex align-items-center">
                <FaUserCircle size={60} className="me-3" />
                <div><h3 className="mb-1">{t.citizenProfile}</h3><small>Manage your account information</small></div>
              </div>

              <div className="card-body p-4">
                <ProfileField icon={<FaUserCircle />} label={t.fullName} value={user.name} />
                <ProfileField icon={<FaEnvelope />} label={t.email} value={user.email} />
                <ProfileField icon={<FaUserCircle />} label={t.mobileNumber} value={user.mobile} />
                <ProfileField icon={<FaUserShield />} label="Role" value={user.role || "citizen"} />
                <button type="button" className="btn btn-danger" onClick={handleLogout}><FaSignOutAlt className="me-2" />{t.logout}</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ProfileField({ icon, label, value }) {
  return (
    <div className="mb-4">
      <label className="fw-bold mb-2">{React.cloneElement(icon, { className: "text-success me-2" })}{label}</label>
      <div className="form-control bg-light">{value || "-"}</div>
    </div>
  );
}

export default CitizenProfile;
