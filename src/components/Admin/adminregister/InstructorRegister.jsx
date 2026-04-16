import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiAward, FiLayout, FiVideo, FiClipboard, FiUsers, FiMessageSquare } from "react-icons/fi";
import { FaCubes } from "react-icons/fa";
import { registerInstructorAPI } from "../../../reactQuery/user/usersAPI";
import AlertMessage from "../../Alert/AlertMessage";
import "../../User/Auth.css";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  username: Yup.string().required("Username is required"),
});

const InstructorRegister = () => {
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: registerInstructorAPI });
  
  const formik = useFormik({
    initialValues: { email: "", password: "", username: "" },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutateAsync(values).then(() => {
        navigate("/LoginInstructor");
      });
    },
  });

  const { isAuthenticated, isLoading, userProfile } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (userProfile?.role === "student") navigate("/student-dashboard");
      else if (userProfile?.role === "instructor") navigate("/instructor-courses");
    }
  }, [isAuthenticated, isLoading, userProfile, navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.1, duration: 0.6, ease: "easeOut" }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-bg-glow glow-1" style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)" }}></div>
      <div className="auth-bg-glow glow-2"></div>

      <motion.div 
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ borderColor: "rgba(168, 85, 247, 0.2)" }}
      >
        <div className="auth-form-side">
          {/* Logo Section */}
          <motion.div variants={itemVariants} className="mb-8">
            <Link to="/" className="inline-flex items-center gap-2 group transition-all duration-300">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-all">
                <FaCubes className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                Skill Buddy
              </span>
            </Link>
          </motion.div>

          <div className="auth-header text-left">
            <motion.div 
              variants={itemVariants}
              className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4 border border-purple-500/30"
            >
              <FiAward className="text-purple-400 text-xl" />
            </motion.div>
            <motion.h1 variants={itemVariants}>Instructor Enrollment</motion.h1>
            <motion.p variants={itemVariants}>Enroll as an instructor to manage and publish courses</motion.p>
          </div>

          {mutation.isError && (
            <AlertMessage
              type="error"
              message={mutation.error.response?.data?.message || mutation.error.message}
            />
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-1">
            <motion.div className="input-group" variants={itemVariants}>
              <div className={`input-wrapper ${formik.touched.username && formik.errors.username ? 'border-red-500/50' : ''}`}>
                <FiUser className="input-icon" />
                <input
                  type="text"
                  {...formik.getFieldProps("username")}
                  placeholder="Full Name"
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <div className="err-msg">{formik.errors.username}</div>
              )}
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
              <div className={`input-wrapper ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : ''}`}>
                <FiMail className="input-icon" />
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Instructor Email"
                />
              </div>
              {formik.touched.email && formik.errors.email && (
                <div className="err-msg">{formik.errors.email}</div>
              )}
            </motion.div>

            <motion.div className="input-group" variants={itemVariants}>
              <div className={`input-wrapper ${formik.touched.password && formik.errors.password ? 'border-red-500/50' : ''}`}>
                <FiLock className="input-icon" />
                <input
                  type="password"
                  {...formik.getFieldProps("password")}
                  placeholder="Password"
                />
              </div>
              {formik.touched.password && formik.errors.password && (
                <div className="err-msg">{formik.errors.password}</div>
              )}
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="submit-btn" 
              style={{ background: "linear-gradient(135deg, #6B21A8 0%, #3B82F6 100%)" }}
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Processing..." : "Sign Up as Instructor"}
            </motion.button>
          </form>

          <motion.div className="alt-action" variants={itemVariants}>
            Already have an account? 
            <Link to="/LoginInstructor" className="alt-link" style={{ color: "#A855F7" }}>Login Here</Link>
          </motion.div>
        </div>

        <div className="auth-info-side">
          <h3 className="info-title">Instructor Benefits</h3>
          <div className="feature-list">
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)'}}><FiLayout /></div>
              <div className="feature-item-small-text">
                <h4>Course Builder</h4>
                <p>Create detailed courses with structured, high-impact modules.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)'}}><FiVideo /></div>
              <div className="feature-item-small-text">
                <h4>Video Hub</h4>
                <p>Upload and organize high-definition lessons seamlessly.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)'}}><FiClipboard /></div>
              <div className="feature-item-small-text">
                <h4>Exam Generation</h4>
                <p>Build and deploy custom examinations to evaluate student knowledge.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#F472B6', background: 'rgba(244, 114, 182, 0.1)'}}><FiUsers /></div>
              <div className="feature-item-small-text">
                <h4>Student Management</h4>
                <p>Manage enrolled students and track their success with deep analytics.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#34D399', background: 'rgba(52, 211, 153, 0.1)'}}><FiMessageSquare /></div>
              <div className="feature-item-small-text">
                <h4>Announcements</h4>
                <p>Send direct notifications and important updates to your entire community.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default InstructorRegister;
