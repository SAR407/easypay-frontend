import { useState } from "react";
import { register } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

function Register() {
  const [form, setForm] = useState({
    Username: "",
    Email: "",
    Password: "",
    RoleId: 3,
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      alert("Registered successfully!");
      navigate("/");
    } catch (err) {
      alert("Registration failed!");
      console.error(err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="Username"
            placeholder="Username"
            value={form.Username}
            onChange={handleChange}
          />
          <input
            name="Email"
            placeholder="Email"
            value={form.Email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="Password"
            placeholder="Password"
            value={form.Password}
            onChange={handleChange}
          />
          <select name="RoleId" value={form.RoleId} onChange={handleChange}>
            <option value={1}>Admin</option>
            <option value={2}>HR</option>
            <option value={3}>Employee</option>
          </select>
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
