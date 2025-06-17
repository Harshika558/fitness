import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import "./chatbot.css"; 
import { marked } from "marked";

const Chatbot = () => {
  const navigate = useNavigate();  
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]); 

  const handleSend = async () => {
    if (!query.trim()) return;

    const userMessage = { sender: "You", text: query };

    
    setChatHistory((prevHistory) => [...prevHistory, userMessage]);

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", { message: query });

      const botResponse = { sender: "Bot", text: res.data.reply || "Sorry, I couldn't fetch a response." };

      
      setChatHistory((prevHistory) => [...prevHistory, botResponse]);
    } catch (error) {
      console.error("🔥 Chatbot Error:", error);
      const errorMessage = { sender: "Bot", text: "⚠️ Error: Unable to fetch response." };

      
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
    }

    setQuery(""); 
  };

  return (
    <div className="chat-container">
      <h2>💬 Fitness Chatbot</h2>

      {/* Chat History */}
      <div className="chat-history">
        {chatHistory.map((msg, index) => (
          <p key={index} className={msg.sender === "You" ? "user-msg" : "bot-msg"}>
            <strong>{msg.sender}:</strong>
            <span dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
          </p>
        ))}
      </div>

      {/* Input & Button */}
      <div className="chat-input-container">
        <input
          type="text"
          placeholder="Ask me about workouts, calories, or fitness..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      <button onClick={() => navigate("/dashboard")} className="back-button">Back to Dashboard</button>
    </div>
    
  );
};

export default Chatbot;
