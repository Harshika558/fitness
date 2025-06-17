import React from "react";
import { useNavigate } from "react-router-dom"; 

const Home = () => {
    const navigate = useNavigate();
  return (
    <div className="home">
      <header className="hero">
        <div className="hero-content">
          <h1>Transform Your Fitness Journey 💪</h1>
          <p>Track workouts, monitor progress, and stay motivated.</p>
          <button className="cta-btn" onClick={() => navigate("/login")}>Get Started</button>

        </div>
      </header>
    </div>
  );
};

export default Home;
