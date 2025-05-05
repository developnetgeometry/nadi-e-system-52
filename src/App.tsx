import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Home } from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import Profile from "./pages/Profile";
import Settings from "./pages/dashboard/Settings";
import UnderDevelopment from "./pages/UnderDevelopment";
import Site from "./pages/dashboard/site/Site";
import SiteDetails from "./pages/dashboard/site/SiteDetails";
import Staff from "./pages/dashboard/staff/Staff";
import StaffDetails from "./pages/dashboard/staff/StaffDetails";
import Attendance from "./pages/dashboard/hr/Attendance";
import PayrollPage from "./pages/dashboard/hr/Payroll";
import HRSettings from "./pages/dashboard/hr/HRSettings";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  function ProtectedRoute({ children }) {
    if (!session) {
      return <Navigate to="/login" replace />;
    }
    return children;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/lookup-settings"
          element={
            <ProtectedRoute>
              <UnderDevelopment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/site"
          element={
            <ProtectedRoute>
              <Site />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/site/:id"
          element={
            <ProtectedRoute>
              <SiteDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute>
              <Staff />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/staff/:id"
          element={
            <ProtectedRoute>
              <StaffDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hr/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hr/payroll"
          element={
            <ProtectedRoute>
              <PayrollPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/hr/settings"
          element={
            <ProtectedRoute>
              <HRSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
