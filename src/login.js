import React, { useState } from "react";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState(""); 
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form..."); 
    
    try {
      let userCredential;
  
      if (isSignUp) {
        console.log("Signing up user:", email); 
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName: userName });
        console.log("Signup successful, user:", user); 
      } else {
        console.log("Logging in user:", email);
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log("Login successful, user:", userCredential.user); 
      }
  
      navigate("/dashboard"); // Redirect after login/signup
    } catch (error) {
      console.error("Error during login/signup:", error); 
      alert(error.message);
    }
  };
  


return (
  <div className="auth-container">
    <div className="auth-box">
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            placeholder="Enter Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        )}
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      </form>
      <p>
        {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
        <span onClick={() => setIsSignUp(!isSignUp)}>{isSignUp ? "Login" : "Sign up"}</span>
      </p>
    </div>
  </div>
);
};

export default Login;
