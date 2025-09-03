import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // <-- added
import {
  calculatePayroll,
  verifyPayroll,
  processPayroll,
  payrollHistory,
  getAllPayrolls,
} from "../../services/api";

function Payroll() {
  const { user } = useAuth();
  const navigate = useNavigate(); // <-- added
  const [employeeId, setEmployeeId] = useState("");
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payrollDate, setPayrollDate] = useState("");
  const [currentSearch, setCurrentSearch] = useState(null);

  const fetchPayrolls = async (searchId = null) => {
    try {
      setLoading(true);
      let res;

      if (user?.role === "Employee") {
        console.log("Employee payroll request for ID:", user.employeeId);
        res = await payrollHistory(user.employeeId);
        console.log("Payroll API response:", res.data);
        setCurrentSearch(user.employeeId);
      } else {
        if (searchId) {
          res = await payrollHistory(searchId);
          setCurrentSearch(searchId);
        } else {
          res = await getAllPayrolls();
          setCurrentSearch(null);
        }
      }

      setPayrolls(res.data);
    } catch (err) {
      alert("Error fetching payrolls!");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [user]);

  const handleSearch = () => {
    if (!employeeId) return alert("Enter Employee ID");
    fetchPayrolls(employeeId);
  };

  const handleCalculate = async () => {
    if (!employeeId || !payrollDate) return alert("Enter Employee ID & Payroll Date");
    try {
      await calculatePayroll(employeeId, payrollDate);
      alert("Payroll calculated!");
      fetchPayrolls(currentSearch);
    } catch (err) {
      alert("Error calculating payroll!");
      console.error(err);
    }
  };

  const handleVerify = async (id) => {
    try {
      const res = await verifyPayroll(id);
      alert(res.data ? "Verified!" : "Verification failed");
      fetchPayrolls(currentSearch);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProcess = async (id) => {
    try {
      await processPayroll(id);
      alert("Payroll processed!");
      fetchPayrolls(currentSearch);
    } catch (err) {
      console.error(err);
    }
  };

  return (
   // <div style={{ maxWidth: "1000px", margin: "20px auto", fontFamily: "'Segoe UI', sans-serif" }}>
   //<div style={{ width: "100%", padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>
   
  <div style={{ width: "100%", padding: "20px", fontFamily: "'Segoe UI', sans-serif" }}>


      
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

      <h2>
  {["Admin", "HR", "PayrollProcessor"].includes(user?.role)
    ? "Payroll Management"
    : "My Payrolls"}
</h2>


      {["Admin", "HR","PayrollProcessor"].includes(user?.role) && (
        <div style={{ marginBottom: "15px" }}>
          <input
            type="text"
            placeholder="Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={inputStyle}
          />
          <input
            type="date"
            value={payrollDate}
            onChange={(e) => setPayrollDate(e.target.value)}
            style={inputStyle}
          />
          <button style={calculateButtonStyle} onClick={handleCalculate}>
            Calculate Payroll
          </button>
        </div>
      )}

     {["Admin", "HR","PayrollProcessor"].includes(user?.role) && (
  <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
    <input
      type="text"
      placeholder="Search by Employee ID"
      value={employeeId}
      onChange={(e) => setEmployeeId(e.target.value)}
      style={inputStyle}
    />
    <button style={searchButtonStyle} onClick={handleSearch}>
      Search
    </button>
    <button
      style={refreshButtonStyle}
      onClick={() => {
        setEmployeeId("");
        fetchPayrolls();
      }}
    >
      Refresh
    </button>
  </div>
)}



      <h3>Payroll History</h3>
      {loading ? (
        <p>Loading payrolls...</p>
      ) : (
        <table style={tableStyle}>
          <thead style={{ background: "#2c3e50", color: "#fff" }}>
            <tr>
              <th style={thStyle}>Payroll ID</th>
              <th style={thStyle}>Employee Name</th>
              <th style={thStyle}>Employee ID</th>
              <th style={thStyle}>Payroll Date</th>
              <th style={thStyle}>Gross Salary</th>
              <th style={thStyle}>Tax</th>
              <th style={thStyle}>Net Salary</th>
              <th style={thStyle}>Processed</th>
              <th style={thStyle}>Status</th>
              {["Admin", "HR", "PayrollProcessor"].includes(user?.role) && <th style={thStyle}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {payrolls.map((p, index) => (
              <tr
                key={p.payrollId}
                style={{
                  background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                  textAlign: "center",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <td style={tdStyle}>{p.payrollId}</td>
                <td style={tdStyle}>{p.employeeName}</td>
                <td style={tdStyle}>{p.employeeId}</td>
                <td style={tdStyle}>{p.payrollDate?.split("T")[0]}</td>
                <td style={tdStyle}>{p.grossSalary}</td>
                <td style={tdStyle}>{p.taxAmount}</td>
                <td style={tdStyle}>{p.netSalary}</td>
                <td style={tdStyle}>{p.isProcessed ? "True" : "False"}</td>

                <td style={tdStyle}>
                  {p.isProcessed ? (
                    <span style={{ color: "green", fontWeight: "bold" }}>Processed</span>
                  ) : p.isVerified ? (
                    <span style={{ color: "blue", fontWeight: "bold" }}>Verified</span>
                  ) : (
                    <span style={{ color: "orange", fontWeight: "bold" }}>Pending</span>
                  )}
                </td>

                {["Admin", "HR", "PayrollProcessor"].includes(user?.role) && (
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: "5px", justifyContent: "center" }}>
                      {!p.isVerified && !p.isProcessed && ["Admin", "HR"].includes(user.role) && (
                        <button
                          style={verifyButtonStyle}
                          onClick={() => handleVerify(p.payrollId)}
                        >
                          Verify
                        </button>
                      )}
                      {p.isVerified && !p.isProcessed && ["Admin", "PayrollProcessor"].includes(user.role) && (
                        <button
                          style={processButtonStyle}
                          onClick={() => handleProcess(p.payrollId)}
                        >
                          Process
                        </button>
                      )}
                      {p.isProcessed && (
                        <span style={{ color: "red", fontWeight: "bold" }}>No Actions</span>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------- Styles ----------
const inputStyle = {
  padding: "8px",
  marginRight: "8px",
  borderRadius: "4px",
  border: "1px solid #ccc",
  minWidth: "120px",
};
const calculateButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#3498db",
  color: "#fff",
  cursor: "pointer",
  marginLeft: "5px",
};
const searchButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#7f8c8d",
  color: "#fff",
  cursor: "pointer",
};

const refreshButtonStyle = {
  padding: "8px 12px",
  border: "none",
  borderRadius: "4px",
  backgroundColor: "#16a085",
  color: "#fff",
  cursor: "pointer",
};
const verifyButtonStyle = {
  padding: "5px 10px",
  marginRight: "5px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#2ecc71",
  color: "#fff",
  cursor: "pointer",
};
const processButtonStyle = {
  padding: "5px 10px",
  borderRadius: "4px",
  border: "none",
  backgroundColor: "#e67e22",
  color: "#fff",
  cursor: "pointer",
};
//const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "10px" };
const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: "10px",
  tableLayout: "fixed", // optional: makes columns consistent width
};

const thStyle = { padding: "10px", border: "1px solid #ddd" };
const tdStyle = { padding: "10px", border: "1px solid #ddd" };

export default Payroll;
