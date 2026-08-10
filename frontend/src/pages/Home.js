import React from "react";

function Home() {
  return (
    <div className="container text-center mt-5">

      <h1 className="display-4 fw-bold">
        CivicPulse AI
      </h1>

      <h3 className="mt-3">
        AI-Based Smart Public Grievance Management System
      </h3>

      <p className="lead mt-4">
        Report civic issues such as garbage, potholes,
        water leakage and street light failures.
      </p>

      <button className="btn btn-primary btn-lg mt-3">
        Register Complaint
      </button>

    </div>
  );
}

export default Home;