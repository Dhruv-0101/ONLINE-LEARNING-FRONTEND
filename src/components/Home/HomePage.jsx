import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FaLaptopCode,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaArrowRight
} from "react-icons/fa";
import "./HomePage.css";

const Homepage = () => {
  const navigate = useNavigate();

  const handleSignUpClick = () => {
    navigate("/register");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const features = [
    {
      icon: <FaLaptopCode />,
      title: "Latest Technologies",
      description: "Learn with the latest tools and technologies across diverse fields and digital domains.",
      color: "text-blue-400"
    },
    {
      icon: <FaUserGraduate />,
      title: "Expert Instructors",
      description: "Guidance from industry professionals with real-world experience.",
      color: "text-purple-400"
    },
    {
      icon: <FaChalkboardTeacher />,
      title: "Interactive Learning",
      description: "Engaging and interactive lessons to enhance your learning experience.",
      color: "text-cyan-400"
    }
  ];

  return (
    <div className="home-wrapper">
      <div className="home-bg-glow glow-top-right"></div>
      <div className="home-bg-glow glow-bottom-left"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="container mx-auto"
        >
          {/* <motion.span variants={itemVariants} className="section-label">
            Skill Buddy // Universal Learning Ecosystem
          </motion.span> */}
          <motion.h1 variants={itemVariants} className="hero-title">
            Unlock Your Digital Potential with Skill Buddy
          </motion.h1>
          <motion.p variants={itemVariants} className="hero-subtitle">
            Experience a new standard of education. From technology and fitness to business and lifestyle, Skill Buddy provides the tools to master any field.
          </motion.p>
          <motion.div variants={itemVariants} className="hero-cta">
            {/* Explore Courses removed as per user request */}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span className="section-label">Our Philosophy</span>
          <h2 className="section-title">Learning Across Every Domain</h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                whileHover={{ y: -10 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className={`feature-icon-wrapper ${feature.color}`}>
                  {feature.icon}
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <motion.div
          className="cta-card"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-6">Start Your Learning Journey Today</h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join Skill Buddy and start building your future with guidance from industry experts.
          </p>
          <button 
            onClick={handleSignUpClick}
            className="primary-btn text-lg px-10 py-4"
          >
            Sign Up Now
          </button>
        </motion.div>
      </section>

      {/* Footer Decoration */}
      <footer className="py-6 text-center border-t border-white/5">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-200">
          &copy; 2026 Developed & Owned by Dhruv. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Homepage;
