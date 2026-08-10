import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Select location by clicking map
function LocationMarker({ position, setPosition, setLocation }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;

      setPosition([lat, lng]);
      setLocation(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

// Move map to selected location
function MapUpdater({ position }) {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, 15);
    }
  }, [position, map]);

  return null;
}

function ReportComplaint() {
  const [complaint, setComplaint] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [position, setPosition] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];

      setComplaint({
        ...complaint,
        image: file || null,
      });

      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview("");
      }
    } else {
      setComplaint({
        ...complaint,
        [name]: value,
      });
    }

    setErrors({
      ...errors,
      [name]: "",
    });

    setSuccessMessage("");
  };

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrors({
        ...errors,
        location: "Geolocation is not supported by your browser.",
      });

      return;
    }

    navigator.geolocation.getCurrentPosition(
      (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        const newPosition = [latitude, longitude];

        setPosition(newPosition);

        setComplaint({
          ...complaint,
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        });

        setErrors({
          ...errors,
          location: "",
        });
      },
      (error) => {
        console.log("Location Error:", error);

        setErrors({
          ...errors,
          location:
            "Unable to get your current location. Please allow location access.",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Submit complaint
  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!complaint.title.trim()) {
      newErrors.title = "Complaint title is required";
    }

    if (!complaint.category) {
      newErrors.category = "Please select a category";
    }

    if (!complaint.description.trim()) {
      newErrors.description = "Please describe the complaint";
    }

    if (!complaint.location.trim()) {
      newErrors.location = "Complaint location is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setSuccessMessage("");
      return;
    }

    // Get existing complaints
    const existingComplaints =
      JSON.parse(localStorage.getItem("complaints")) || [];

    // Create new complaint
    const newComplaint = {
      id: "GCP-" + Date.now(),
      title: complaint.title,
      category: complaint.category,
      description: complaint.description,
      location: complaint.location,
      image: complaint.image
        ? complaint.image.name
        : null,
      status: "Pending",
      date: new Date().toLocaleDateString("en-IN"),
    };

    // Add new complaint
    const updatedComplaints = [
      ...existingComplaints,
      newComplaint,
    ];

    // Save complaints
    localStorage.setItem(
      "complaints",
      JSON.stringify(updatedComplaints)
    );

    console.log("Complaint Submitted:", newComplaint);

    // Success message
    setSuccessMessage(
      "Complaint submitted successfully!"
    );

    // Reset form
    setComplaint({
      title: "",
      category: "",
      description: "",
      location: "",
      image: null,
    });

    setImagePreview("");
    setPosition(null);
    setErrors({});

    // Clear file input
    const fileInput = document.querySelector(
      'input[name="image"]'
    );

    if (fileInput) {
      fileInput.value = "";
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">

        <div className="col-lg-9">

          <div className="card shadow-lg">

            {/* Header */}
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">
                📝 Report Complaint
              </h3>
            </div>

            <div className="card-body p-4">

              {/* Success Message */}
              {successMessage && (
                <div className="alert alert-success">
                  {successMessage}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                {/* Complaint Title */}
                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Complaint Title
                  </label>

                  <input
                    type="text"
                    className={`form-control ${
                      errors.title ? "is-invalid" : ""
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

                {/* Category */}
                <div className="mb-3">

                  <label className="form-label fw-bold">
                    Complaint Category
                  </label>

                  <select
                    className={`form-select ${
                      errors.category ? "is-invalid" : ""
                    }`}
                    name="category"
                    value={complaint.category}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Category
                    </option>

                    <option value="Garbage">
                      Garbage
                    </option>

                    <option value="Pothole">
                      Pothole
                    </option>

                    <option value="Street Light">
                      Street Light
                    </option>

                    <option value="Water Leakage">
                      Water Leakage
                    </option>

                    <option value="Drainage">
                      Drainage
                    </option>

                    <option value="Road Damage">
                      Road Damage
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

                {/* Description */}
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
                    value={complaint.description}
                    onChange={handleChange}
                    placeholder="Describe the issue in detail..."
                  />

                  {errors.description && (
                    <div className="invalid-feedback">
                      {errors.description}
                    </div>
                  )}

                </div>

                {/* Image */}
                <div className="mb-3">

                  <label className="form-label fw-bold">
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
                          border: "1px solid #ddd",
                        }}
                      />

                    </div>
                  )}

                </div>

                {/* Location */}
                <div className="mb-3">

                  <label className="form-label fw-bold">
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
                      onClick={getCurrentLocation}
                    >
                      📍 Use Current Location
                    </button>

                  </div>

                  {errors.location && (
                    <div className="text-danger small mt-1">
                      {errors.location}
                    </div>
                  )}

                </div>

                {/* Map */}
                <div className="mb-4">

                  <label className="form-label fw-bold">
                    🗺️ Select Location on Map
                  </label>

                  <div
                    style={{
                      height: "350px",
                      width: "100%",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border: "1px solid #ddd",
                    }}
                  >

                    <MapContainer
                      center={[19.076, 72.8777]}
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
                        setPosition={setPosition}
                        setLocation={(location) =>
                          setComplaint({
                            ...complaint,
                            location: location,
                          })
                        }
                      />

                      <MapUpdater
                        position={position}
                      />

                    </MapContainer>

                  </div>

                  <small className="text-muted">
                    Click anywhere on the map to select
                    the complaint location.
                  </small>

                </div>

                {/* Submit */}
                <div className="d-grid">

                  <button
                    type="submit"
                    className="btn btn-success btn-lg"
                  >
                    🚀 Submit Complaint
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