import React from "react";
import "../assets/about.css";
//import aboutImage from "../assets/service.png"; 
import { useNavigate } from "react-router-dom"; 

const About = () => {
    const navigate = useNavigate();
  return (
    <div className="about-container">
      <div className="about-content">
        <h1> About Us</h1>
        <p>
          Welcome to <strong>Fitness Hub</strong> - your ultimate destination for fitness, health, and nutrition!  
          Our mission is to help you achieve your fitness goals through expert advice, personalized workout plans,  
          and science-backed nutrition guidance.
        </p>
        <p>
          Whether you're a beginner or a seasoned athlete, we've got everything you need to stay motivated  
          and make sustainable progress. Join us and start your fitness journey today!
        </p>
        <button className="join-btn"onClick={() => navigate("/login")}>Join the Community </button>
      </div>

      
    </div>
  );
};

export default About;
