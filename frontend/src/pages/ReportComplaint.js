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
import { useNavigate } from "react-router-dom";

import "leaflet/dist/leaflet.css";

import {
  FaMapMarkerAlt,
  FaMap,
  FaImage,
  FaPaperPlane,
  FaFileAlt,
} from "react-icons/fa";

import {
  useAppSettings,
} from "../components/TopUtilityBar";

const reportText = {
  English: {
    reportComplaint: "Report Complaint",
    category: "Complaint Category",
    selectCategory: "Select Category",
    garbageWaste: "Garbage & Waste Management",
    roadDamage: "Road Damage / Potholes",
    streetLight: "Street Light",
    drainage: "Drainage & Sewerage",
    waterSupply: "Water Supply",
    other: "Other",
    description: "Description",
    describeIssue: "Describe the issue in detail...",
    uploadImage: "Upload Image",
    maximumImageSize: "Maximum image size: 5 MB",
    imagePreview: "Image Preview",
    complaintLocation: "Complaint Location",
    enterLocation: "Enter location e.g. Thane",
    gettingLocation: "Getting Location...",
    useCurrentLocation: "Use Current Location",
    searchingLocation: "Searching location...",
    selectLocationOnMap: "Select Location on Map",
    mapHelp: "Type a location above and the map will automatically move there. You can also click directly on the map.",
    submitting: "Submitting...",
    submitComplaint: "Submit Complaint",
    imageTooLarge: "Image size must be less than 5 MB.",
    geolocationUnsupported: "Geolocation is not supported by your browser.",
    locationUnavailable: "Unable to get your current location.",
    locationPermissionDenied: "Location permission denied. Please allow location access.",
    locationNotFound: "Your current location could not be determined.",
    locationTimedOut: "Location request timed out. Please try again.",
    selectCategoryError: "Please select a category",
    describeComplaintError: "Please describe the complaint",
    locationRequired: "Complaint location is required",
    loginRequired: "You are not logged in. Please login first.",
    validMapLocation: "Please select a valid location from the map.",
    complaintSubmitted: "Complaint submitted successfully!",
    submitFailed: "Failed to submit complaint.",
    serverUnavailable: "Unable to connect to the server.",
  },
  Hindi: {
    reportComplaint: "शिकायत दर्ज करें", category: "शिकायत श्रेणी", selectCategory: "श्रेणी चुनें",
    garbageWaste: "कचरा प्रबंधन", roadDamage: "सड़क की क्षति / गड्ढे", streetLight: "स्ट्रीट लाइट", drainage: "जल निकासी और सीवरेज", waterSupply: "जल आपूर्ति", other: "अन्य",
    description: "विवरण", describeIssue: "समस्या का विस्तार से वर्णन करें...", uploadImage: "छवि अपलोड करें", maximumImageSize: "अधिकतम छवि आकार: 5 MB", imagePreview: "छवि पूर्वावलोकन",
    complaintLocation: "शिकायत का स्थान", enterLocation: "स्थान दर्ज करें, जैसे ठाणे", gettingLocation: "स्थान लिया जा रहा है...", useCurrentLocation: "वर्तमान स्थान का उपयोग करें", searchingLocation: "स्थान खोजा जा रहा है...", selectLocationOnMap: "मानचित्र पर स्थान चुनें", mapHelp: "ऊपर स्थान लिखें और मानचित्र अपने-आप वहाँ जाएगा। आप मानचित्र पर सीधे क्लिक भी कर सकते हैं।", submitting: "जमा हो रहा है...", submitComplaint: "शिकायत जमा करें",
    imageTooLarge: "छवि का आकार 5 MB से कम होना चाहिए।", geolocationUnsupported: "आपका ब्राउज़र स्थान सुविधा का समर्थन नहीं करता।", locationUnavailable: "वर्तमान स्थान प्राप्त नहीं हो सका।", locationPermissionDenied: "स्थान की अनुमति नहीं मिली। कृपया अनुमति दें।", locationNotFound: "वर्तमान स्थान निर्धारित नहीं किया जा सका।", locationTimedOut: "स्थान अनुरोध का समय समाप्त हो गया। फिर से प्रयास करें।", selectCategoryError: "कृपया एक श्रेणी चुनें", describeComplaintError: "कृपया शिकायत का वर्णन करें", locationRequired: "शिकायत का स्थान आवश्यक है", loginRequired: "आप लॉग इन नहीं हैं। पहले लॉग इन करें।", validMapLocation: "कृपया मानचित्र से मान्य स्थान चुनें।", complaintSubmitted: "शिकायत सफलतापूर्वक जमा हो गई!", submitFailed: "शिकायत जमा नहीं हो सकी।", serverUnavailable: "सर्वर से कनेक्ट नहीं हो सका।",
  },
  Marathi: {
    reportComplaint: "तक्रार नोंदवा", category: "तक्रारीची श्रेणी", selectCategory: "श्रेणी निवडा",
    garbageWaste: "कचरा व्यवस्थापन", roadDamage: "रस्त्याचे नुकसान / खड्डे", streetLight: "पथदिवा", drainage: "निचरा आणि सांडपाणी", waterSupply: "पाणी पुरवठा", other: "इतर",
    description: "तपशील", describeIssue: "समस्येचे सविस्तर वर्णन करा...", uploadImage: "फोटो अपलोड करा", maximumImageSize: "फोटोची कमाल आकारमर्यादा: 5 MB", imagePreview: "फोटोचे पूर्वावलोकन",
    complaintLocation: "तक्रारीचे ठिकाण", enterLocation: "ठिकाण टाका, उदा. ठाणे", gettingLocation: "ठिकाण घेत आहे...", useCurrentLocation: "सध्याचे ठिकाण वापरा", searchingLocation: "ठिकाण शोधत आहे...", selectLocationOnMap: "नकाशावर ठिकाण निवडा", mapHelp: "वर ठिकाण टाका; नकाशा आपोआप तेथे जाईल. तुम्ही नकाशावर थेट क्लिकही करू शकता.", submitting: "नोंदवत आहे...", submitComplaint: "तक्रार नोंदवा",
    imageTooLarge: "फोटोचा आकार 5 MB पेक्षा कमी असावा.", geolocationUnsupported: "तुमचा ब्राउझर स्थान सुविधा समर्थित करत नाही.", locationUnavailable: "तुमचे सध्याचे ठिकाण मिळू शकले नाही.", locationPermissionDenied: "स्थानाची परवानगी नाकारली गेली. कृपया परवानगी द्या.", locationNotFound: "सध्याचे ठिकाण निश्चित करता आले नाही.", locationTimedOut: "ठिकाणाच्या विनंतीची वेळ संपली. पुन्हा प्रयत्न करा.", selectCategoryError: "कृपया एक श्रेणी निवडा", describeComplaintError: "कृपया तक्रारीचे वर्णन करा", locationRequired: "तक्रारीचे ठिकाण आवश्यक आहे", loginRequired: "तुम्ही लॉग इन केलेले नाही. आधी लॉग इन करा.", validMapLocation: "कृपया नकाशावरून वैध ठिकाण निवडा.", complaintSubmitted: "तक्रार यशस्वीपणे नोंदवली गेली!", submitFailed: "तक्रार नोंदवता आली नाही.", serverUnavailable: "सर्व्हरशी कनेक्ट होता आले नाही.",
  },
};

