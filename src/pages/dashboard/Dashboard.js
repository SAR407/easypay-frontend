import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return <p>Loading...</p>;

  const getButtons = () => {
    const buttons = [];

    if (user.role === "Admin") {
      buttons.push(
        {
          label: "Manage Users",
          description:
            "Add, edit, and control system users with full administrative privileges.",
          icon: "👤",
          path: "/dashboard/manage-users",
        },
        {
          label: "Manage Employees",
          description:
            "Access and update employee profiles, maintain personal details, job roles, performance records, and ensure compliance.",
          icon: "🧑‍💼",
          path: "/dashboard/manage-employees",
        },
        {
          label: "Leave Requests",
          description:
            "Review, approve, or reject employee leave applications while ensuring workflow continuity.",
          icon: "📅",
          path: "/dashboard/leave-requests",
        },
        {
          label: "Payroll",
          description:
            "Oversee salary processing, manage deductions, allowances, and ensure accurate disbursement of employee payments.",
          icon: "💰",
          path: "/dashboard/payroll",
        },
        {
          label: "Benefits",
          description:
            "Manage employee perks such as health insurance, bonuses, retirement plans, and other organizational benefits.",
          icon: "🎁",
          path: "/dashboard/benefits",
        },
        {
          label: "Timesheets",
          description:
            "Track employee work hours, monitor overtime, and maintain accurate records for efficient management.",
          icon: "⏱️",
          path: "/dashboard/timesheets",
        }
      );
      return buttons;
    }

    if (user.role === "HR") {
      buttons.push(
        {
          label: "Manage Employees",
          description:
            "Access and update employee profiles, maintain personal details, job roles, performance records, and ensure compliance with HR policies.",
          icon: "🧑‍💼",
          path: "/dashboard/manage-employees",
        },
        {
          label: "Leave Requests",
          description:
            "Review, approve, or reject employee leave applications while keeping track of balances and ensuring workflow continuity.",
          icon: "📅",
          path: "/dashboard/leave-requests",
        },
        {
          label: "Payroll",
          description:
            "Oversee salary processing, manage deductions, allowances, and ensure accurate disbursement of employee payments on time.",
          icon: "💰",
          path: "/dashboard/payroll",
        },
        {
          label: "Benefits",
          description:
            "Manage employee perks such as health insurance, bonuses, retirement plans, and other organizational benefit schemes.",
          icon: "🎁",
          path: "/dashboard/benefits",
        },
        {
          label: "Timesheets",
          description:
            "Track employee work hours, monitor overtime, and maintain accurate timesheet records for efficient HR management.",
          icon: "⏱️",
          path: "/dashboard/timesheets",
        }
      );
      return buttons;
    }

   if (user.role === "Employee") {
  buttons.push(
    {
      label: "My Leaves",
      description: "View and manage your leave requests easily.",
      icon: "📅",
      path: "/dashboard/leave-requests", // 🔹 Reuse existing route
    },
    {
      label: "Submit Timesheet",
      description: "Log your daily/weekly work hours for approval.",
      icon: "⏱️",
      path: "/dashboard/timesheets", // 🔹 Reuse existing route
    },
    {
      label: "My Payrolls",
      description: "Check your salary, allowances, and deductions.",
      icon: "💰",
      path: "/dashboard/payroll", // 🔹 Reuse existing route
    },
    {
      label: "My Benefits",
      description: "Explore your perks, health plans, and bonuses.",
      icon: "🎁",
      path: "/dashboard/benefits", // 🔹 Reuse existing route
    }
  );
  return buttons;
}


    // Default for PayrollProcessor / other roles
    buttons.push({
      label: "Timesheets",
      description: "Track work hours and schedules for payroll.",
      icon: "⏱️",
      path: "/dashboard/timesheets",
    });

    if (user.role !== "PayrollProcessor") {
      buttons.push({
        label: "Leave Requests",
        description: "Approve or reject leave applications as required.",
        icon: "📅",
        path: "/dashboard/leave-requests",
      });
    }

    buttons.push({
      label: "Payroll",
      description: "Process salaries, deductions, and allowances.",
      icon: "💰",
      path: "/dashboard/payroll",
    });

    buttons.push({
      label: "Benefits",
      description: "Manage employee perks, benefits, and bonuses.",
      icon: "🎁",
      path: "/dashboard/benefits",
    });

    return buttons;
  };

  const getGridStyle = () => {
    if (user.role === "Admin") {
      return { gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", padding: "20px 40px", justifyItems: "center" };
    }
    if (user.role === "PayrollProcessor") {
      return { gridTemplateColumns: "repeat(2, 1fr)", gap: "25px", padding: "20px 40px", justifyItems: "center" };
    }
    if (user.role === "Employee") {
      return {
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: "repeat(2, 1fr)",
        gap: "25px",
        padding: "20px 40px",
        justifyItems: "center",
      };
    }
    if (user.role === "HR") {
      return {
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "25px",
        padding: "20px 40px",
        justifyItems: "center",
      };
    }
    return { gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "25px", padding: "20px 40px" };
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f4f6f9",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      {/* Header */}
      <div
        style={{
          background: "#003366",
          color: "#fff",
          padding: "30px 20px",
          textAlign: "center",
          width: "100%",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "26px" }}>
          Welcome, {user.username} 👋
        </h2>
        <p style={{ margin: "8px 0 0", fontSize: "16px" }}>
          You logged in as <strong>{user.role}</strong>
        </p>
      </div>

      {/* Cards */}
      <div
        style={{
          flex: 1,
          display: "grid",
          ...getGridStyle(),
        }}
      >
        {getButtons().map((btn, idx) => (
          <div
            key={idx}
            onClick={() => navigate(btn.path)}
            style={{
              cursor: "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 6px 14px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
              }}
            >
              {/* Top pill (title) */}
              <div
                style={{
                  background: "#003366", // 🔹 Dark blue
                  color: "#fff",
                  padding: "10px 25px",
                  borderRadius: "50px",
                  textAlign: "center",
                  fontWeight: "600",
                  fontSize: "16px",
                  minWidth: "160px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                }}
              >
                {btn.label}
              </div>

              {/* Bottom square box */}
              <div
                style={{
                  border: "2px solid #003366", // 🔹 Dark blue border
                  background: "#f8faff",
                  color: "#003366",
                  borderRadius: "12px",
                  padding: "25px 20px",
                  textAlign: "center",
                  width: "260px",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
              >
                <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                  {btn.icon}
                </div>
                <p
                  style={{
                    fontSize: "15px",
                    lineHeight: "1.5",
                    margin: 0,
                  }}
                >
                  {btn.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
