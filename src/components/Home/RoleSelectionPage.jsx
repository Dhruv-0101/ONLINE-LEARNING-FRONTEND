// src/components/Home/RoleSelectionPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelectionPage.css";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const handleSelection = (role) => {
    if (role === "student") {
      navigate("/home");
    } else if (role === "instructor") {
      navigate("/InstructorRegister");
    }
  };

  return (
    <div className="role-selection-container">
      <h1>Welcome to the Learning Platform</h1>
      <p>Please select your role to proceed:</p>
      <div className="role-buttons">
        <button
          className="role-button student-button"
          onClick={() => handleSelection("student")}
        >
          I am a Student
        </button>
        <button
          className="role-button instructor-button"
          onClick={() => handleSelection("instructor")}
        >
          I am an Instructor
        </button>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