// =====================================
// FIX LEAFLET MARKER ICON
// =====================================

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});




// =====================================
// GET ADDRESS FROM LATITUDE / LONGITUDE
// =====================================

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
      throw new Error("Failed to get address");
    }

    const data = await response.json();

    if (data.display_name) {
      return data.display_name;
    }

    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

  } catch (error) {
    console.error(
      "Reverse geocoding error:",
      error
    );

    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
  }
};


// =====================================
// GET COORDINATES FROM LOCATION NAME
// =====================================

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
      latitude: parseFloat(data[0].lat),
      longitude: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };

  } catch (error) {
    console.error(
      "Location search error:",
      error
    );

    return null;
  }
};


// =====================================
// LOCATION MARKER
// =====================================

function LocationMarker({
  position,
  setPosition,
  setLocation,
  setCoordinates,
  setErrors,
}) {

  useMapEvents({

    click: async (e) => {

      const { lat, lng } = e.latlng;

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
        `${lat.toFixed(6)}, ${lng.toFixed(6)}`
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


// =====================================
// UPDATE MAP POSITION
// =====================================

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


// =====================================
// REPORT COMPLAINT
// =====================================

function ReportComplaint() {

  const navigate = useNavigate();
  const { language, darkMode } = useAppSettings();
  const t = reportText[language] || reportText.English;


  // =====================================
  // FORM DATA
  // =====================================

  const [complaint, setComplaint] =
    useState({
      category: "",
      description: "",
      location: "",
      image: null,
    });


  // =====================================
  // IMAGE PREVIEW
  // =====================================

  const [imagePreview, setImagePreview] =
    useState("");


  // =====================================
  // ERRORS
  // =====================================

  const [errors, setErrors] =
    useState({});


  // =====================================
  // MAP POSITION
  // =====================================

  const [position, setPosition] =
    useState(null);


  // =====================================
  // COORDINATES
  // =====================================

  const [coordinates, setCoordinates] =
    useState({
      latitude: null,
      longitude: null,
    });


  // =====================================
  // LOCATION LOADING
  // =====================================

  const [gettingLocation, setGettingLocation] =
    useState(false);


  // =====================================
  // SUBMIT LOADING
  // =====================================

  const [submitting, setSubmitting] =
    useState(false);


  // =====================================
  // LOCATION SEARCH LOADING
  // =====================================

  const [searchingLocation, setSearchingLocation] =
    useState(false);


  // =====================================
  // HANDLE INPUT CHANGE
  // =====================================

  const handleChange = (e) => {

    const {
      name,
      value,
      files,
    } = e.target;


    // ===================================
    // IMAGE
    // ===================================

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


      // =================================
      // 5 MB IMAGE LIMIT
      // =================================

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


      // =================================
      // VALID IMAGE
      // =================================

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


    // ===================================
    // NORMAL INPUT
    // ===================================

    setComplaint((prev) => ({
      ...prev,
      [name]: value,
    }));


    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };


  // =====================================
  // AUTOMATIC LOCATION SEARCH
  // =====================================
  //
  // Example:
  // Thane
  // Anand Nagar, Thane
  // Mumbai
  //
  // Map automatically moves.
  // =====================================

  useEffect(() => {

    const location =
      complaint.location.trim();


    if (!location) {
      return;
    }


    // Don't search coordinates
    // when location is already an
    // automatically generated address.

    const timer = setTimeout(
      async () => {

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
          setPosition(newPosition);


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

      },
      1000
    );


    return () => {
      clearTimeout(timer);
    };

  }, [complaint.location]);


  // =====================================
  // CURRENT LOCATION
  // =====================================

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
        setPosition(newPosition);


        // Coordinates
        setCoordinates({
          latitude,
          longitude,
        });


        // Temporary coordinates
        setComplaint((prev) => ({
          ...prev,
          location:
            `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
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


  // =====================================
  // SUBMIT
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();


    const newErrors = {};


    // Category
    if (!complaint.category) {

      newErrors.category =
        t.selectCategoryError;
    }


    // Description
    if (!complaint.description.trim()) {

      newErrors.description =
        t.describeComplaintError;
    }


    // Location
    if (!complaint.location.trim()) {

      newErrors.location =
        t.locationRequired;
    }


    // =================================
    // VALIDATION
    // =================================

    if (
      Object.keys(newErrors).length > 0
    ) {

      setErrors(newErrors);

      return;
    }


    // =================================
    // TOKEN
    // =================================

    const token =
      localStorage.getItem("token");


    if (!token) {

      setErrors({
        general:
          t.loginRequired,
      });

      return;
    }


    // =================================
    // CHECK COORDINATES
    // =================================

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


      // =================================
      // SEND TO BACKEND
      // =================================

      const response =
        await axios.post(
          "http://localhost:5000/api/complaints",
          {
            category:
              complaint.category,

            description:
              complaint.description.trim(),

            location:
              complaint.location.trim(),

            latitude:
              coordinates.latitude,

            longitude:
              coordinates.longitude,

            image:
              complaint.image
                ? complaint.image.name
                : null,
          },
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


      navigate("/my-complaints");


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


  // =====================================
  // PAGE
  // =====================================

  return (

    <div className={darkMode ? "container mt-5 mb-5 text-light" : "container mt-5 mb-5"}>

      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div className={darkMode ? "card shadow-lg bg-dark text-light" : "card shadow-lg"}>


            {/* ================= HEADER ================= */}

            <div className="card-header bg-success text-white">

              <h3 className="mb-0">

                <FaFileAlt className="me-2" />

                {t.reportComplaint}

              </h3>

            </div>


            <div className="card-body p-4">


              {/* GENERAL ERROR */}

              {errors.general && (

                <div className="alert alert-danger">

                  {errors.general}

                </div>

              )}


              <form onSubmit={handleSubmit}>


                {/* ================= CATEGORY ================= */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    {t.category}

                  </label>


                  <select
                    className={`form-select ${
                      errors.category
                        ? "is-invalid"
                        : ""
                    }`}
                    name="category"
                    value={
                      complaint.category
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      {t.selectCategory}
                    </option>

                    <option value="Garbage & Waste Management">
                      {t.garbageWaste}
                    </option>

                    <option value="Road Damage / Potholes">
                      {t.roadDamage}
                    </option>

                    <option value="Street Light">
                      {t.streetLight}
                    </option>

                    <option value="Drainage & Sewerage">
                      {t.drainage}
                    </option>

                    <option value="Water Supply">
                      {t.waterSupply}
                    </option>

                    <option value="Other">
                      {t.other}
                    </option>

                  </select>


                  {errors.category && (

                    <div className="invalid-feedback">

                      {errors.category}

                    </div>

                  )}

                </div>


                {/* ================= DESCRIPTION ================= */}

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
                    placeholder={t.describeIssue}
                  />


                  {errors.description && (

                    <div className="invalid-feedback">

                      {errors.description}

                    </div>

                  )}

                </div>


                {/* ================= IMAGE ================= */}

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
                    accept="image/*"
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
                          objectFit: "cover",
                          borderRadius:
                            "8px",
                          border:
                            "1px solid #ddd",
                        }}
                      />

                    </div>

                  )}

                </div>


                {/* ================= LOCATION ================= */}

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
                      placeholder={t.enterLocation}
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


                {/* ================= MAP ================= */}

                <div className="mb-4">

                  <label className="form-label fw-bold">

                    <FaMap className="me-2" />

                    {t.selectLocationOnMap}

                  </label>


                  <div
                    style={{
                      height: "350px",
                      width: "100%",
                      borderRadius: "10px",
                      overflow: "hidden",
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


                {/* ================= SUBMIT ================= */}

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

      </div>

    </div>
  );
}

export default ReportComplaint;
