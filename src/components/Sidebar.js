import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const { user } = useAuth();

  if (!user) return null; // no sidebar if not logged in

  return (
    <div
      className="sidebar"
      style={{
        width: "250px",
        background: "#2c3e50",
        color: "#fff",
        padding: "20px",
      }}
    >
      <h2>Dashboard</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {/* ✅ Only Admin sees Manage Users */}
        {user.role === "Admin" && (
          <li>
            <Link style={linkStyle} to="/dashboard/manage-users">
              Manage Users
            </Link>
          </li>
        )}

        {/* Admin + HR can see Employees */}
        {["Admin", "HR"].includes(user.role) && (
          <li>
            <Link style={linkStyle} to="/dashboard/manage-employees">
              Employees
            </Link>
          </li>
        )}

        {/* Common links */}
        <li>
          <Link style={linkStyle} to="/dashboard/timesheets">
            Timesheets
          </Link>
        </li>

        {/* Hide Leave Requests for PayrollProcessor */}
        {user.role !== "PayrollProcessor" && (
          <li>
            <Link style={linkStyle} to="/dashboard/leave-requests">
              Leave Requests
            </Link>
          </li>
        )}

        <li>
          <Link style={linkStyle} to="/dashboard/payroll">
            Payroll
          </Link>
        </li>
        <li>
          <Link style={linkStyle} to="/dashboard/benefits">
            Benefits
          </Link>
        </li>
      </ul>
    </div>
  );
}

const linkStyle = {
  color: "#fff",
  textDecoration: "none",
  display: "block",
  margin: "8px 0",
};

export default Sidebar;
