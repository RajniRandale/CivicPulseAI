import React, {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  FaUserCircle,
  FaEnvelope,
  FaIdCard,
  FaUserShield,
  FaArrowLeft,
  FaSignOutAlt,
  FaEdit,
  FaSave,
  FaTimes,
  FaHome,
  FaClipboardList,
  FaPlus,
  FaQuestionCircle,
} from "react-icons/fa";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

import translations from "../components/translations";

function CitizenProfile() {
  const navigate = useNavigate();

  // ==================================================
  // GLOBAL LANGUAGE
  // ==================================================

  const { language } =
    useAppSettings();

  const t =
    translations[language] ||
    translations.English;


  // ==================================================
  // USER DATA
  // ==================================================

  const [user, setUser] =
    useState(null);

  const [name, setName] =
    useState("");

  const [isEditing, setIsEditing] =
    useState(false);


  // ==================================================
  // LOAD LOGGED-IN USER
  // ==================================================

  useEffect(() => {
    const userData =
      localStorage.getItem("user");

    if (!userData) {
      navigate(
        "/citizen-login"
      );
      return;
    }

    try {
      const parsedUser =
        JSON.parse(userData);

      setUser(parsedUser);

      setName(
        parsedUser.name || ""
      );

    } catch (error) {
      console.error(
        "User data error:",
        error
      );

      localStorage.removeItem(
        "user"
      );

      localStorage.removeItem(
        "token"
      );

      navigate(
        "/citizen-login"
      );
    }
  }, [navigate]);


  // ==================================================
  // SAVE NAME
  // ==================================================

  const handleSaveName = () => {
    const trimmedName =
      name.trim();

    if (!trimmedName) {
      alert(
        language === "Marathi"
          ? "कृपया तुमचे नाव टाका."
          : language === "Hindi"
          ? "कृपया अपना नाम दर्ज करें।"
          : "Please enter your name."
      );

      return;
    }

    const updatedUser = {
      ...user,
      name: trimmedName,
    };

    setUser(updatedUser);

    localStorage.setItem(
      "user",
      JSON.stringify(
        updatedUser
      )
    );

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        id:
          updatedUser.id ||
          updatedUser._id ||
          null,

        name:
          trimmedName,

        email:
          updatedUser.email ||
          "",

        mobile:
          updatedUser.mobile ||
          "",

        role:
          updatedUser.role ||
          "citizen",
      })
    );

    setName(trimmedName);

    setIsEditing(false);

    alert(
      language === "Marathi"
        ? "नाव यशस्वीपणे अपडेट झाले!"
        : language === "Hindi"
        ? "नाम सफलतापूर्वक अपडेट हो गया!"
        : "Name updated successfully!"
    );
  };


  // ==================================================
  // CANCEL EDIT
  // ==================================================

  const handleCancelEdit = () => {
    setName(
      user.name || ""
    );

    setIsEditing(false);
  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "currentUser"
    );

    navigate(
      "/citizen-login"
    );
  };


  // ==================================================
  // LOADING
  // ==================================================

  if (!user) {
    return (
      <div className="container mt-5">

        <div className="text-center">

          <h4>
            {language === "Marathi"
              ? "प्रोफाइल लोड होत आहे..."
              : language === "Hindi"
              ? "प्रोफ़ाइल लोड हो रही है..."
              : "Loading profile..."}
          </h4>

        </div>

      </div>
    );
  }


  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div
      className="container-fluid p-0"
    >

      <div className="row g-0">

        {/* ==================================================
            SIDEBAR
        ================================================== */}

        <div
          className="col-md-2"
          style={{
            backgroundColor:
              "#212529",
            minHeight:
              "100vh",
            padding:
              "20px 16px",
          }}
        >

          <div className="text-center mb-4">

            <FaHome
              size={35}
              color="#198754"
              className="mb-2"
            />

            <h4 className="text-white mb-0">
              CivicPulse AI
            </h4>

            <small
              style={{
                color:
                  "#adb5bd",
              }}
            >
              {t.citizenPortal}
            </small>

          </div>


          {/* MENU */}

          <div className="d-grid gap-2">

            <Link
              to="/citizen-dashboard"
              className="btn btn-dark text-start text-white"
            >
              <FaHome className="me-2" />
              {t.dashboard}
            </Link>


            <Link
              to="/my-complaints"
              className="btn btn-dark text-start text-white"
            >
              <FaClipboardList className="me-2" />
              {t.myComplaints}
            </Link>


            <Link
              to="/report-complaint"
              className="btn btn-dark text-start text-white"
            >
              <FaPlus className="me-2" />
              {t.reportComplaint}
            </Link>


            <Link
              to="/citizen-profile"
              className="btn btn-success text-start"
            >
              <FaUserCircle className="me-2" />
              {t.profile}
            </Link>


            <button
              type="button"
              className="btn btn-dark text-start text-white"
            >
              <FaQuestionCircle className="me-2" />
              {t.helpSupport}
            </button>


            <button
              type="button"
              className="btn btn-danger text-start mt-3"
              onClick={
                handleLogout
              }
            >
              <FaSignOutAlt className="me-2" />
              {t.logout}
            </button>

          </div>

        </div>


        {/* ==================================================
            PROFILE CONTENT
        ================================================== */}

        <div className="col-md-10">

          <div
            className="container mt-5 mb-5"
            style={{
              maxWidth:
                "750px",
            }}
          >

            {/* BACK */}

            <div className="mb-3">

              <Link
                to="/citizen-dashboard"
                className="btn btn-outline-secondary"
              >
                <FaArrowLeft className="me-2" />

                {language === "Marathi"
                  ? "डॅशबोर्डवर परत जा"
                  : language === "Hindi"
                  ? "डैशबोर्ड पर वापस जाएँ"
                  : "Back to Dashboard"}
              </Link>

            </div>


            {/* CARD */}

            <div className="card shadow-lg border-0">

              {/* HEADER */}

              <div className="card-header bg-success text-white p-4">

                <div className="d-flex align-items-center">

                  <FaUserCircle
                    size={60}
                    className="me-3"
                  />

                  <div>

                    <h3 className="mb-1">
                      {t.citizenProfile}
                    </h3>

                    <small>
                      {language === "Marathi"
                        ? "तुमची खाते माहिती व्यवस्थापित करा"
                        : language === "Hindi"
                        ? "अपने खाते की जानकारी प्रबंधित करें"
                        : "Manage your account information"}
                    </small>

                  </div>

                </div>

              </div>


              {/* BODY */}

              <div className="card-body p-4">

                {/* ==================================================
                    FULL NAME
                ================================================== */}

                <div className="mb-4">

                  <label className="fw-bold mb-2">

                    <FaUserCircle className="text-success me-2" />

                    {t.fullName}

                  </label>


                  {isEditing ? (

                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) =>
                        setName(
                          e.target.value
                        )
                      }
                    />

                  ) : (

                    <div className="form-control bg-light">
                      {user.name ||
                        "-"}
                    </div>

                  )}

                </div>


                {/* ==================================================
                    EMAIL
                ================================================== */}

                <div className="mb-4">

                  <label className="fw-bold mb-2">

                    <FaEnvelope className="text-success me-2" />

                    {t.email}

                  </label>

                  <div className="form-control bg-light">

                    {user.email ||
                      "-"}

                  </div>

                </div>


                {/* ==================================================
                    MOBILE
                ================================================== */}

                <div className="mb-4">

                  <label className="fw-bold mb-2">

                    <FaIdCard className="text-success me-2" />

                    {t.mobileNumber}

                  </label>

                  <div className="form-control bg-light">

                    {user.mobile ||
                      "-"}

                  </div>

                </div>


                {/* ==================================================
                    ROLE
                ================================================== */}

                <div className="mb-4">

                  <label className="fw-bold mb-2">

                    <FaUserShield className="text-success me-2" />

                    {language === "Marathi"
                      ? "भूमिका"
                      : language === "Hindi"
                      ? "भूमिका"
                      : "Role"}

                  </label>

                  <div className="form-control bg-light text-capitalize">

                    {user.role ||
                      "citizen"}

                  </div>

                </div>


                {/* ==================================================
                    ACTIONS
                ================================================== */}

                <div className="d-flex flex-wrap gap-2">

                  {!isEditing ? (

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() =>
                        setIsEditing(
                          true
                        )
                      }
                    >

                      <FaEdit className="me-2" />

                      {language === "Marathi"
                        ? "नाव संपादित करा"
                        : language === "Hindi"
                        ? "नाम संपादित करें"
                        : "Edit Name"}

                    </button>

                  ) : (

                    <>

                      <button
                        type="button"
                        className="btn btn-success"
                        onClick={
                          handleSaveName
                        }
                      >

                        <FaSave className="me-2" />

                        {language === "Marathi"
                          ? "जतन करा"
                          : language === "Hindi"
                          ? "सहेजें"
                          : "Save"}

                      </button>


                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={
                          handleCancelEdit
                        }
                      >

                        <FaTimes className="me-2" />

                        {t.cancel}

                      </button>

                    </>

                  )}


                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={
                      handleLogout
                    }
                  >

                    <FaSignOutAlt className="me-2" />

                    {t.logout}

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default CitizenProfile;