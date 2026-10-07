import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";
import { Link, useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";

import {
  FaArrowLeft,
  FaClipboardList,
  FaHome,
  FaImage,
  FaMap,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaQuestionCircle,
  FaSignOutAlt,
  FaUserCircle,
  FaFileAlt,
} from "react-icons/fa";

import {
  useAppSettings,
} from "../components/TopUtilityBar";


// ==================================================
// TRANSLATIONS
// ==================================================

const reportText = {
  English: {
    reportComplaint: "Report Complaint",
    category: "Complaint Category",
    categoryPending: "Automatically assigned from your description",
    description: "Description",
    describeIssue: "Describe the issue in detail...",
    aiInsights: "AI Complaint Insights",
    aiInsightsHelp: "ML predictions trained on complaint examples. Review the suggested category and priority before submitting.",
    analyzing: "Analyzing complaint...",
    predictedCategory: "Suggested category",
    departmentPrediction: "Assigned department",
    predictedPriority: "Estimated priority",
    possibleDuplicate: "Possible duplicate / same issue",
    relatedComplaintsFound: "related complaints found",
    criticalPriority: "Critical",
    analysisUnavailable: "AI suggestions are temporarily unavailable.",
    highPriority: "High",
    mediumPriority: "Medium",
    lowPriority: "Low",
    uploadImage: "Upload Image",
    maximumImageSize: "Maximum image size: 5 MB",
    imagePreview: "Image Preview",
    complaintLocation: "Complaint Location",
    enterLocation: "Enter location e.g. Thane",
    gettingLocation: "Getting Location...",
    useCurrentLocation: "Use Current Location",
    searchingLocation: "Searching location...",
    selectLocationOnMap: "Select Location on Map",
    mapHelp:
      "Type a location above and the map will automatically move there. You can also click directly on the map.",
    submitting: "Submitting...",
    submitComplaint: "Submit Complaint",
    imageTooLarge: "Image size must be less than 5 MB.",
    geolocationUnsupported:
      "Geolocation is not supported by your browser.",
    locationUnavailable:
      "Unable to get your current location.",
    locationPermissionDenied:
      "Location permission denied. Please allow location access.",
    locationNotFound:
      "Your current location could not be determined.",
    locationTimedOut:
      "Location request timed out. Please try again.",
    describeComplaintError:
      "Please describe the complaint",
    locationRequired:
      "Complaint location is required",
    loginRequired:
      "You are not logged in. Please login first.",
    validMapLocation:
      "Please select a valid location from the map.",
    complaintSubmitted:
      "Complaint submitted successfully!",
    submitFailed:
      "Failed to submit complaint.",
    serverUnavailable:
      "Unable to connect to the server.",
  },

  Hindi: {
    reportComplaint: "शिकायत दर्ज करें",
    category: "शिकायत श्रेणी",
    categoryPending: "आपके विवरण के आधार पर अपने-आप तय होगी",
    description: "विवरण",
    describeIssue:
      "समस्या का विस्तार से वर्णन करें...",
    aiInsights: "एआई शिकायत जानकारी",
    aiInsightsHelp: "शिकायत उदाहरणों पर प्रशिक्षित एमएल अनुमान। जमा करने से पहले श्रेणी और प्राथमिकता की समीक्षा करें।",
    analyzing: "शिकायत का विश्लेषण हो रहा है...",
    predictedCategory: "सुझाई गई श्रेणी",
    departmentPrediction: "सौंपा गया विभाग",
    predictedPriority: "अनुमानित प्राथमिकता",
    possibleDuplicate: "संभावित डुप्लिकेट / समान समस्या",
    relatedComplaintsFound: "संबंधित शिकायतें मिलीं",
    criticalPriority: "गंभीर",
    analysisUnavailable: "एआई सुझाव अभी उपलब्ध नहीं हैं।",
    highPriority: "उच्च",
    mediumPriority: "मध्यम",
    lowPriority: "कम",
    uploadImage: "छवि अपलोड करें",
    maximumImageSize:
      "अधिकतम छवि आकार: 5 MB",
    imagePreview: "छवि पूर्वावलोकन",
    complaintLocation: "शिकायत का स्थान",
    enterLocation:
      "स्थान दर्ज करें, जैसे ठाणे",
    gettingLocation:
      "स्थान लिया जा रहा है...",
    useCurrentLocation:
      "वर्तमान स्थान का उपयोग करें",
    searchingLocation:
      "स्थान खोजा जा रहा है...",
    selectLocationOnMap:
      "मानचित्र पर स्थान चुनें",
    mapHelp:
      "ऊपर स्थान लिखें और मानचित्र अपने-आप वहाँ जाएगा। आप मानचित्र पर सीधे क्लिक भी कर सकते हैं।",
    submitting: "जमा हो रहा है...",
    submitComplaint: "शिकायत जमा करें",
    imageTooLarge:
      "छवि का आकार 5 MB से कम होना चाहिए।",
    geolocationUnsupported:
      "आपका ब्राउज़र स्थान सुविधा का समर्थन नहीं करता।",
    locationUnavailable:
      "वर्तमान स्थान प्राप्त नहीं हो सका।",
    locationPermissionDenied:
      "स्थान की अनुमति नहीं मिली। कृपया अनुमति दें।",
    locationNotFound:
      "वर्तमान स्थान निर्धारित नहीं किया जा सका।",
    locationTimedOut:
      "स्थान अनुरोध का समय समाप्त हो गया। फिर से प्रयास करें।",
    describeComplaintError:
      "कृपया शिकायत का वर्णन करें",
    locationRequired:
      "शिकायत का स्थान आवश्यक है",
    loginRequired:
      "आप लॉग इन नहीं हैं। पहले लॉग इन करें।",
    validMapLocation:
      "कृपया मानचित्र से मान्य स्थान चुनें।",
    complaintSubmitted:
      "शिकायत सफलतापूर्वक जमा हो गई!",
    submitFailed:
      "शिकायत जमा नहीं हो सकी।",
    serverUnavailable:
      "सर्वर से कनेक्ट नहीं हो सका।",
  },

  Marathi: {
    reportComplaint: "तक्रार नोंदवा",
    category: "तक्रारीची श्रेणी",
    categoryPending: "तुमच्या वर्णनावरून आपोआप ठरवली जाईल",
    description: "तपशील",
    describeIssue:
      "समस्येचे सविस्तर वर्णन करा...",
    aiInsights: "एआय तक्रार माहिती",
    aiInsightsHelp: "तक्रारींच्या उदाहरणांवर प्रशिक्षित एमएल अंदाज. सबमिट करण्यापूर्वी श्रेणी आणि प्राधान्य तपासा.",
    analyzing: "तक्रारीचे विश्लेषण सुरू आहे...",
    predictedCategory: "सुचवलेली श्रेणी",
    departmentPrediction: "नियुक्त विभाग",
    predictedPriority: "अंदाजित प्राधान्य",
    possibleDuplicate: "संभाव्य डुप्लिकेट / समान समस्या",
    relatedComplaintsFound: "संबंधित तक्रारी सापडल्या",
    criticalPriority: "गंभीर",
    analysisUnavailable: "एआय सूचना सध्या उपलब्ध नाहीत.",
    highPriority: "उच्च",
    mediumPriority: "मध्यम",
    lowPriority: "कमी",
    uploadImage: "फोटो अपलोड करा",
    maximumImageSize:
      "फोटोची कमाल आकारमर्यादा: 5 MB",
    imagePreview: "फोटोचे पूर्वावलोकन",
    complaintLocation: "तक्रारीचे ठिकाण",
    enterLocation:
      "ठिकाण टाका, उदा. ठाणे",
    gettingLocation:
      "ठिकाण घेत आहे...",
    useCurrentLocation:
      "सध्याचे ठिकाण वापरा",
    searchingLocation:
      "ठिकाण शोधत आहे...",
    selectLocationOnMap:
      "नकाशावर ठिकाण निवडा",
    mapHelp:
      "वर ठिकाण टाका; नकाशा आपोआप तेथे जाईल. तुम्ही नकाशावर थेट क्लिकही करू शकता.",
    submitting: "नोंदवत आहे...",
    submitComplaint: "तक्रार नोंदवा",
    imageTooLarge:
      "फोटोचा आकार 5 MB पेक्षा कमी असावा.",
    geolocationUnsupported:
      "तुमचा ब्राउझर स्थान सुविधा समर्थित करत नाही.",
    locationUnavailable:
      "तुमचे सध्याचे ठिकाण मिळू शकले नाही.",
    locationPermissionDenied:
      "स्थानाची परवानगी नाकारली गेली. कृपया परवानगी द्या.",
    locationNotFound:
      "सध्याचे ठिकाण निश्चित करता आले नाही.",
    locationTimedOut:
      "ठिकाणाच्या विनंतीची वेळ संपली. पुन्हा प्रयत्न करा.",
    describeComplaintError:
      "कृपया तक्रारीचे वर्णन करा",
    locationRequired:
      "तक्रारीचे ठिकाण आवश्यक आहे",
    loginRequired:
      "तुम्ही लॉग इन केलेले नाही. आधी लॉग इन करा.",
    validMapLocation:
      "कृपया नकाशावरून वैध ठिकाण निवडा.",
    complaintSubmitted:
      "तक्रार यशस्वीपणे नोंदवली गेली!",
    submitFailed:
      "तक्रार नोंदवता आली नाही.",
    serverUnavailable:
      "सर्व्हरशी कनेक्ट होता आले नाही.",
  },
};


// ==================================================
// FIX LEAFLET MARKER ICON
// ==================================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


// ==================================================
// GET ADDRESS FROM LATITUDE / LONGITUDE
// ==================================================

const getAddressFromCoordinates = async (
  latitude,
  longitude
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to get address"
      );
    }

    const data = await response.json();

    if (data.display_name) {
      return data.display_name;
    }

    return `${latitude.toFixed(
      6
    )}, ${longitude.toFixed(6)}`;
  } catch (error) {
    console.error(
      "Reverse geocoding error:",
      error
    );

    return `${latitude.toFixed(
      6
    )}, ${longitude.toFixed(6)}`;
  }
};


