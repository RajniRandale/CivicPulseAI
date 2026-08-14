import React from "react";
import { useNavigate } from "react-router-dom";

function OfficerDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="container mt-5">

      <div className="card shadow-lg p-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <div>
            <h1>👮 Officer Dashboard</h1>

            <p className="text-muted mb-0">
              CivicPulseAI Officer Panel
            </p>
          </div>

          <button
            className="btn btn-danger"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

        <hr />

        <div className="mb-4">

          <h4>Welcome, {user?.name || "Officer"}!</h4>

          <p className="text-muted">
            You are logged in as an authorized CivicPulseAI officer.
          </p>

        </div>

        <div className="row">

          {/* Assigned Complaints */}

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm p-4 text-center">

              <h3>📋</h3>

              <h5>Assigned Complaints</h5>

              <h2>0</h2>

            </div>

          </div>

          {/* Pending Complaints */}

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm p-4 text-center">

              <h3>⏳</h3>

              <h5>Pending Complaints</h5>

              <h2>0</h2>

            </div>

          </div>

          {/* Resolved Complaints */}

          <div className="col-md-4 mb-3">

            <div className="card shadow-sm p-4 text-center">

              <h3>✅</h3>

              <h5>Resolved Complaints</h5>

              <h2>0</h2>

            </div>

          </div>

        </div>

        <div className="mt-4">

          <h3>Officer Functions</h3>

          <div className="d-grid gap-2 mt-3">

            <button className="btn btn-primary">
              View Assigned Complaints
            </button>

            <button className="btn btn-warning">
              Update Complaint Status
            </button>

            <button className="btn btn-success">
              View Resolved Complaints
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default OfficerDashboard;