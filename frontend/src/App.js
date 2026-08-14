import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenLogin from "./pages/CitizenLogin";

import CitizenDashboard from "./pages/CitizenDashboard";

import ReportComplaint from "./pages/ReportComplaint";
import MyComplaints from "./pages/MyComplaints";
import OfficerLogin from "./pages/OfficerLogin";
import OfficerDashboard from "./pages/OfficerDashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import CitizenProfile from "./pages/CitizenProfile";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route
          path="/citizen-login"
          element={<CitizenLogin />}
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

        <Route
  path="/officer-login"
  element={<OfficerLogin />}
/>

<Route
  path="/officer-dashboard"
  element={<OfficerDashboard />}
/>
<Route path="/contact" element={<Contact />} />

<Route path="/about" element={<About />} />

<Route
  path="/citizen-profile"
  element={<CitizenProfile />}
/>
      </Routes>
    </>
  );
}

export default App;