import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // <-- added
import api from "../../services/api";

const roleMapping = {
  Admin: 1,
  PayrollProcessor: 2,
  Employee: 3,
  HR: 4,
};

const ManageUsers = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate(); // <-- added
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form states
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    roleName: "",
  });
  const [editUser, setEditUser] = useState(null);

  // 🔎 Search state
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);

  // Fetch all users
  const fetchUsers = () => {
    api
      .get("/User", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch users");
        setLoading(false);
      });
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  // 🔎 Search user by ID
  const handleSearchUser = (e) => {
    e.preventDefault();
    if (!searchId) return;

    api
      .get(`/User/${searchId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch(() => {
        setSearchResult(null);
        alert("⚠️ User not found with this ID");
      });
  };

  // ➕ Add user
  const handleAddUser = (e) => {
    e.preventDefault();

    const userPayload = {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      roleId: roleMapping[newUser.roleName] || 0,
    };

    api
      .post("/User", userPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchUsers();
        setNewUser({ username: "", email: "", password: "", roleName: "" });
        alert("✅ User added successfully!");
      })
      .catch((err) => console.error(err));
  };

  // ✏️ Update user
  const handleUpdateUser = (e) => {
    e.preventDefault();

    const userPayload = {
      userId: editUser.userId,
      username: editUser.username,
      email: editUser.email,
      password: editUser.password || "",
      roleId: roleMapping[editUser.roleName] || 0,
    };

    api
      .put(`/User/${editUser.userId}`, userPayload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        fetchUsers();
        setEditUser(null);
        alert("✅ User updated successfully!");
      })
      .catch((err) => console.error(err));
  };

  // 🗑 Delete user
  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    api
      .delete(`/User/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => fetchUsers())
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading users...</p>;
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

      <h2 style={{ marginBottom: "20px" }}>Manage Users</h2>

      {/* 🔎 Search Form */}
      <form
        onSubmit={handleSearchUser}
        style={{
          marginBottom: "20px",
          padding: "10px",
          background: "#fff3cd",
          borderRadius: "8px",
        }}
      >
        <h3>Search User by ID</h3>
        <input
          type="number"
          placeholder="Enter User ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
          style={inputStyle}
          required
        />
        <button type="submit" style={addBtnStyle}>
          🔍 Search
        </button>
        <button
          type="button"
          onClick={() => {
            setSearchId("");
            setSearchResult(null);
            fetchUsers();
          }}
          style={cancelBtnStyle}
        >
          🔄 Reset
        </button>
      </form>

      {/* Show search result if exists */}
      {searchResult && (
        <div
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#e8f5e9",
            borderRadius: "8px",
          }}
        >
          <h3>Search Result</h3>
          <p><strong>ID:</strong> {searchResult.userId}</p>
          <p><strong>Username:</strong> {searchResult.username}</p>
          <p><strong>Email:</strong> {searchResult.email}</p>
          <p><strong>Role:</strong> {searchResult.roleName}</p>
        </div>
      )}

      {/* ➕ Add User Form */}
      <form
        onSubmit={handleAddUser}
        style={{
          marginBottom: "20px",
          padding: "15px",
          background: "#ecf0f1",
          borderRadius: "8px",
        }}
      >
        <h3>Add New User</h3>
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          style={inputStyle}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          style={inputStyle}
          required
        />
        <select
          value={newUser.roleName}
          onChange={(e) => setNewUser({ ...newUser, roleName: e.target.value })}
          style={inputStyle}
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="PayrollProcessor">Payroll Processor</option>
          <option value="Employee">Employee</option>
          <option value="HR">HR</option>
        </select>
        <button type="submit" style={addBtnStyle}>
          ➕ Add User
        </button>
      </form>

      {/* ✏️ Edit User Form */}
      {editUser && (
        <form
          onSubmit={handleUpdateUser}
          style={{
            marginBottom: "20px",
            padding: "15px",
            background: "#dfe6e9",
            borderRadius: "8px",
          }}
        >
          <h3>Edit User (ID: {editUser.userId})</h3>
          <input
            type="text"
            value={editUser.username}
            onChange={(e) =>
              setEditUser({ ...editUser, username: e.target.value })
            }
            style={inputStyle}
            required
          />
          <input
            type="email"
            value={editUser.email}
            onChange={(e) =>
              setEditUser({ ...editUser, email: e.target.value })
            }
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder="New Password (optional)"
            value={editUser.password || ""}
            onChange={(e) =>
              setEditUser({ ...editUser, password: e.target.value })
            }
            style={inputStyle}
          />
          <select
            value={editUser.roleName}
            onChange={(e) =>
              setEditUser({ ...editUser, roleName: e.target.value })
            }
            style={inputStyle}
            required
          >
            <option value="Admin">Admin</option>
            <option value="PayrollProcessor">Payroll Processor</option>
            <option value="Employee">Employee</option>
            <option value="HR">HR</option>
          </select>
          <button type="submit" style={editBtnStyle}>
            ✅ Save
          </button>
          <button
            type="button"
            onClick={() => setEditUser(null)}
            style={cancelBtnStyle}
          >
            ❌ Cancel
          </button>
        </form>
      )}

      {/* 📋 Users Table */}
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
            <th style={thStyle}>Username</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Role</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u, index) => (
            <tr
              key={u.userId}
              style={{
                background: index % 2 === 0 ? "#f9f9f9" : "#fff",
                textAlign: "center",
              }}
            >
              <td style={tdStyle}>{u.userId}</td>
              <td style={tdStyle}>{u.username}</td>
              <td style={tdStyle}>{u.email}</td>
              <td style={tdStyle}>{u.roleName || "—"}</td>
              <td style={tdStyle}>
                <button onClick={() => setEditUser(u)} style={editBtnStyle}>
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteUser(u.userId)}
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

export default ManageUsers;
