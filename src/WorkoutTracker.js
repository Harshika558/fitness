import React, { useRef, useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";


const WorkoutTracker = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState("Loading camera...");

  useEffect(() => {
    const setupCamera = async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    };
  
    const loadModel = async () => {
      await tf.ready(); 
      await tf.setBackend("webgl"); 
  
      const detector = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet);
      
      setInterval(async () => {
        const poses = await detector.estimatePoses(videoRef.current);
        analyzePose(poses);
      }, 100);
    };

    const analyzePose = (poses) => {
      if (!poses.length) return;
      const keypoints = poses[0].keypoints;

      const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
      const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
      const leftHip = keypoints.find((kp) => kp.name === "left_hip");

      if (leftShoulder && rightShoulder && leftHip) {
        const shoulderDifference = Math.abs(leftShoulder.y - rightShoulder.y);
        if (shoulderDifference > 20) {
          setFeedback("⚠️ Keep your shoulders straight!");
        } else {
          setFeedback("✅ Good form!");
        }
      }
    };

    setupCamera();
    loadModel();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "20px", color:"#ffffff" }}>
      <h1>🏋️‍♂️ Workout Tracker</h1>
      <p>{feedback}</p>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%", maxWidth: "500px" }} />
      <canvas ref={canvasRef} style={{ position: "absolute", left: 0, top: 0 }} />
    </div>
  );
};

export default WorkoutTracker;
