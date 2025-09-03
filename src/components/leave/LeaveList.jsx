import React from "react";

function LeaveList({ leaves, role, onApprove, onReject }) {
  if (!leaves || leaves.length === 0) {
    return <p style={{ marginTop: "10px" }}>No leave requests found.</p>;
  }

  const getStatusStyle = (status) => {
    switch ((status || "Pending").toLowerCase()) {
      case "approved":
        return { color: "green", fontWeight: "bold" };
      case "rejected":
        return { color: "red", fontWeight: "bold" };
      case "pending":
      default:
        return { color: "orange", fontWeight: "bold" };
    }
  };

  return (
    <div style={{ overflowX: "auto" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "20px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <thead>
          <tr style={{ background: "#2c3e50", color: "#fff" }}>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Employee Name</th>
            <th style={thStyle}>Start Date</th>
            <th style={thStyle}>End Date</th>
            <th style={thStyle}>Reason</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaves.map((leave, index) => (
            <tr
              key={leave.leaveRequestId || index}
              style={{
                background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                textAlign: "center",
              }}
            >
              <td style={tdStyle}>{leave.leaveRequestId}</td>
              <td style={tdStyle}>{leave.employeeName}</td>
              <td style={tdStyle}>{leave.startDate?.split("T")[0]}</td>
              <td style={tdStyle}>{leave.endDate?.split("T")[0]}</td>
              <td style={tdStyle}>{leave.reason || "—"}</td>
              <td style={{ ...tdStyle, ...getStatusStyle(leave.status) }}>
                {leave.status || "Pending"}
              </td>
              <td style={tdStyle}>
                {role === "HR" ? (
                  <>
                    <button
                      onClick={() => onApprove && onApprove(leave.leaveRequestId)}
                      style={approveBtnStyle}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onReject && onReject(leave.leaveRequestId)}
                      style={rejectBtnStyle}
                    >
                      Reject
                    </button>
                  </>
                ) : role === "Admin" ? (
                  <span style={{ color: "red", fontWeight: "bold" }}>No actions</span>
                ) : (
                  "—"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: "12px",
  border: "1px solid #ddd",
  textAlign: "center",
};

const tdStyle = {
  padding: "12px",
  border: "1px solid #ddd",
};

const approveBtnStyle = {
  padding: "6px 12px",
  marginRight: "6px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#27ae60",
  color: "#fff",
  cursor: "pointer",
};

const rejectBtnStyle = {
  padding: "6px 12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#c0392b",
  color: "#fff",
  cursor: "pointer",
};

export default LeaveList;