// ==================================================
// GET COORDINATES FROM LOCATION NAME
// ==================================================

const getCoordinatesFromLocation = async (
  location
) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        location
      )}&limit=1`,
      {
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Location search failed"
      );
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      return null;
    }

    return {
      latitude: parseFloat(
        data[0].lat
      ),
      longitude: parseFloat(
        data[0].lon
      ),
      displayName:
        data[0].display_name,
    };
  } catch (error) {
    console.error(
      "Location search error:",
      error
    );

    return null;
  }
};


// ==================================================
// LOCATION MARKER
// ==================================================

function LocationMarker({
  position,
  setPosition,
  setLocation,
  setCoordinates,
  setErrors,
}) {
  useMapEvents({
    click: async (e) => {
      const { lat, lng } =
        e.latlng;

      const newPosition = [
        lat,
        lng,
      ];

      // Move marker
      setPosition(newPosition);

      // Save coordinates
      setCoordinates({
        latitude: lat,
        longitude: lng,
      });

      // Clear error
      setErrors((prev) => ({
        ...prev,
        location: "",
      }));

      // Show coordinates immediately
      setLocation(
        `${lat.toFixed(
          6
        )}, ${lng.toFixed(6)}`
      );

      // Get readable address
      const address =
        await getAddressFromCoordinates(
          lat,
          lng
        );

      setLocation(address);
    },
  });

  if (!position) {
    return null;
  }

  return (
    <Marker position={position} />
  );
}


// ==================================================
// UPDATE MAP POSITION
// ==================================================

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(
        position,
        15,
        {
          duration: 1.2,
        }
      );
    }
  }, [position, map]);

  return null;
}


// ==================================================
// REPORT COMPLAINT
// ==================================================

function ReportComplaint() {
  const navigate = useNavigate();

  const {
    language,
    darkMode,
  } = useAppSettings();

  const t =
    reportText[language] ||
    reportText.English;


  // ==================================================
  // FORM DATA
  // ==================================================

  const [complaint, setComplaint] =
    useState({
      description: "",
      location: "",
      image: null,
    });


  // ==================================================
  // IMAGE PREVIEW
  // ==================================================

  const [imagePreview, setImagePreview] =
    useState("");


  // ==================================================
  // ERRORS
  // ==================================================

  const [errors, setErrors] =
    useState({});


  // ==================================================
  // MAP POSITION
  // ==================================================

  const [position, setPosition] =
    useState(null);


  // ==================================================
  // COORDINATES
  // ==================================================

  const [coordinates, setCoordinates] =
    useState({
      latitude: null,
      longitude: null,
    });


  // ==================================================
  // LOCATION LOADING
  // ==================================================

  const [gettingLocation, setGettingLocation] =
    useState(false);


  // ==================================================
  // SUBMIT LOADING
  // ==================================================

  const [submitting, setSubmitting] =
    useState(false);


  // ==================================================
  // LOCATION SEARCH LOADING
  // ==================================================

  const [searchingLocation, setSearchingLocation] =
    useState(false);

  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [analyzingComplaint, setAnalyzingComplaint] = useState(false);
  const [aiAnalysisUnavailable, setAiAnalysisUnavailable] = useState(false);


  // ==================================================
  // AI-ASSISTED PREDICTIONS
  // ==================================================

  useEffect(() => {
    const description = complaint.description.trim();

    if (description.length < 3) {
      setAiAnalysis(null);
      setAnalyzingComplaint(false);
      setAiAnalysisUnavailable(false);
      return undefined;
    }

    const controller = new AbortController();
    let active = true;

    setAiAnalysis(null);
    setAnalyzingComplaint(true);
    setAiAnalysisUnavailable(false);

    const timer = setTimeout(async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setAiAnalysis(null);
          setAiAnalysisUnavailable(true);
          return;
        }

        const response = await axios.post(
          "http://localhost:5000/api/complaints/analyze",
          {
            description,
            location: complaint.location,
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        if (active) {
          setAiAnalysis(response.data);
        }
      } catch (error) {
        if (active && !axios.isCancel(error)) {
          console.error("Complaint AI analysis request failed:", error);
          setAiAnalysis(null);
          setAiAnalysisUnavailable(true);
        }
      } finally {
        if (active) {
          setAnalyzingComplaint(false);
        }
      }
    }, 500);

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    complaint.description,
    complaint.location,
    coordinates.latitude,
    coordinates.longitude,
  ]);


  // ==================================================
  // HANDLE INPUT CHANGE
  // ==================================================

  const handleChange = (e) => {
    const {
      name,
      value,
      files,
    } = e.target;


    // ==================================================
    // IMAGE
    // ==================================================

    if (name === "image") {
      const file =
        files && files[0];

      if (!file) {
        setComplaint((prev) => ({
          ...prev,
          image: null,
        }));

        setImagePreview("");

        setErrors((prev) => ({
          ...prev,
          image: "",
        }));

        return;
      }


      // ==================================================
      // 5 MB IMAGE LIMIT
      // ==================================================

      const maxSize =
        5 * 1024 * 1024;

      if (file.size > maxSize) {
        setErrors((prev) => ({
          ...prev,
          image:
            t.imageTooLarge,
        }));

        e.target.value = "";

        setComplaint((prev) => ({
          ...prev,
          image: null,
        }));

        setImagePreview("");

        return;
      }


      // ==================================================
      // VALID IMAGE
      // ==================================================

      setErrors((prev) => ({
        ...prev,
        image: "",
      }));

      setComplaint((prev) => ({
        ...prev,
        image: file,
      }));

      setImagePreview(
        URL.createObjectURL(file)
      );

      return;
    }


    // ==================================================
    // NORMAL INPUT
    // ==================================================

    setComplaint((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  // ==================================================
  // AUTOMATIC LOCATION SEARCH
  // ==================================================

  useEffect(() => {
    const location =
      complaint.location.trim();

    if (!location) {
      return;
    }

    const timer =
      setTimeout(async () => {
        setSearchingLocation(true);

        const result =
          await getCoordinatesFromLocation(
            location
          );

        if (result) {
          const newPosition = [
            result.latitude,
            result.longitude,
          ];

          // Update map marker
          setPosition(
            newPosition
          );

          // Save coordinates
          setCoordinates({
            latitude:
              result.latitude,
            longitude:
              result.longitude,
          });

          setErrors((prev) => ({
            ...prev,
            location: "",
          }));
        }

        setSearchingLocation(false);
      }, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [complaint.location]);


  // ==================================================
  // CURRENT LOCATION
  // ==================================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        location:
          t.geolocationUnsupported,
      }));

      return;
    }

    setGettingLocation(true);

    setErrors((prev) => ({
      ...prev,
      location: "",
    }));

    navigator.geolocation.getCurrentPosition(
      async (locationData) => {
        const latitude =
          locationData.coords.latitude;

        const longitude =
          locationData.coords.longitude;

        const newPosition = [
          latitude,
          longitude,
        ];

        // Map position
        setPosition(
          newPosition
        );

        // Coordinates
        setCoordinates({
          latitude,
          longitude,
        });

        // Temporary coordinates
        setComplaint((prev) => ({
          ...prev,
          location:
            `${latitude.toFixed(
              6
            )}, ${longitude.toFixed(6)}`,
        }));

        try {
          const address =
            await getAddressFromCoordinates(
              latitude,
              longitude
            );

          setComplaint((prev) => ({
            ...prev,
            location: address,
          }));
        } catch (error) {
          console.error(error);
        } finally {
          setGettingLocation(false);
        }
      },

      (error) => {
        console.error(
          "Location error:",
          error
        );

        let message =
          t.locationUnavailable;

        if (error.code === 1) {
          message =
            t.locationPermissionDenied;
        } else if (error.code === 2) {
          message =
            t.locationNotFound;
        } else if (error.code === 3) {
          message =
            t.locationTimedOut;
        }

        setErrors((prev) => ({
          ...prev,
          location: message,
        }));

        setGettingLocation(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };


  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};


    // ==================================================
    // DESCRIPTION
    // ==================================================

    if (
      !complaint.description.trim()
    ) {
      newErrors.description =
        t.describeComplaintError;
    }


    // ==================================================
    // LOCATION
    // ==================================================

    if (
      !complaint.location.trim()
    ) {
      newErrors.location =
        t.locationRequired;
    }


    // ==================================================
    // VALIDATION
    // ==================================================

    if (
      Object.keys(newErrors).length > 0
    ) {
      setErrors(newErrors);
      return;
    }


    // ==================================================
    // TOKEN
    // ==================================================

    const token =
      localStorage.getItem("token");

    if (!token) {
      setErrors({
        general:
          t.loginRequired,
      });

      return;
    }


    // ==================================================
    // CHECK COORDINATES
    // ==================================================

    if (
      coordinates.latitude === null ||
      coordinates.longitude === null
    ) {
      setErrors({
        location:
          t.validMapLocation,
      });

      return;
    }


    try {
      setSubmitting(true);
      setErrors({});


      // ==================================================
      // SEND TO BACKEND
      // ==================================================

      const formData = new FormData();
      formData.append(
        "description",
        complaint.description.trim()
      );
      formData.append("location", complaint.location.trim());
      formData.append("latitude", String(coordinates.latitude));
      formData.append("longitude", String(coordinates.longitude));
      if (complaint.image) {
        formData.append("image", complaint.image);
      }

      const response =
        await axios.post(
          "http://localhost:5000/api/complaints",
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );


      console.log(
        "Complaint submitted:",
        response.data
      );


      alert(
        t.complaintSubmitted
      );


      navigate(
        "/my-complaints"
      );

    } catch (error) {
      console.error(
        "Complaint submission error:",
        error
      );

      if (error.response) {
        setErrors({
          general:
            error.response.data.message ||
            t.submitFailed,
        });
      } else {
        setErrors({
          general:
            t.serverUnavailable,
        });
      }

    } finally {
      setSubmitting(false);
    }
  };


  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("currentUser");

    navigate("/citizen-login");
  };


  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div
      className={
        darkMode
          ? "d-flex text-light"
          : "d-flex"
      }
      style={{
        minHeight:
          "calc(100vh - 26px)",
        width: "100%",
        margin: 0,
        padding: 0,
      }}
    >

      {/* ==================================================
          LEFT SIDEBAR
      ================================================== */}

      <aside
        style={{
          width: "220px",
          minWidth: "220px",
          backgroundColor: "#212529",
          minHeight:
            "calc(100vh - 26px)",
          padding:
            "20px 14px",
          position: "relative",
          flexShrink: 0,
        }}
      >

        {/* LOGO */}
        <div className="text-center mb-4">

          <FaHome
            size={38}
            color="#198754"
            className="mb-2"
          />

          <h4
            className="text-white mb-0"
            style={{
              fontWeight: "600",
            }}
          >
            CivicPulse AI
          </h4>

          <small
            style={{
              color: "#adb5bd",
            }}
          >
            Citizen Portal
          </small>

        </div>


        {/* SIDEBAR NAVIGATION */}

        <nav
          className="d-flex flex-column gap-2"
          style={{
            minHeight:
              "calc(100vh - 150px)",
          }}
        >

          {/* DASHBOARD */}

          <Link
            to="/citizen-dashboard"
            className="btn btn-dark text-start text-white"
          >
            <FaHome className="me-2" />
            Dashboard
          </Link>


          {/* MY COMPLAINTS */}

          <Link
            to="/my-complaints"
            className="btn btn-dark text-start text-white"
          >
            <FaClipboardList className="me-2" />
            My Complaints
          </Link>


          {/* PROFILE */}

          <Link
            to="/citizen-profile"
            className="btn btn-dark text-start text-white"
          >
            <FaUserCircle className="me-2" />
            Profile
          </Link>


          {/* HELP & SUPPORT */}

          <button
            type="button"
            className="btn btn-dark text-start text-white"
            onClick={() =>
              navigate("/citizen-help")
            }
          >
            <FaQuestionCircle className="me-2" />
            Help & Support
          </button>


          {/* LOGOUT */}

          <button
            type="button"
            className="btn btn-danger text-start mt-3"
            style={{
              position:
                "absolute",
              left: "14px",
              right: "14px",
              bottom: "20px",
            }}
            onClick={handleLogout}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>

        </nav>
      </aside>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main
        style={{
          flex: 1,
          minWidth: 0,
          overflow: "auto",
        }}
      >

        <div
          className={
            darkMode
              ? "container-fluid mt-4 mb-5 text-light"
              : "container-fluid mt-4 mb-5"
          }
          style={{
            maxWidth: "1100px",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >

          {/* BACK BUTTON */}

          <button
            type="button"
            className="btn btn-outline-secondary mb-3"
            onClick={() =>
              navigate(
                "/citizen-dashboard"
              )
            }
          >
            <FaArrowLeft className="me-2" />
            Back to Dashboard
          </button>


          {/* REPORT CARD */}

          <div
            className={
              darkMode
                ? "card shadow-lg bg-dark text-light"
                : "card shadow-lg"
            }
          >

            {/* HEADER */}

            <div className="card-header bg-success text-white">

              <h3 className="mb-0">

                <FaFileAlt className="me-2" />

                {t.reportComplaint}

              </h3>

            </div>


            {/* BODY */}

            <div className="card-body p-4">

              {/* GENERAL ERROR */}

              {errors.general && (
                <div className="alert alert-danger">
                  {errors.general}
                </div>
              )}


              <form
                onSubmit={handleSubmit}
              >

                <div className="mb-3">
                  <label className="form-label fw-bold">
                    {t.category}
                  </label>
                  <div className="form-control bg-light">
                    {aiAnalysis?.categoryPrediction?.category ||
                      t.categoryPending}
                  </div>
                </div>


                {/* ==================================================
                    DESCRIPTION
                ================================================== */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    {t.description}
                  </label>

                  <textarea
                    className={`form-control ${
                      errors.description
                        ? "is-invalid"
                        : ""
                    }`}
                    rows="5"
                    name="description"
                    value={
                      complaint.description
                    }
                    onChange={
                      handleChange
                    }
                    placeholder={
                      t.describeIssue
                    }
                  />

                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description}
                    </div>
                  )}

                </div>

                {(analyzingComplaint ||
                  aiAnalysis ||
                  aiAnalysisUnavailable) && (
                  <section
                    className={`mb-4 p-3 border rounded ${
                      darkMode
                        ? "border-secondary bg-secondary bg-opacity-10"
                        : "border-success bg-success bg-opacity-10"
                    }`}
                    aria-live="polite"
                  >
                    <div className="d-flex justify-content-between align-items-start gap-3">
                      <div>
                        <h5 className="mb-1">{t.aiInsights}</h5>
                        <small className="text-muted">{t.aiInsightsHelp}</small>
                      </div>
                      {analyzingComplaint && (
                        <span className="small text-muted">{t.analyzing}</span>
                      )}
                    </div>

                    {aiAnalysisUnavailable && (
                      <div className="alert alert-warning mt-3 mb-0">
                        {t.analysisUnavailable}
                      </div>
                    )}

                    {aiAnalysis && (
                      <div className="mt-3">
                        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                          <strong>{t.predictedCategory}:</strong>
                          <span>{aiAnalysis.categoryPrediction.category}</span>
                          <span className="small text-muted">
                            ({Math.round(
                              aiAnalysis.categoryPrediction.confidence * 100
                            )}%)
                          </span>
                        </div>

                        <div className="mb-2">
                          <strong>{t.departmentPrediction}:</strong>{" "}
                          {aiAnalysis.departmentPrediction}
                        </div>

                        <div className="mb-2">
                          <strong>{t.predictedPriority}:</strong>{" "}
                          <span
                            className={`badge ${
                              aiAnalysis.priorityPrediction === "Critical" ||
                              aiAnalysis.priorityPrediction === "High"
                                ? "bg-danger"
                                : aiAnalysis.priorityPrediction === "Medium"
                                  ? "bg-warning text-dark"
                                  : "bg-success"
                            }`}
                          >
                            {aiAnalysis.priorityPrediction === "Critical"
                              ? t.criticalPriority
                              : aiAnalysis.priorityPrediction === "High"
                                ? t.highPriority
                              : aiAnalysis.priorityPrediction === "Medium"
                                ? t.mediumPriority
                                : t.lowPriority}
                          </span>
                        </div>

                        {aiAnalysis.possibleDuplicates?.length > 0 && (
                          <div className="alert alert-warning mb-0 mt-3">
                            <strong className="d-block">
                              {t.possibleDuplicate}
                            </strong>
                            <strong className="d-block">
                              {aiAnalysis.possibleDuplicates.length}{" "}
                              {t.relatedComplaintsFound}
                            </strong>
                            {aiAnalysis.possibleDuplicates.slice(0, 4).map((match) => (
                              <div key={match.id}>
                                #{match.id}: {match.title || match.category} —{" "}
                                {match.location} ({match.status})
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                )}


                {/* ==================================================
                    IMAGE
                ================================================== */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    <FaImage className="me-2" />

                    {t.uploadImage}

                  </label>

                  <input
                    type="file"
                    className={`form-control ${
                      errors.image
                        ? "is-invalid"
                        : ""
                    }`}
                    name="image"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={
                      handleChange
                    }
                  />

                  <small className="text-muted">
                    {t.maximumImageSize}
                  </small>

                  {errors.image && (
                    <div className="text-danger small mt-1">
                      {errors.image}
                    </div>
                  )}

                  {imagePreview && (
                    <div className="mt-3">

                      <p className="fw-bold mb-2">
                        {t.imagePreview}
                      </p>

                      <img
                        src={imagePreview}
                        alt="Complaint Preview"
                        style={{
                          width: "200px",
                          height: "150px",
                          objectFit:
                            "cover",
                          borderRadius:
                            "8px",
                          border:
                            "1px solid #ddd",
                        }}
                      />

                    </div>
                  )}

                </div>


                {/* ==================================================
                    LOCATION
                ================================================== */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    <FaMapMarkerAlt className="me-2" />

                    {t.complaintLocation}

                  </label>


                  <div className="input-group">

                    <input
                      type="text"
                      className={`form-control ${
                        errors.location
                          ? "is-invalid"
                          : ""
                      }`}
                      name="location"
                      value={
                        complaint.location
                      }
                      onChange={
                        handleChange
                      }
                      placeholder={
                        t.enterLocation
                      }
                    />


                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={
                        getCurrentLocation
                      }
                      disabled={
                        gettingLocation
                      }
                    >

                      <FaMapMarkerAlt className="me-2" />

                      {gettingLocation
                        ? t.gettingLocation
                        : t.useCurrentLocation}

                    </button>

                  </div>


                  {searchingLocation && (
                    <small className="text-primary">
                      {t.searchingLocation}
                    </small>
                  )}


                  {errors.location && (
                    <div className="text-danger small mt-1">
                      {errors.location}
                    </div>
                  )}

                </div>


                {/* ==================================================
                    MAP
                ================================================== */}

                <div className="mb-4">

                  <label className="form-label fw-bold">

                    <FaMap className="me-2" />

                    {t.selectLocationOnMap}

                  </label>


                  <div
                    style={{
                      height: "350px",
                      width: "100%",
                      borderRadius:
                        "10px",
                      overflow:
                        "hidden",
                      border:
                        "1px solid #ddd",
                    }}
                  >

                    <MapContainer
                      center={[
                        19.076,
                        72.8777,
                      ]}
                      zoom={11}
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    >

                      <TileLayer
                        attribution="&copy; OpenStreetMap contributors"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />


                      <LocationMarker
                        position={
                          position
                        }
                        setPosition={
                          setPosition
                        }
                        setLocation={(
                          location
                        ) =>
                          setComplaint(
                            (prev) => ({
                              ...prev,
                              location,
                            })
                          )
                        }
                        setCoordinates={
                          setCoordinates
                        }
                        setErrors={
                          setErrors
                        }
                      />


                      <MapUpdater
                        position={
                          position
                        }
                      />

                    </MapContainer>

                  </div>


                  <small className="text-muted">
                    {t.mapHelp}
                  </small>

                </div>


                {/* ==================================================
                    SUBMIT
                ================================================== */}

                <div className="d-grid">

                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={
                      submitting
                    }
                  >

                    <FaPaperPlane className="me-2" />

                    {submitting
                      ? t.submitting
                      : t.submitComplaint}

                  </button>

                </div>

              </form>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default ReportComplaint;