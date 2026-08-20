import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenLogin from "./pages/CitizenLogin";

import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenProfile from "./pages/CitizenProfile";

import ReportComplaint from "./pages/ReportComplaint";
import MyComplaints from "./pages/MyComplaints";

import OfficerLogin from "./pages/OfficerLogin";
import OfficerDashboard from "./pages/OfficerDashboard";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

import About from "./pages/About";
import Contact from "./pages/Contact";

import ForgotPassword from "./pages/ForgotPassword";

import TopUtilityBar, {
  AppSettingsProvider,
  useAppSettings,
} from "./components/TopUtilityBar";

function AppLayout() {
  const { darkMode } =
    useAppSettings();

  return (
    <div
      className={
        darkMode
          ? "app-root dark-theme"
          : "app-root"
      }
    >
      <TopUtilityBar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/citizen-login"
          element={<CitizenLogin />}
        />

        <Route
          path="/citizen-dashboard"
          element={<CitizenDashboard />}
        />

        <Route
          path="/citizen-profile"
          element={<CitizenProfile />}
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
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/officer-login"
          element={<OfficerLogin />}
        />

        <Route
          path="/officer-dashboard"
          element={<OfficerDashboard />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AppSettingsProvider>
      <AppLayout />
    </AppSettingsProvider>
  );
}

export default App;