// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./Auth.css";
import { useAuth } from "../context/AuthContext";


function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/Authentication/Login", {
        UserName: username,
        Password: password,
      });

      /*if (response.data.token) {
        localStorage.setItem("token", response.data.token);

        if (response.data.roleId !== undefined && response.data.roleId !== null) {
          localStorage.setItem("roleId", String(response.data.roleId));
        }

        if (response.data.username) {
          localStorage.setItem("username", response.data.username);
        }

        // optional: if backend returned userId include it
        if (response.data.userId) {
          localStorage.setItem("userId", String(response.data.userId));
        }

        setIsLoggedIn(true);
        navigate("/dashboard");
      } else {
        alert("Invalid credentials");
      }*/
     if (response.data.token) {
  // ✅ Call login from AuthContext
  login(response.data, response.data.token); 

  navigate("/dashboard");
} else {
  alert("Invalid credentials");
}

    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed! Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p onClick={() => navigate("/register")} style={{ cursor: "pointer" }}>
          Don’t have an account? Register
        </p>
      </div>
    </div>
  );
}

export default Login;
