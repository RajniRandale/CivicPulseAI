import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function OfficerDashboard() {
  const navigate = useNavigate();

  // =========================
  // USER
  // =========================

  const [user, setUser] = useState(null);

  // =========================
  // COMPLAINTS
  // =========================

  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // =========================
  // FETCH OFFICER COMPLAINTS
  // =========================

  const fetchComplaints = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const savedUser = localStorage.getItem("user");

      // No login
      if (!token || !savedUser) {
        navigate("/login");
        return;
      }

      let loggedInUser;

      try {
        loggedInUser = JSON.parse(savedUser);
      } catch (parseError) {
        console.error(
          "Invalid user data:",
          parseError
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      // Officer only
      if (loggedInUser.role !== "officer") {
        alert("Access denied. Officers only.");
        navigate("/login");
        return;
      }

      setUser(loggedInUser);

      // Fetch complaints from backend
      const response = await axios.get(
        "http://localhost:5000/api/complaints/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComplaints(
        response.data.complaints || []
      );
    } catch (err) {
      console.error(
        "Fetch officer complaints error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  // =========================
  // UPDATE STATUS
  // =========================

  const handleStatusChange = async (
    complaintId,
    newStatus
  ) => {
    try {
      setUpdatingId(complaintId);

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.put(
        `http://localhost:5000/api/complaints/${complaintId}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update complaint in UI
      setComplaints((prevComplaints) =>
        prevComplaints.map((complaint) =>
          complaint.id === complaintId
            ? {
                ...complaint,
                status:
                  response.data.complaint.status,
              }
            : complaint
        )
      );
    } catch (err) {
      console.error(
        "Update complaint status error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
        return;
      }

      alert(
        err.response?.data?.message ||
          "Failed to update complaint status."
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  // =========================
  // STATUS COUNTS
  // =========================

  const totalComplaints =
    complaints.length;

  const pendingComplaints =
    complaints.filter(
      (complaint) =>
        (complaint.status || "Pending") ===
        "Pending"
    ).length;

  const inProgressComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "In Progress"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Resolved"
    ).length;

  const rejectedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Rejected"
    ).length;

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
        ></div>

        <p className="mt-3">
          Loading complaints...
        </p>
      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (
    <div
      className="container-fluid py-4"
      style={{
        backgroundColor: "#f4f8ff",
        minHeight: "100vh",
      }}
    >
      <div className="container">

        {/* =========================
            HEADER
        ========================= */}

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">

              <div>
                <h1 className="mb-1">
                  👮 Officer Dashboard
                </h1>

                <p className="text-muted mb-0">
                  CivicPulseAI Officer Panel
                </p>
              </div>

              <div className="d-flex gap-2">

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={fetchComplaints}
                >
                  🔄 Refresh
                </button>

                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>

              </div>

            </div>

          </div>
        </div>

        {/* =========================
            WELCOME
        ========================= */}

        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body">

            <h4>
              Welcome,{" "}
              {user?.name || "Officer"}!
            </h4>

            <p className="text-muted mb-0">
              You are logged in as an authorized
              CivicPulseAI officer.
            </p>

          </div>
        </div>

        {/* =========================
            ERROR
        ========================= */}

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        {/* =========================
            STATISTICS
        ========================= */}

        <div className="row g-3 mb-4">

          {/* TOTAL */}

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">

              <div className="card-body text-center">

                <div className="fs-1 mb-2">
                  📋
                </div>

                <h6 className="text-muted">
                  Total Complaints
                </h6>

                <h2 className="fw-bold">
                  {totalComplaints}
                </h2>

              </div>

            </div>
          </div>

          {/* PENDING */}

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">

              <div className="card-body text-center">

                <div className="fs-1 mb-2">
                  ⏳
                </div>

                <h6 className="text-muted">
                  Pending
                </h6>

                <h2 className="fw-bold text-warning">
                  {pendingComplaints}
                </h2>

              </div>

            </div>
          </div>

          {/* IN PROGRESS */}

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">

              <div className="card-body text-center">

                <div className="fs-1 mb-2">
                  🔄
                </div>

                <h6 className="text-muted">
                  In Progress
                </h6>

                <h2 className="fw-bold text-primary">
                  {inProgressComplaints}
                </h2>

              </div>

            </div>
          </div>

          {/* RESOLVED */}

          <div className="col-md-6 col-lg-3">
            <div className="card shadow-sm border-0 h-100">

              <div className="card-body text-center">

                <div className="fs-1 mb-2">
                  ✅
                </div>

                <h6 className="text-muted">
                  Resolved
                </h6>

                <h2 className="fw-bold text-success">
                  {resolvedComplaints}
                </h2>

              </div>

            </div>
          </div>

        </div>

        {/* =========================
            COMPLAINTS
        ========================= */}

        <div className="card shadow-sm border-0">

          <div className="card-body">

            <div className="d-flex justify-content-between align-items-center mb-3">

              <h3 className="mb-0">
                📋 All Complaints
              </h3>

              <span className="badge bg-primary">
                {totalComplaints} Total
              </span>

            </div>

            {complaints.length === 0 ? (

              <div className="text-center py-5">

                <div className="fs-1">
                  📭
                </div>

                <h5 className="mt-3">
                  No complaints found
                </h5>

                <p className="text-muted">
                  There are currently no complaints
                  submitted by citizens.
                </p>

              </div>

            ) : (

              <div className="table-responsive">

                <table className="table table-hover align-middle">

                  <thead className="table-light">

                    <tr>
                      <th>#</th>
                      <th>Citizen</th>
                      <th>Category</th>
                      <th>Description</th>
                      <th>Location</th>
                      <th>Image</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>

                  </thead>

                  <tbody>

                    {complaints.map(
                      (complaint, index) => (

                        <tr key={complaint.id}>

                          {/* CITIZEN */}

                          <td>
                            {index + 1}
                          </td>

                          <td>
                            <strong>
                              {complaint.citizen_name ||
                                "Unknown"}
                            </strong>

                            <br />

                            <small className="text-muted">
                              {complaint.citizen_email ||
                                ""}
                            </small>
                          </td>

                          {/* CATEGORY */}

                          <td>
                            <span className="badge bg-info text-dark">
                              {complaint.category ||
                                "Others"}
                            </span>
                          </td>

                          {/* DESCRIPTION */}

                          <td
                            style={{
                              minWidth: "220px",
                              maxWidth: "300px",
                            }}
                          >
                            {complaint.description ||
                              "No description"}
                          </td>

                          {/* LOCATION */}

                          <td
                            style={{
                              minWidth: "150px",
                            }}
                          >
                            📍{" "}
                            {complaint.location ||
                              "Location not available"}
                          </td>

                          {/* IMAGE */}

                          <td>

                            {complaint.image ? (

                              <img
                                src={complaint.image}
                                alt="Complaint"
                                style={{
                                  width: "70px",
                                  height: "70px",
                                  objectFit: "cover",
                                  borderRadius: "8px",
                                }}
                              />

                            ) : (

                              <span className="text-muted">
                                No image
                              </span>

                            )}

                          </td>

                          {/* STATUS */}

                          <td>

                            <select
                              className={`form-select form-select-sm ${
                                complaint.status ===
                                "Resolved"
                                  ? "border-success"
                                  : complaint.status ===
                                    "Rejected"
                                  ? "border-danger"
                                  : complaint.status ===
                                    "In Progress"
                                  ? "border-primary"
                                  : "border-warning"
                              }`}
                              value={
                                complaint.status ||
                                "Pending"
                              }
                              disabled={
                                updatingId ===
                                complaint.id
                              }
                              onChange={(e) =>
                                handleStatusChange(
                                  complaint.id,
                                  e.target.value
                                )
                              }
                            >

                              <option value="Pending">
                                Pending
                              </option>

                              <option value="In Progress">
                                In Progress
                              </option>

                              <option value="Resolved">
                                Resolved
                              </option>

                              <option value="Rejected">
                                Rejected
                              </option>

                            </select>

                            {updatingId ===
                              complaint.id && (
                              <small className="text-muted">
                                Updating...
                              </small>
                            )}

                          </td>

                          {/* DATE */}

                          <td>
                            {complaint.created_at
                              ? new Date(
                                  complaint.created_at
                                ).toLocaleDateString()
                              : "-"}
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </div>

        </div>

        {/* =========================
            REJECTED COUNT
        ========================= */}

        <div className="text-end mt-3">

          <small className="text-muted">
            Rejected Complaints:{" "}
            <strong>
              {rejectedComplaints}
            </strong>
          </small>

        </div>

      </div>
    </div>
  );
}

export default OfficerDashboard;