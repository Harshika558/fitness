import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import Dashboard from "./dashboard";
import Chatbot from "./chatbot";
import WorkoutTracker from "./WorkoutTracker";
import Navbar from "./components/navbar"; // ✅ Import Navbar
import Home from "./pages/home";
import "./assets/style.css";
import About from "./pages/about";
import Contact from "./pages/contact";
import "./background.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/workout-tracker" element={<WorkoutTracker />} />
      </Routes>
    </Router>
  );
};

export default App;
