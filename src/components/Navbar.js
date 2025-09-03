import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // <-- fixed path
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">EasyPay</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        {!user && <li><Link to="/login">Login</Link></li>}
        {!user && <li><Link to="/register">Register</Link></li>}
        {user && <li><Link to="/dashboard">Dashboard</Link></li>}
        {user && (
          <li>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
