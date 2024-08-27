// // src/components/Home/RoleSelectionPage.js
// import React from "react";
// import { useNavigate } from "react-router-dom";
// import "./RoleSelectionPage.css";
// import { checkUserAuthStatusAPI } from "../../reactQuery/user/usersAPI";
// import { useEffect } from "react";

// const RoleSelectionPage = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       try {
//         const data = await checkUserAuthStatusAPI();
//         console.log(data)
//         if (data.isAuthenticated) {
//           // Redirect user to the previous page or home if authenticated
//           navigate(-1); // Go back to the previous page
//         }
//       } catch (error) {
//         console.error("Failed to check authentication status", error);
//       }
//     };

//     checkAuthStatus();
//   }, [navigate]);

//   const handleSelection = (role) => {
//     if (role === "student") {
//       navigate("/home");
//     } else if (role === "instructor") {
//       navigate("/InstructorRegister");
//     }
//   };

//   return (
//     <div className="role-selection-container">
//       <h1>Welcome to the Learning Platform</h1>
//       <p>Please select your role to proceed:</p>
//       <div className="role-buttons">
//         <button
//           className="role-button student-button"
//           onClick={() => handleSelection("student")}
//         >
//           I am a Student
//         </button>
//         <button
//           className="role-button instructor-button"
//           onClick={() => handleSelection("instructor")}
//         >
//           I am an Instructor
//         </button>
//       </div>
//     </div>
//   );
// };

// export default RoleSelectionPage;

// src/components/Home/RoleSelectionPage.js
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RoleSelectionPage.css";
import { checkUserAuthStatusAPI } from "../../reactQuery/user/usersAPI";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await checkUserAuthStatusAPI();
        console.log(data);

        if (data.isAuthenticated) {
          // Redirect user based on their role
          if (data.user.role === "student") {
            navigate("/student-dashboard");
          } else if (data.user.role === "instructor") {
            navigate("/instructor-courses");
          } else {
            navigate(-1); // Default to navigating back if role is unrecognized
          }
        }
      } catch (error) {
        console.error("Failed to check authentication status", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

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
