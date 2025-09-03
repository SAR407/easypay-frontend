import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  getLeavesByEmployee,
  submitLeave,
  getAllLeaves,
  approveLeave,
  rejectLeave,
} from "../../services/api";
import LeaveForm from "../../components/leave/LeaveForm";
import LeaveList from "../../components/leave/LeaveList";
import { useNavigate } from "react-router-dom";

export default function LeaveRequests() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchId, setSearchId] = useState("");
  const [searchLeaves, setSearchLeaves] = useState([]);
  const [searchError, setSearchError] = useState("");

  // ---------------- Fetch leaves ----------------
  const fetchLeaves = async () => {
    setLoading(true);
    try {
      let res;
      const role = user.role.toUpperCase();

      if (role === "EMPLOYEE") {
        if (!user.employeeId) throw new Error("Employee ID not found");
        res = await getLeavesByEmployee(user.employeeId);
      } else if (["ADMIN", "HR"].includes(role)) {
        res = await getAllLeaves();
      }

      if (res?.data) setLeaves(res.data);
      else setLeaves([]);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || err.message || "Unknown error";
      alert("Failed to fetch leave requests! " + msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchLeaves();
  }, [user]);

  // ---------------- Submit leave (Employee only) ----------------
  const handleSubmitLeave = async (leaveData) => {
    try {
      await submitLeave({ ...leaveData, employeeId: user.employeeId });
      alert("✅ Leave submitted successfully!");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to submit leave!");
    }
  };

  // ---------------- Approve / Reject (HR only) ----------------
  const handleApprove = async (leaveId) => {
    try {
      const hrId = user.employeeId || 0;
      await approveLeave(leaveId, hrId);
      alert("Leave approved successfully!");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to approve leave!");
    }
  };

  const handleReject = async (leaveId) => {
    try {
      const hrId = user.employeeId || 0;
      await rejectLeave(leaveId, hrId);
      alert("Leave rejected successfully!");
      fetchLeaves();
    } catch (err) {
      console.error(err);
      alert("Failed to reject leave!");
    }
  };

  // ---------------- Search by Employee ID (Admin/HR) ----------------
  const handleSearch = async () => {
    setSearchError("");
    const id = searchId.trim();

    if (!id) {
      setSearchError("Please enter an Employee ID.");
      setSearchLeaves([]);
      return;
    }

    if (!/^\d+$/.test(id)) {
      setSearchError("Employee ID must be a number.");
      setSearchLeaves([]);
      return;
    }

    try {
      const res = await getLeavesByEmployee(Number(id));
      if (!res?.data || res.data.length === 0) {
        setSearchError("No leave requests found for this Employee ID.");
      }
      setSearchLeaves(res.data || []);
    } catch (err) {
      console.error(err);
      setSearchError("Failed to fetch leave requests.");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div style={containerStyle}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={backBtnStyle}
        onMouseOver={(e) => (e.currentTarget.style.background = "#34495e")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#2c3e50")}
      >
        ← Back to Dashboard
      </button>

      <h2 style={headingStyle}>Leave Requests</h2>

      {/* Employee: Submit leave */}
      {user.role === "Employee" && (
        <div style={formCardStyle}>
          <h3 style={subHeadingStyle}>Submit Leave</h3>
          <LeaveForm onSubmit={handleSubmitLeave} />
        </div>
      )}

      {/* Admin/HR: Search by Employee */}
      {["Admin", "HR"].includes(user.role) && (
        <div style={formCardStyle}>
          <h3 style={subHeadingStyle}>Search Leave by Employee ID</h3>
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "10px",
              maxWidth: "600px",
              width: "100%",
            }}
          >
            <input
              type="number"
              placeholder="Employee ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              onKeyDown={onKeyDown}
              style={searchInputStyle}
            />
            <button onClick={handleSearch} style={searchBtnStyle}>
              Search
            </button>
          </div>
          {searchError && <p style={{ color: "red" }}>{searchError}</p>}
          {searchLeaves.length > 0 && (
            <LeaveList
              leaves={searchLeaves}
              role={user.role}
              onApprove={user.role === "HR" ? handleApprove : undefined}
              onReject={user.role === "HR" ? handleReject : undefined}
            />
          )}
        </div>
      )}

      {/* Leave list */}
      <h3 style={subHeadingStyle}>
        {user.role === "Employee" ? "My Leave Requests" : "All Leave Requests"}
      </h3>

      {loading ? (
        <p>Loading leave requests...</p>
      ) : (
        <LeaveList
          leaves={leaves}
          role={user.role}
          onApprove={user.role === "HR" ? handleApprove : undefined}
          onReject={user.role === "HR" ? handleReject : undefined}
        />
      )}
    </div>
  );
}

// ---------------- Styles ----------------
const containerStyle = { 
  padding: "30px 50px", 
  width: "100%",
  maxWidth: "none",
  margin: "0 auto", 
  minHeight: "100vh",
  background: "#f4f6f9"
};

const backBtnStyle = {
  padding: "10px 16px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#2c3e50",
  color: "#fff",
  cursor: "pointer",
  marginBottom: "20px",
};

const headingStyle = { fontSize: "2rem", fontWeight: "bold", marginBottom: "20px" };
const subHeadingStyle = { fontSize: "1.2rem", fontWeight: "600", marginBottom: "10px" };
const formCardStyle = {
  background: "#fff",
  padding: "20px",
  borderRadius: "10px",
  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
  marginBottom: "30px",
};

const searchInputStyle = { 
  padding: "10px", 
  borderRadius: "6px", 
  border: "1px solid #ccc", 
  flex: 1, 
  minWidth: "0"   // prevents input from forcing overflow
};

const searchBtnStyle = { 
  padding: "10px 20px", 
  background: "#3498db", 
  color: "#fff", 
  border: "none", 
  borderRadius: "6px", 
  cursor: "pointer",
  flexShrink: 0    // button won’t shrink or get pushed out
};
