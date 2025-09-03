import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      {/* Background Video */}
      <video autoPlay loop muted playsInline className="bg-video">
  <source src="/assets/image/money-bg.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>


      {/* Hero Section */}
      <div className="hero">
        <div className="hero-text">
          <h2>Welcome to EasyPay Payroll System</h2>
          <p>Manage your employees, payrolls, and HR tasks with ease.</p>
          <Link to="/register" className="hero-btn">Get Started</Link>
        </div>
        
      </div>
    </div>
  );
}

export default Home;
