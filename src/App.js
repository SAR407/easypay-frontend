import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./context/ProtectedRoute";

// Components
import Navbar from "./components/Navbar";

// Public Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Dashboard + child pages
import Dashboard from "./pages/dashboard/Dashboard";
import ManageUsers from "./pages/dashboard/ManageUsers";
import ManageEmployees from "./pages/dashboard/ManageEmployees";
import Timesheets from "./pages/dashboard/Timesheets";
import LeaveRequests from "./pages/dashboard/LeaveRequests";
import Payroll from "./pages/dashboard/Payroll";
import Benefits from "./pages/dashboard/Benefits";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><Navbar /><Home /></>} />
          <Route path="/login" element={<><Navbar /><Login /></>} />
          <Route path="/register" element={<><Navbar /><Register /></>} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/manage-users" element={<ManageUsers />} />
            <Route path="/dashboard/manage-employees" element={<ManageEmployees />} />
            <Route path="/dashboard/timesheets" element={<Timesheets />} />
            <Route path="/dashboard/leave-requests" element={<LeaveRequests />} />
            <Route path="/dashboard/payroll" element={<Payroll />} />
            <Route path="/dashboard/benefits" element={<Benefits />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
