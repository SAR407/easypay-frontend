import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // <-- added

function Timesheets() {
  const { user, token } = useAuth();
  const navigate = useNavigate(); // <-- added
  const [timesheets, setTimesheets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchId, setSearchId] = useState("");
  const [formData, setFormData] = useState({
    date: "",
    hoursWorked: "",
    taskDescription: "",
  });

  useEffect(() => {
    if (!user) return;
    if (["Admin", "PayrollProcessor", "HR"].includes(user.role)) {
      fetchAllTimesheets();
    } else {
      fetchTimesheets(user.employeeId || user.id);
    }
  }, [user]);

  const fetchTimesheets = async (employeeId) => {
    try {
      const res = await api.get(`/Timesheet/byEmployee/${employeeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimesheets(res.data);
    } catch (err) {
      console.error("Error fetching timesheets:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllTimesheets = async () => {
    try {
      const res = await api.get("/Timesheet/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTimesheets(res.data);
    } catch (err) {
      console.error("Error fetching all timesheets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(
        "/Timesheet/add",
        {
          employeeId: user.employeeId || user.id,
          date: formData.date,
          hoursWorked: parseFloat(formData.hoursWorked),
          taskDescription: formData.taskDescription,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Timesheet submitted successfully!");
      setTimesheets([...timesheets, res.data]);
      setFormData({ date: "", hoursWorked: "", taskDescription: "" });
    } catch (err) {
      console.error("Error adding timesheet:", err);
      alert("❌ Failed to submit timesheet");
    }
  };

  const handleApprove = async (timesheetId) => {
    try {
      await api.put(
        `/Timesheet/approve/${timesheetId}?managerId=${user.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Timesheet approved!");
      fetchAllTimesheets();
    } catch (err) {
      console.error("Error approving timesheet:", err);
      alert("❌ Failed to approve timesheet");
    }
  };

  const handleReject = async (timesheetId) => {
    try {
      await api.put(
        `/Timesheet/reject/${timesheetId}?managerId=${user.id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("❌ Timesheet rejected!");
      fetchAllTimesheets();
    } catch (err) {
      console.error("Error rejecting timesheet:", err);
      alert("❌ Failed to reject timesheet");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchId) {
      fetchAllTimesheets();
      return;
    }
    fetchTimesheets(searchId);
  };

  if (loading) return <p>Loading timesheets...</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Back Button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "10px 16px",
          border: "none",
          borderRadius: "6px",
          backgroundColor: "#2c3e50",
          color: "#fff",
          cursor: "pointer",
          marginBottom: "20px",
        }}
        onMouseOver={(e) => (e.currentTarget.style.background = "#34495e")}
        onMouseOut={(e) => (e.currentTarget.style.background = "#2c3e50")}
      >
        ← Back to Dashboard
      </button>

      <h2 style={{ marginBottom: "20px" }}>Manage Timesheets</h2>

      {/* Employee Form */}
      {user?.role === "Employee" && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h3>Add New Timesheet</h3>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Hours Worked"
            value={formData.hoursWorked}
            onChange={(e) =>
              setFormData({ ...formData, hoursWorked: e.target.value })
            }
            required
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Task Description"
            value={formData.taskDescription}
            onChange={(e) =>
              setFormData({ ...formData, taskDescription: e.target.value })
            }
            style={inputStyle}
          />
          <button type="submit" style={addBtnStyle}>
            ➕ Add Timesheet
          </button>
        </form>
      )}

      {/* Search */}
      {["Admin", "Manager", "HR"].includes(user?.role) && (
        <form
          onSubmit={handleSearch}
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#eef6ff",
            borderRadius: "8px",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            type="number"
            placeholder="Search by Employee ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={inputStyle}
          />
          <button type="submit" style={searchBtnStyle}>
            🔍 Search
          </button>
        </form>
      )}

      {/* Timesheets Table */}
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          background: "#fff",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ background: "#2c3e50", color: "#fff" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Employee ID</th>
            <th style={thStyle}>Date</th>
            <th style={thStyle}>Hours Worked</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Task</th>
            {["Admin", "Manager", "HR"].includes(user?.role) && (
              <th style={thStyle}>Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {timesheets.map((t, index) => (
            <tr
              key={t.timesheetId}
              style={{
                background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                textAlign: "center",
              }}
            >
              <td style={tdStyle}>{t.timesheetId}</td>
              <td style={tdStyle}>{t.employeeId}</td>
              <td style={tdStyle}>{new Date(t.date).toLocaleDateString()}</td>
              <td style={tdStyle}>{t.hoursWorked}</td>
              <td
                style={{
                  ...tdStyle,
                  fontWeight: "bold",
                  color:
                    t.status === "Approved"
                      ? "green"
                      : t.status === "Rejected"
                      ? "red"
                      : "orange",
                }}
              >
                {t.status}
              </td>
              <td style={tdStyle}>{t.taskDescription || "-"}</td>
              {["Admin", "Manager", "HR"].includes(user?.role) &&
                t.status === "Pending" && (
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleApprove(t.timesheetId)}
                      style={approveBtnStyle}
                    >
                      ✅ Approve
                    </button>
                    <button
                      onClick={() => handleReject(t.timesheetId)}
                      style={rejectBtnStyle}
                    >
                      ❌ Reject
                    </button>
                  </td>
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ✅ Styles
const inputStyle = {
  margin: "5px",
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const addBtnStyle = {
  background: "#27ae60",
  color: "#fff",
  padding: "8px 12px",
  marginLeft: "5px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const searchBtnStyle = {
  background: "#2980b9",
  color: "#fff",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const approveBtnStyle = {
  background: "#27ae60",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "5px",
};

const rejectBtnStyle = {
  background: "#c0392b",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};

export default Timesheets;
