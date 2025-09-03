import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  addBenefit,
  getBenefitsByEmployee,
  updateBenefit,
  getAllEmployees,
  getAllBenefits,
} from "../../services/api";
import { useNavigate } from "react-router-dom";

function Benefits() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [benefits, setBenefits] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [formData, setFormData] = useState({ employeeId: "", benefitType: "", amount: "" });
  const [editingBenefit, setEditingBenefit] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Load employees for Admin/HR dropdown
  useEffect(() => {
    if (["Admin", "HR"].includes(user?.role)) fetchEmployees();
  }, [user]);

  // Fetch benefits based on role and employee selection
  useEffect(() => {
    if (!user) return;

    if (user.role === "Employee") {
      fetchBenefits(user.employeeId || user.id);
    } else if (["Admin", "HR"].includes(user.role)) {
      if (employeeId) {
        fetchBenefits(employeeId);
      } else {
        fetchAllBenefits();
      }
    } else if (user.role === "PayrollProcessor") {
      fetchAllBenefits();
    }
  }, [user, employeeId]);

  const fetchEmployees = async () => {
    try {
      const data = await getAllEmployees();
      setEmployees(data);
    } catch (err) {
      console.error("Error loading employees:", err);
    }
  };

  const fetchBenefits = async (empId) => {
    try {
      const res = await getBenefitsByEmployee(empId);
      setBenefits(res.data);
    } catch (err) {
      console.error("Error loading benefits:", err);
    }
  };

  const fetchAllBenefits = async () => {
    try {
      const res = await getAllBenefits();
      setBenefits(res.data);
    } catch (err) {
      console.error("Error loading all benefits:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBenefit) {
        await updateBenefit(editingBenefit.benefitId, formData);
        alert("✅ Benefit updated successfully");
      } else {
        await addBenefit(formData);
        alert("✅ Benefit added successfully");
      }
      setFormData({ employeeId: "", benefitType: "", amount: "" });
      setEditingBenefit(null);
      if (user.role === "Employee") fetchBenefits(user.employeeId || user.id);
      else if (employeeId) fetchBenefits(employeeId);
      else fetchAllBenefits();
    } catch (err) {
      console.error("Error saving benefit:", err);
      alert("❌ Failed to save benefit");
    }
  };

  const handleEdit = (benefit) => {
    setEditingBenefit(benefit);
    setFormData({
      employeeId: benefit.employeeId,
      benefitType: benefit.benefitType,
      amount: benefit.amount,
    });
  };

  // Filter benefits by search
  const filteredBenefits = benefits.filter((b) =>
    b.benefitType.toLowerCase().includes(searchText.toLowerCase()) ||
    (b.employeeName && b.employeeName.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <div style={{ padding: "20px" }}>
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
    ? "Manage Benefits"
    : "My Benefits"}
</h2>


     

      {/* Employee dropdown with Refresh button for Admin/HR */}
      {["Admin", "HR","PayrollProcessor"].includes(user?.role) && (
        <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={inputStyle}
          >
            <option value="">-- All Employees --</option>
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name} (ID: {emp.employeeId})
              </option>
            ))}
          </select>
          <button onClick={fetchAllBenefits} style={refreshBtnStyle}>
            🔄 Refresh
          </button>
        </div>
      )}

      {/* Form for Add/Edit (Admin/HR only) */}
      {["Admin", "HR"].includes(user?.role) && (
        <form
          onSubmit={handleSubmit}
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#f9f9f9",
            borderRadius: "8px",
          }}
        >
          <h3>{editingBenefit ? "Edit Benefit" : "Add Benefit"}</h3>
          <select
            required
            value={formData.employeeId}
            onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
            style={inputStyle}
          >
            <option value="">-- Select Employee --</option>
            {employees.map((emp) => (
              <option key={emp.employeeId} value={emp.employeeId}>
                {emp.name} (ID: {emp.employeeId})
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Benefit Type"
            value={formData.benefitType}
            onChange={(e) => setFormData({ ...formData, benefitType: e.target.value })}
            required
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            required
            style={inputStyle}
          />
          <button type="submit" style={addBtnStyle}>
            {editingBenefit ? "Update" : "Add"}
          </button>
          {editingBenefit && (
            <button
              type="button"
              onClick={() => {
                setEditingBenefit(null);
                setFormData({ employeeId: "", benefitType: "", amount: "" });
              }}
              style={cancelBtnStyle}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      {/* Table of Benefits */}
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
            <th style={thStyle}>Employee</th>
            <th style={thStyle}>Type</th>
            <th style={thStyle}>Amount</th>
            {["Admin", "HR"].includes(user?.role) && <th style={thStyle}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredBenefits.map((b, index) => (
            <tr
              key={b.benefitId}
              style={{
                background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                textAlign: "center",
              }}
            >
              <td style={tdStyle}>{b.benefitId}</td>
              <td style={tdStyle}>{b.employeeName || b.employeeId}</td>
              <td style={tdStyle}>{b.benefitType}</td>
              <td style={tdStyle}>{b.amount}</td>
              {["Admin", "HR"].includes(user?.role) && (
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(b)} style={editBtnStyle}>
                    ✏️ Edit
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

const cancelBtnStyle = {
  background: "#95a5a6",
  color: "#fff",
  padding: "8px 12px",
  marginLeft: "5px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const editBtnStyle = {
  background: "#2980b9",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const refreshBtnStyle = {
  background: "#f39c12",
  color: "#fff",
  padding: "8px 12px",
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

export default Benefits;
