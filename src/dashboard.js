import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { onAuthStateChanged,signOut } from "firebase/auth";
import { collection, addDoc, onSnapshot, query, where, doc, deleteDoc, updateDoc} from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./dashboard.css";


const NUTRITIONIX_APP_ID = "50852f25";  
const NUTRITIONIX_APP_KEY = "7c21781843332c553e2518b97bf3de37";  

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [data, setData] = useState([]);
  const [exercise, setExercise] = useState("");
  const [workoutData, setWorkoutData] = useState(null);
  const navigate = useNavigate();
  const [chartData, setChartData] = useState([]); 
  const [editingWorkout, setEditingWorkout] = useState(null); 
  const [updatedDuration, setUpdatedDuration] = useState("");
  const [updatedCalories, setUpdatedCalories] = useState("");



  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        console.log("User loaded:", currentUser); 
        setUser(currentUser);
      }
    });
  
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!user) return;
  
    const q = query(collection(db, "workouts"), where("userId", "==", user.uid));
  
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const workoutList = [];
      const chartFormattedData = [];
  
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const workoutDate = new Date(data.timestamp.seconds * 1000).toLocaleDateString();
  
        workoutList.push({ id: doc.id, ...data });
  
        chartFormattedData.push({
          date: workoutDate,
          calories: data.calories,
          duration: data.duration,
        });
      });
  
      setData(workoutList); 
      setChartData(chartFormattedData); 
    });
  
    return () => unsubscribe();
  }, [user]); 
  


  const fetchWorkoutData = async () => {
    if (!exercise) return alert("Enter a workout!");

    try {
      const response = await axios.post(
        "https://trackapi.nutritionix.com/v2/natural/exercise",
        { query: exercise },
        {
          headers: {
            "x-app-id": NUTRITIONIX_APP_ID,
            "x-app-key": NUTRITIONIX_APP_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      const result = response.data.exercises[0]; 

      const workoutDetails = {
        name: result.name, 
        duration: result.duration_min, 
        calories: result.nf_calories, 
        heartRate: Math.floor(Math.random() * (160 - 80 + 1) + 80), 
      };

      setWorkoutData(workoutDetails);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  
  const saveWorkout = async () => {
    if (!user) return alert("User not found! Please log in again.");
    if (!workoutData) return alert("No workout data to save!");
  
    try {
      await addDoc(collection(db, "workouts"), {
        userId: user.uid,  
        name: workoutData.name,
        duration: workoutData.duration,
        calories: workoutData.calories,
        heartRate: workoutData.heartRate,
        timestamp: new Date(),
      });
  
      alert("Workout saved successfully! ✅");
      setWorkoutData(null);
      setExercise("");
    } catch (error) {
      console.error("Error saving workout:", error);
      alert("Failed to save workout! ❌");
    }
  };
  
  //delete workout
  const deleteWorkout = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout?")) return;
  
    try {
      await deleteDoc(doc(db, "workouts", id)); 
      alert("Workout deleted successfully!");
    } catch (error) {
      console.error("Error deleting workout:", error);
      alert("Failed to delete workout.");
    }
  };

  //edit workout
  const editWorkout = async () => {
    if (!editingWorkout) return alert("No workout selected!");
  
    try {
      const workoutRef = doc(db, "workouts", editingWorkout.id);
      await updateDoc(workoutRef, {
        duration: Number(updatedDuration), 
        calories: Number(updatedCalories),
      });
  
      alert("Workout updated successfully!");
      setEditingWorkout(null); 
    } catch (error) {
      console.error("Error updating workout:", error);
      alert("Failed to update workout.");
    }
  };
  
  

  const handleLogout = () => {
    signOut(auth);
    navigate("/");
  };


  const totalCalories = chartData.reduce((acc, workout) => acc + workout.calories, 0);
  const totalDuration = chartData.reduce((acc, workout) => acc + workout.duration, 0);

  const weeklyGoal = 2000; 
  const weeklyCalories = chartData.reduce((acc, workout) => acc + workout.calories, 0);
  const goalProgress = (weeklyCalories / weeklyGoal) * 100; 



  return (
    <div className="dashboard-layout">
      
      {/*  Left Section - Account Details */}
      <div className="left-section">
        <h2>👤 Account Details</h2>
        <p><strong>Name:</strong> {user?.displayName || "User"}</p>
        <p><strong>Email:</strong> {user?.email || "Not available"}</p>
        <p><strong>Member Since:</strong> Jan 2024</p>
        <button onClick={handleLogout}>🚪Logout</button>
      </div>
  
      {/*  Right Section - Main Dashboard Content */}
      <div className="right-section">
        
        <div className="main-content">
          <h1>🏋️‍♂️ Welcome, {user?.displayName || "User"}!</h1>
  
          {/* Workout Input */}
          <div className="workout-section">
            <h2>Log a New Workout</h2>
            <input
              type="text"
              placeholder="Enter workout (e.g., running, cycling)"
              value={exercise}
              onChange={(e) => setExercise(e.target.value)}
            />
            <button onClick={fetchWorkoutData}>Get Workout Details</button>
          </div>
  
          {/* Logged Workouts */}
          <div className="logged-workouts">
            <h2>Your Logged Workouts</h2>
            {data.length === 0 ? <p>No workouts logged yet</p> : (
              <ul>
              {data.map((item) => (
                <li key={item.id}>
                  {editingWorkout?.id === item.id ? (
                    <div>
                      <input
                        type="number"
                        value={updatedDuration}
                        onChange={(e) => setUpdatedDuration(e.target.value)}
                        placeholder="Duration (min)"
                      />
                      <input
                        type="number"
                        value={updatedCalories}
                        onChange={(e) => setUpdatedCalories(e.target.value)}
                        placeholder="Calories burned"
                      />
                      <button onClick={editWorkout}>✅ Save</button>
                      <button onClick={() => setEditingWorkout(null)} style={{ color: "red" }}>❌ Cancel</button>
                    </div>
                  ) : (
                    <div>
                      <strong>{item.name}</strong> - {item.duration} min, {item.calories} kcal, ❤️ {item.heartRate} bpm
                      <button onClick={() => { 
                        setEditingWorkout(item); 
                        setUpdatedDuration(item.duration); 
                        setUpdatedCalories(item.calories); 
                      }}>✏️ Edit</button>
                      <button onClick={() => deleteWorkout(item.id)} style={{ color: "red" }}>🗑 Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            
            )}
          </div>
        </div>

        {workoutData ? (
  <div className="logged-workouts">
    <h3>🏋️ Workout: {workoutData.name}</h3>
    <p>⏳ Duration: {workoutData.duration} minutes</p>
    <p>🔥 Calories Burned: {workoutData.calories} kcal</p>
    <p>💓 Heart Rate: {workoutData.heartRate} bpm</p>
    <button onClick={saveWorkout}>Save </button>
  </div>
) : (
  <p>No workout data fetched yet. Click "Get Workout Details".</p>
)}
  
        {/*  Progress & Weekly Goal Container */}
        <div className="progress-goal-container">
          
          {/*  Progress Over Time */}
          <div className="progress-container">
            <h2>📊 Progress Over Time</h2>
            <div className="progress-chart">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calories" stroke="#FF5733" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
  
          {/*  Weekly Goal */}
          <div className="weekly-goal">
            <h2>🎯 Weekly Goal: Burn {weeklyGoal} kcal</h2>
            <p>🔥 Calories Burned This Week: {weeklyCalories} kcal</p>
            <div className="goal-bar-container">
              <div className="goal-bar" style={{ width: `${goalProgress}%`, backgroundColor: goalProgress >= 100 ? "green" : "orange" }}></div>
            </div>
            {goalProgress >= 100 && <p className="congrats-message">🎉 Congrats! You hit your weekly goal!</p>}
          </div>
  
        </div>
  
        {/*  Chat with AI */}
        <Link to="/chatbot">
          <button className="chat-btn">💬 Chat with AI</button>
        </Link>
  
        <button className="nvgt" onClick={() => navigate("/workout-tracker")}>📹 Open Workout Tracker</button>

      </div>
    </div>
  );
  
  
}  
export default Dashboard;
