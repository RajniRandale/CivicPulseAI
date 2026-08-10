import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const savedComplaints =
      JSON.parse(localStorage.getItem("complaints")) || [];

    setComplaints(savedComplaints);
  }, []);

  const getStatusBadge = (status) => {
    if (status === "Resolved") {
      return "badge bg-success";
    }

    if (status === "In Progress") {
      return "badge bg-primary";
    }

    return "badge bg-warning text-dark";
  };

  return (
    <div className="container-fluid mt-4 mb-5">

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
              className="btn btn-dark text-start text-white"
            >
              🏠 Dashboard
            </Link>

            <Link
              to="/my-complaints"
              className="btn btn-success text-start"
            >
              📋 My Complaints
            </Link>

            <Link
              to="/report-complaint"
              className="btn btn-dark text-start text-white"
            >
              ➕ Report Complaint
            </Link>

          </div>

        </div>

        {/* Main Content */}
        <div className="col-md-10">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <div>
              <h1>📋 My Complaints</h1>
              <p className="text-muted">
                View all complaints registered by you.
              </p>
            </div>

            <Link
              to="/report-complaint"
              className="btn btn-success"
            >
              ➕ New Complaint
            </Link>

          </div>

          {/* No complaints */}
          {complaints.length === 0 ? (

            <div className="card shadow-sm">

              <div className="card-body text-center py-5">

                <h1>📭</h1>

                <h3 className="mt-3">
                  No Complaints Found
                </h3>

                <p className="text-muted">
                  You have not registered any complaints yet.
                </p>

                <Link
                  to="/report-complaint"
                  className="btn btn-success"
                >
                  Report Your First Complaint
                </Link>

              </div>

            </div>

          ) : (

            <div className="card shadow-sm">

              <div className="card-header bg-success text-white">
                <h5 className="mb-0">
                  Registered Complaints ({complaints.length})
                </h5>
              </div>

              <div className="card-body">

                <div className="table-responsive">

                  <table className="table table-hover align-middle">

                    <thead className="table-light">

                      <tr>
                        <th>Complaint ID</th>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Location</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>

                    </thead>

                    <tbody>

                      {complaints
                        .slice()
                        .reverse()
                        .map((complaint) => (

                          <tr key={complaint.id}>

                            <td>
                              <strong>
                                {complaint.id}
                              </strong>
                            </td>

                            <td>
                              {complaint.title}
                            </td>

                            <td>
                              {complaint.category}
                            </td>

                            <td>
                              {complaint.location}
                            </td>

                            <td>
                              <span
                                className={getStatusBadge(
                                  complaint.status
                                )}
                              >
                                {complaint.status}
                              </span>
                            </td>

                            <td>
                              {complaint.date}
                            </td>

                          </tr>

                        ))}

                    </tbody>

                  </table>

                </div>

              </div>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default MyComplaints;