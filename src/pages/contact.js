import React, { useState } from "react"; // 🛠️ Add useState here!
import "../assets/contact.css";
//import contactImg from "../assets/logo-dark.png"; // Import an image

const Contact = () => {
    const [showPopup, setShowPopup] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default page reload
        setShowPopup(true); // Show pop-up after submission
      
        // Clear the form after submission (optional)
        setTimeout(() => {
          setShowPopup(false); // Hide pop-up after 3 seconds
        }, 3000);
      };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h2>📞 Get in Touch</h2>
        <p>We'd love to hear from you! Reach out to us anytime.</p>
      </div>

      <div className="contact-content">
        {/* Left Side - Contact Details */}
        <div className="contact-info">
          
          <h3>📍 Our Location</h3>
          <p>Chennai</p>

          <h3>📞 Phone</h3>
          <p>+91 98765 43210</p>

          <h3>📧 Email</h3>
          <p>contact@fitnesshub.com</p>

          <h3>🔗 Follow Us</h3>
          <div className="social-icons">
            <a href="https://facebook.com" target="_blank" rel="noreferrer">📘 Facebook</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">📸 Instagram</a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">🐦 Twitter</a>
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="contact-form">
          <h3>✉️ Send a Message</h3>
          <form>
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit">🚀 Send Message</button>
          </form>
          {showPopup && <div className="popup">✅ Message Sent Successfully!</div>}
        </div>
      </div>
    </div>
  );
};

export default Contact;
