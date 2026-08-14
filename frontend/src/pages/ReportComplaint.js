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
// REVERSE GEOCODING
// =====================================

const getAddressFromCoordinates = async (latitude, longitude) => {
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
    console.error("Reverse geocoding error:", error);

    return `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
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
    async click(e) {
      const { lat, lng } = e.latlng;

      const newPosition = [lat, lng];

      setPosition(newPosition);

      setCoordinates({
        latitude: lat,
        longitude: lng,
      });

      // Show coordinates immediately
      setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);

      setErrors((prev) => ({
        ...prev,
        location: "",
      }));

      // Get readable address
      const address = await getAddressFromCoordinates(
        lat,
        lng
      );

      setLocation(address);
    },
  });

  if (position === null) {
    return null;
  }

  return <Marker position={position} />;
}

// =====================================
// UPDATE MAP POSITION
// =====================================

function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 16);
    }
  }, [position, map]);

  return null;
}

// =====================================
// REPORT COMPLAINT
// =====================================

function ReportComplaint() {
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState({
    category: "",
    description: "",
    location: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");

  const [errors, setErrors] = useState({});

  const [position, setPosition] = useState(null);

  const [coordinates, setCoordinates] = useState({
    latitude: null,
    longitude: null,
  });

  const [gettingLocation, setGettingLocation] =
    useState(false);

  const [submitting, setSubmitting] = useState(false);

  // =====================================
  // HANDLE INPUT
  // =====================================

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files && files[0];

      setComplaint((prev) => ({
        ...prev,
        image: file || null,
      }));

      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview("");
      }
    } else {
      setComplaint((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // =====================================
  // GET CURRENT LOCATION
  // =====================================

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors((prev) => ({
        ...prev,
        location:
          "Geolocation is not supported by your browser.",
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
        const latitude = locationData.coords.latitude;
        const longitude = locationData.coords.longitude;

        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);

        const newPosition = [
          latitude,
          longitude,
        ];

        setPosition(newPosition);

        setCoordinates({
          latitude,
          longitude,
        });

        // Show coordinates first
        setComplaint((prev) => ({
          ...prev,
          location: `${latitude.toFixed(
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
        console.error("Location Error:", error);

        let message =
          "Unable to get your current location.";

        if (error.code === 1) {
          message =
            "Location permission denied. Please allow location access.";
        } else if (error.code === 2) {
          message =
            "Your current location could not be determined.";
        } else if (error.code === 3) {
          message =
            "Location request timed out. Please try again.";
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
  // SUBMIT COMPLAINT
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};

    // Title
    if (!complaint.title.trim()) {
      newErrors.title =
        "Complaint title is required";
    }

    // Category
    if (!complaint.category) {
      newErrors.category =
        "Please select a category";
    }

    // Description
    if (!complaint.description.trim()) {
      newErrors.description =
        "Please describe the complaint";
    }

    // Location
    if (!complaint.location.trim()) {
      newErrors.location =
        "Complaint location is required";
    }

    // Validation
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // =================================
    // CHECK LOGIN TOKEN
    // =================================

    const token = localStorage.getItem("token");

    if (!token) {
      setErrors({
        general:
          "You are not logged in. Please login first.",
      });

      return;
    }

    try {
      setSubmitting(true);

      setErrors({});

      // =================================
      // SEND COMPLAINT TO BACKEND
      // =================================

      const response = await axios.post(
        "http://localhost:5000/api/complaints",
        {
          title: complaint.title.trim(),

          category: complaint.category,

          description:
            complaint.description.trim(),

          location: complaint.location.trim(),

          latitude: coordinates.latitude,

          longitude: coordinates.longitude,

          image: complaint.image
            ? complaint.image.name
            : null,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(
        "Complaint submitted successfully:",
        response.data
      );

      // =================================
      // SUCCESS
      // =================================

      alert("Complaint submitted successfully!");

      // Go to My Complaints
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
            "Failed to submit complaint.",
        });
      } else {
        setErrors({
          general:
            "Unable to connect to the server.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // =====================================
  // UI
  // =====================================

  return (
    <div className="container mt-5 mb-5">

      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div className="card shadow-lg">

            {/* HEADER */}

            <div className="card-header bg-success text-white">

              <h3 className="mb-0">

                <FaFileAlt className="me-2" />

                Report Complaint

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

                {/* TITLE */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Complaint Title
                  </label>

                  <input
                    type="text"
                    className={`form-control ${
                      errors.title
                        ? "is-invalid"
                        : ""
                    }`}
                    name="title"
                    value={complaint.title}
                    onChange={handleChange}
                    placeholder="Enter complaint title"
                  />

                  {errors.title && (
                    <div className="invalid-feedback">
                      {errors.title}
                    </div>
                  )}

                </div>

                {/* CATEGORY */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Complaint Category
                  </label>

                  <select
                    className={`form-select ${
                      errors.category
                        ? "is-invalid"
                        : ""
                    }`}
                    name="category"
                    value={complaint.category}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Category
                    </option>

                    <option value="Garbage & Waste Management">
                      Garbage & Waste Management
                    </option>

                    <option value="Road Damage / Potholes">
                      Road Damage / Potholes
                    </option>

                    <option value="Street Light">
                      Street Light
                    </option>

                    <option value="Drainage & Sewerage">
                      Drainage & Sewerage
                    </option>

                    <option value="Water Supply">
                      Water Supply
                    </option>

                    

                    <option value="Other">
                      Other
                    </option>

                  </select>

                  {errors.category && (
                    <div className="invalid-feedback">
                      {errors.category}
                    </div>
                  )}

                </div>

                {/* DESCRIPTION */}

                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Description
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
                    onChange={handleChange}
                    placeholder="Describe the issue in detail..."
                  />

                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description}
                    </div>
                  )}

                </div>

                {/* IMAGE */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    <FaImage className="me-2" />

                    Upload Image

                  </label>

                  <input
                    type="file"
                    className="form-control"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                  />

                  {imagePreview && (
                    <div className="mt-3">

                      <p className="fw-bold mb-2">
                        Image Preview
                      </p>

                      <img
                        src={imagePreview}
                        alt="Complaint Preview"
                        style={{
                          width: "200px",
                          height: "150px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border:
                            "1px solid #ddd",
                        }}
                      />

                    </div>
                  )}

                </div>

                {/* LOCATION */}

                <div className="mb-3">

                  <label className="form-label fw-bold">

                    <FaMapMarkerAlt className="me-2" />

                    Complaint Location

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
                      value={complaint.location}
                      onChange={handleChange}
                      placeholder="Enter location or select from map"
                    />

                    <button
                      type="button"
                      className="btn btn-outline-success"
                      onClick={
                        getCurrentLocation
                      }
                      disabled={gettingLocation}
                    >

                      <FaMapMarkerAlt className="me-2" />

                      {gettingLocation
                        ? "Getting Location..."
                        : "Use Current Location"}

                    </button>

                  </div>

                  {errors.location && (
                    <div className="text-danger small mt-1">
                      {errors.location}
                    </div>
                  )}

                </div>

                {/* MAP */}

                <div className="mb-4">

                  <label className="form-label fw-bold">

                    <FaMap className="me-2" />

                    Select Location on Map

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
                        position={position}
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
                        setErrors={setErrors}
                      />

                      <MapUpdater
                        position={position}
                      />

                    </MapContainer>

                  </div>

                  <small className="text-muted">

                    Click anywhere on the map
                    to select the complaint
                    location.

                  </small>

                </div>

                {/* SUBMIT */}

                <div className="d-grid">

                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                    disabled={submitting}
                  >

                    <FaPaperPlane className="me-2" />

                    {submitting
                      ? "Submitting..."
                      : "Submit Complaint"}

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