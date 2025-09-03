import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- added
import {
  getAllEmployees,
  getEmployeeById,   
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/api";
import axios from "axios";

const ManageEmployees = () => {
  const navigate = useNavigate(); // <-- added
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔍 Search state
  const [searchId, setSearchId] = useState("");

  // Form states
  const [newEmployee, setNewEmployee] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    address: "",
    dateOfBirth: "",
    joiningDate: "",
    userId: "",
    gender: "",
    basicSalary: "",
    allowances: "",
    deductions: "",
  });
  const [editEmployee, setEditEmployee] = useState(null);

  // Fetch all employees
  const fetchEmployees = () => {
    getAllEmployees()
      .then((data) => {
        setEmployees(Array.isArray(data) ? data : data.employees || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch employees error:", err.message, err.response?.data);
        setError("Failed to fetch employees");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // 🔍 Search by Employee ID
  const handleSearch = async () => {
    if (!searchId.trim()) {
      fetchEmployees();
      return;
    }

    try {
      setLoading(true);
      const res = await getEmployeeById(searchId);
      setEmployees([res.data]);
      setLoading(false);
    } catch (err) {
      console.error("Search error:", err.response?.data || err);
      setEmployees([]);
      setLoading(false);
      alert("❌ Employee not found");
    }
  };


   // Add employee
  const handleAddEmployee = (e) => {
    e.preventDefault();
    const addDTO = {
      firstName: newEmployee.firstName,
      lastName: newEmployee.lastName,
      email: newEmployee.email,
      contactNumber: newEmployee.contactNumber,
      address: newEmployee.address,
      dateOfBirth: newEmployee.dateOfBirth
        ? new Date(newEmployee.dateOfBirth).toISOString()
        : null,
      joiningDate: newEmployee.joiningDate
        ? new Date(newEmployee.joiningDate).toISOString()
        : null,
      gender: newEmployee.gender || "",
      userId: Number(newEmployee.userId) || 0,
      basicSalary: Number(newEmployee.basicSalary) || 0,
      allowances: Number(newEmployee.allowances) || 0,
      deductions: Number(newEmployee.deductions) || 0,
    };

    createEmployee(addDTO)
      .then(() => {
        fetchEmployees();
        setNewEmployee({
          firstName: "",
          lastName: "",
          email: "",
          contactNumber: "",
          address: "",
          dateOfBirth: "",
          joiningDate: "",
          userId: "",
          gender: "",
          basicSalary: "",
          allowances: "",
          deductions: "",
        });
        alert("✅ Employee added successfully!");
      })
      .catch((err) => console.error("Add error:", err.response?.data || err));
  };

  // Update employee
  const handleUpdateEmployee = (e) => {
    e.preventDefault();

    const updateDTO = {
      employeeId: editEmployee.employeeId,
      firstName: editEmployee.firstName,
      lastName: editEmployee.lastName,
      email: editEmployee.email,
      contactNumber: editEmployee.contactNumber,
      address: editEmployee.address,
      dateOfBirth: editEmployee.dateOfBirth
        ? new Date(editEmployee.dateOfBirth).toISOString()
        : null,
      joiningDate: editEmployee.joiningDate
        ? new Date(editEmployee.joiningDate).toISOString()
        : null,
      gender: editEmployee.gender || "",
      userId: Number(editEmployee.userId) || 0,
      basicSalary: Number(editEmployee.basicSalary) || 0,
      allowances: Number(editEmployee.allowances) || 0,
      deductions: Number(editEmployee.deductions) || 0,
    };

    updateEmployee(editEmployee.employeeId, updateDTO)
      .then(() => {
        fetchEmployees();
        setEditEmployee(null);
        alert("✅ Employee updated successfully!");
      })
      .catch((err) => console.error("Update error:", err.response?.data || err));
  };

  // Delete employee
  const handleDeleteEmployee = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    deleteEmployee(id)
      .then(() => fetchEmployees())
      .catch((err) => console.error("Delete error:", err.response?.data || err));
  };



  // ... rest of your existing add/update/delete code remains unchanged ...

  if (loading) return <p>Loading employees...</p>;
  if (error) return <p>{error}</p>;

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

      <h2 style={{ marginBottom: "20px" }}>Manage Employees</h2>

      {/* 🔍 Search Employee by ID */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="number"
          placeholder="Enter Employee ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={inputStyle}
        />
        <button onClick={handleSearch} style={editBtnStyle}>
          🔍 Search
        </button>
        <button onClick={fetchEmployees} style={cancelBtnStyle}>
          🔄 Reset
        </button>
      </div>

      {/* Add Employee Form */}
      {/* ... rest of your existing form and table code remains unchanged ... */}
            {/* ✅ Add Employee Form (unchanged) */}
      {/* ... your existing add/edit forms and employee table remain here ... */}



      {/* Add Employee Form */}
      <form
        onSubmit={handleAddEmployee}
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "#f9f9f9",
          borderRadius: "8px",
        }}
      >
        <h3>Add New Employee</h3>
        <input
          type="text"
          placeholder="First Name"
          value={newEmployee.firstName}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, firstName: e.target.value })
          }
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={newEmployee.lastName}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, lastName: e.target.value })
          }
          required
          style={inputStyle}
        />
        <input
          type="email"
          placeholder="Email"
          value={newEmployee.email}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, email: e.target.value })
          }
          required
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Contact Number"
          value={newEmployee.contactNumber}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, contactNumber: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="text"
          placeholder="Address"
          value={newEmployee.address}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, address: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="date"
          value={newEmployee.dateOfBirth}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, dateOfBirth: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="date"
          value={newEmployee.joiningDate}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, joiningDate: e.target.value })
          }
          style={inputStyle}
        />

        <select
          value={newEmployee.gender}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, gender: e.target.value })
          }
          style={inputStyle}
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <input
          type="number"
          placeholder="Basic Salary"
          value={newEmployee.basicSalary}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, basicSalary: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Allowances"
          value={newEmployee.allowances}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, allowances: e.target.value })
          }
          style={inputStyle}
        />
        <input
          type="number"
          placeholder="Deductions"
          value={newEmployee.deductions}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, deductions: e.target.value })
          }
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="User ID"
          value={newEmployee.userId}
          onChange={(e) =>
            setNewEmployee({ ...newEmployee, userId: e.target.value })
          }
          required
          style={inputStyle}
        />
        <button type="submit" style={addBtnStyle}>
          ➕ Add Employee
        </button>
      </form>

      


      {/* Employees Table */}
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
            <th style={thStyle}>EmployeeID</th>
            <th style={thStyle}>User ID</th>
            <th style={thStyle}>Full Name</th>
            <th style={thStyle}>Gender</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Contact</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>DOB</th>
            <th style={thStyle}>Joining</th>
            <th style={thStyle}>Basic Salary</th>
            <th style={thStyle}>Allowances</th>
            <th style={thStyle}>Deductions</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp, index) => (
            <tr
              key={emp.employeeId}
              style={{
                background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                textAlign: "center",
              }}
            >
              <td style={tdStyle}>{emp.employeeId}</td>
              <td style={tdStyle}>{emp.userId}</td>
              <td style={tdStyle}>
                {emp.firstName} {emp.lastName}
              </td>
              <td style={tdStyle}>{emp.gender}</td>
              <td style={tdStyle}>{emp.email}</td>
              <td style={tdStyle}>{emp.contactNumber}</td>
              <td style={tdStyle}>{emp.address}</td>
              <td style={tdStyle}>
                {emp.dateOfBirth
                  ? new Date(emp.dateOfBirth).toLocaleDateString()
                  : ""}
              </td>
              <td style={tdStyle}>
                {emp.joiningDate
                  ? new Date(emp.joiningDate).toLocaleDateString()
                  : ""}
              </td>
              <td style={tdStyle}>{emp.basicSalary}</td>
              <td style={tdStyle}>{emp.allowances}</td>
              <td style={tdStyle}>{emp.deductions}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => setEditEmployee(emp)}
                  style={editBtnStyle}
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteEmployee(emp.employeeId)}
                  style={deleteBtnStyle}
                >
                  🗑 Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


    
  


// ✅ Reused styles
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

const editBtnStyle = {
  background: "#2980b9",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "5px",
};

const deleteBtnStyle = {
  background: "#c0392b",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
};

const cancelBtnStyle = {
  background: "#7f8c8d",
  color: "#fff",
  padding: "6px 10px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginLeft: "10px",
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

export default ManageEmployees;
