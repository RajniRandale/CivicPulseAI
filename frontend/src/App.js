import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenLogin from "./pages/CitizenLogin";
import AdminLogin from "./pages/AdminLogin";
import CitizenDashboard from "./pages/CitizenDashboard";
import ReportComplaint from "./pages/ReportComplaint";
import MyComplaints from "./pages/MyComplaints";

function App() {
  return (
    <>
      <Navbar />

      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/citizen-login"
          element={<CitizenLogin />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/citizen-dashboard"
          element={<CitizenDashboard />}
        />

        <Route
          path="/my-complaints"
          element={<MyComplaints />}
        />

        <Route
          path="/report-complaint"
          element={<ReportComplaint />}
        />

      </Routes>
    </>
  );
}

export default App;