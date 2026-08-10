import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function CitizenDashboard() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedComplaints =
      JSON.parse(localStorage.getItem("complaints")) || [];

    setComplaints(savedComplaints);
  }, []);

  const handleLogout = () => {
    navigate("/citizen-login");
  };

  return (
    <div className="container-fluid">
      <div className="row">

        {/* Sidebar */}
        <div
          className="col-md-2"
          style={{
            backgroundColor: "#212529",
            minHeight: "calc(100vh - 70px)",
            padding: "20px",
          }}
        >
          <h3 className="text-white mb-4">
            CivicPulse AI
          </h3>

          <div className="d-grid gap-2">

            <Link
              to="/citizen-dashboard"
              className="btn btn-success text-start"
            >
              🏠 Dashboard
            </Link>

          <Link
  to="/my-complaints"
  className="btn btn-dark text-start text-white"
>
  📋 My Complaints
</Link>
            <Link
              to="/report-complaint"
              className="btn btn-dark text-start text-white"
            >
              ➕ Report Complaint
            </Link>

            <button className="btn btn-dark text-start text-white">
              🔍 Track Complaint
            </button>

            <button className="btn btn-dark text-start text-white">
              🔔 Notifications
            </button>

            <button className="btn btn-dark text-start text-white">
              👤 Profile
            </button>

            <button className="btn btn-dark text-start text-white">
              ❓ Help & Support
            </button>

            <button
              className="btn btn-danger text-start mt-3"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>

          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-10 p-4">

          <h1 className="mb-4">
            👋 Welcome, Citizen
          </h1>

          {/* Quick Actions */}
          <div className="row g-4 mb-4">

            {/* Report Complaint */}
            <div className="col-md-3">
              <Link
                to="/report-complaint"
                className="text-decoration-none"
              >
                <div className="card shadow-sm h-100">
                  <div className="card-body text-center">
                    <h1>📋</h1>

                    <h4>
                      Report Complaint
                    </h4>

                    <p className="text-muted">
                      Register a new complaint
                    </p>
                  </div>
                </div>
              </Link>
            </div>

            {/* Track Complaint */}
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h1>🔍</h1>

                  <h4>
                    Track Complaint
                  </h4>

                  <p className="text-muted">
                    Track complaint status
                  </p>
                </div>
              </div>
            </div>

            {/* Nearby Issues */}
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h1>📍</h1>

                  <h4>
                    Nearby Issues
                  </h4>

                  <p className="text-muted">
                    View nearby complaints
                  </p>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="col-md-3">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center">
                  <h1>🔔</h1>

                  <h4>
                    Notifications
                  </h4>

                  <p className="text-muted">
                    View notifications
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Statistics */}
          <div className="row g-4 mb-4">

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h2>{complaints.length}</h2>

                  <p className="text-muted mb-0">
                    Total Complaints
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h2>
                    {
                      complaints.filter(
                        (item) => item.status === "Pending"
                      ).length
                    }
                  </h2>

                  <p className="text-muted mb-0">
                    Pending Complaints
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  <h2>
                    {
                      complaints.filter(
                        (item) => item.status === "Resolved"
                      ).length
                    }
                  </h2>

                  <p className="text-muted mb-0">
                    Resolved Complaints
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Recent Complaints */}
          <div className="card shadow-sm">

            <div className="card-header bg-success text-white">
              <h5 className="mb-0">
                Recent Complaints
              </h5>
            </div>

            <div className="card-body">

              {complaints.length === 0 ? (

                <div className="text-center py-4">

                  <h4>
                    No complaints found.
                  </h4>

                  <p className="text-muted">
                    Click on <strong>Report Complaint</strong> to
                    register your first complaint.
                  </p>

                  <Link
                    to="/report-complaint"
                    className="btn btn-success"
                  >
                    Report Complaint
                  </Link>

                </div>

              ) : (

                <div className="table-responsive">

                  <table className="table table-hover">

                    <thead>
                      <tr>
                        <th>Complaint ID</th>
                        <th>Complaint</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>

                    <tbody>

                      {complaints
                        .slice()
                        .reverse()
                        .map((item, index) => (

                          <tr
                            key={item.id || index}
                          >

                            <td>
                              <strong>
                                {item.id || `CMP-${index + 1}`}
                              </strong>
                            </td>

                            <td>
                              {item.title}
                            </td>

                            <td>
                              {item.category}
                            </td>

                            <td>
                              <span
                                className={`badge ${
                                  item.status === "Resolved"
                                    ? "bg-success"
                                    : "bg-warning text-dark"
                                }`}
                              >
                                {item.status || "Pending"}
                              </span>
                            </td>

                            <td>
                              {item.date || "Today"}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default CitizenDashboard;