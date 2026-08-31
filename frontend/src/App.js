import React from "react";

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import "./App.css";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CitizenLogin from "./pages/CitizenLogin";

import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenProfile from "./pages/CitizenProfile";
import CitizenTrackComplaint from "./pages/CitizenTrackComplaint";
import CitizenNearbyIssues from "./pages/CitizenNearbyIssues";
import CitizenNotifications from "./pages/CitizenNotifications";
import CitizenHelpSupport from "./pages/CitizenHelpSupport";

import ReportComplaint from "./pages/ReportComplaint";
import MyComplaints from "./pages/MyComplaints";

import OfficerLogin from "./pages/OfficerLogin";
import OfficerDashboard from "./pages/OfficerDashboard";
import OfficerAssignedComplaints from "./pages/OfficerAssignedComplaints";
import OfficerUpdateStatus from "./pages/OfficerUpdateStatus";
import OfficerResolvedComplaints from "./pages/OfficerResolvedComplaints";
import OfficerHelpSupport from "./pages/OfficerHelpSupport";
import OfficerNotifications from "./pages/OfficerNotifications";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminDepartments from "./pages/AdminDepartments";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminReports from "./pages/AdminReports";
import AdminSettings from "./pages/AdminSettings";

import About from "./pages/About";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";

import DailyNews from "./pages/DailyNews";
import HowItWorks from "./pages/HowItWorks";

import TopUtilityBar, {
  AppSettingsProvider,
  useAppSettings,
} from "./components/TopUtilityBar";

import MainNavbar from "./components/MainNavbar";


function AppLayout() {
  const { darkMode } = useAppSettings();

  const location = useLocation();


  const dashboardPaths = [
    "/citizen-dashboard",
    "/citizen-profile",
    "/my-complaints",
    "/report-complaint",
    "/track-complaint",
    "/nearby-issues",
    "/notifications",
    "/citizen-help",

    "/officer-dashboard",
    "/officer-assigned-complaints",
    "/officer-update-status",
    "/officer-resolved-complaints",
    "/officer-help",
    "/officer-notifications",

    "/admin-dashboard",
    "/admin-complaints",
    "/admin-departments",
    "/admin-users",
    "/admin-analytics",
    "/admin-reports",
    "/admin-settings",
  ];


  const showMainNavbar =
    !dashboardPaths.includes(location.pathname);


  return (
    <div
      className={
        darkMode
          ? "app-root dark-theme"
          : "app-root"
      }
    >
      {/* TOP BAR */}

      <TopUtilityBar />


      {/* MAIN NAVBAR */}

      {showMainNavbar && (
        <MainNavbar />
      )}


      <Routes>

        {/* HOME */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* AUTHENTICATION */}

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
          path="/officer-login"
          element={<OfficerLogin />}
        />

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        {/* CITIZEN */}

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
          path="/track-complaint"
          element={<CitizenTrackComplaint />}
        />

        <Route
          path="/nearby-issues"
          element={<CitizenNearbyIssues />}
        />

        <Route
          path="/notifications"
          element={<CitizenNotifications />}
        />

        <Route
          path="/citizen-help"
          element={<CitizenHelpSupport />}
        />


        {/* OFFICER */}

        <Route
          path="/officer-dashboard"
          element={<OfficerDashboard />}
        />

        <Route
          path="/officer-assigned-complaints"
          element={<OfficerAssignedComplaints />}
        />

        <Route
          path="/officer-update-status"
          element={<OfficerUpdateStatus />}
        />

        <Route
          path="/officer-resolved-complaints"
          element={<OfficerResolvedComplaints />}
        />

        <Route
          path="/officer-help"
          element={<OfficerHelpSupport />}
        />

        <Route
          path="/officer-notifications"
          element={<OfficerNotifications />}
        />


        {/* ADMIN */}

        <Route
          path="/admin-dashboard"
          element={<AdminDashboard />}
        />

        <Route
          path="/admin-complaints"
          element={<AdminComplaints />}
        />

        <Route
          path="/admin-departments"
          element={<AdminDepartments />}
        />

        <Route
          path="/admin-users"
          element={<AdminUsers />}
        />

        <Route
          path="/admin-analytics"
          element={<AdminAnalytics />}
        />

        <Route
          path="/admin-reports"
          element={<AdminReports />}
        />

        <Route
          path="/admin-settings"
          element={<AdminSettings />}
        />


        {/* GENERAL */}

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        <Route
          path="/daily-news"
          element={<DailyNews />}
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