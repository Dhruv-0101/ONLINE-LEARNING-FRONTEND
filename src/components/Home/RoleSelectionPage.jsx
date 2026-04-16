import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserGraduate, FaChalkboardTeacher, FaArrowRight, FaRobot, FaRocket, FaGlobe, FaBookOpen } from "react-icons/fa";
import "./RoleSelectionPage.css";
import { checkUserAuthStatusAPI } from "../../reactQuery/user/usersAPI";

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await checkUserAuthStatusAPI();
        if (data.isAuthenticated) {
          if (data.user.role === "student") {
            navigate("/student-dashboard");
          } else if (data.user.role === "instructor") {
            navigate("/instructor-courses");
          } else {
            navigate(-1);
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

  // Mouse hover effect for glass cards
  const handleMouseMove = (e) => {
    const cards = document.getElementsByClassName("role-card");
    for (const card of cards) {
      const rect = card.getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  const features = [
    {
      icon: <FaBookOpen />,
      title: "Universal Roadmaps",
      description: "Carefully curated paths for every domain—from technical engineering to lifestyle and personal growth."
    },
    {
      icon: <FaRocket />,
      title: "Practical Mastery",
      description: "Master any skill through hands-on challenges and industrial-grade projects in your chosen field."
    },
    {
      icon: <FaGlobe />,
      title: "Expert Mentorship",
      description: "Connect with world-class instructors across a diverse landscape of disciplines and industries."
    }
  ];

  return (
    <div className="role-selection-wrapper" onMouseMove={handleMouseMove}>
      <div className="bg-glow-1"></div>
      <div className="bg-glow-2"></div>

      <motion.div 
        className="role-selection-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="role-header" variants={itemVariants}>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Skill Buddy
          </motion.h1>
          <motion.p variants={itemVariants}>
            Unlock Your Potential, Master Any Skill. A high-performance ecosystem designed to transform learners into experts in any domain.
          </motion.p>
        </motion.div>

        <motion.div className="platform-intro" variants={itemVariants}>
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                className="feature-item"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="role-selection-title">
          <h2>Select Your Path</h2>
          <p>Choose your role to get started</p>
        </motion.div>


        <div className="role-cards-container">
          <motion.div 
            className="role-card-wrapper" 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="role-card"
              onClick={() => handleSelection("student")}
            >
              <div className="role-icon-box">
                <FaUserGraduate />
              </div>
              <h2>I am a Student</h2>
              <p>
                Dive into a personalized learning journey with structural insights, 
                interactive challenges, and a community of innovators.
              </p>
              <div className="role-card-footer">
                <button className="action-btn">
                  Start Learning <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="role-card-wrapper" 
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div 
              className="role-card"
              onClick={() => handleSelection("instructor")}
            >
              <div className="role-icon-box">
                <FaChalkboardTeacher />
              </div>
              <h2>I am an Instructor</h2>
              <p>
                Build and manage high-impact courses,  
                and share your expertise with the world.
              </p>
              <div className="role-card-footer">
                <button className="action-btn">
                  Start Teaching <FaArrowRight className="btn-arrow" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="mt-12 text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 1, duration: 2 }}
        >

        </motion.div>
      </motion.div>
    </div>
  );
};

export default RoleSelectionPage;
