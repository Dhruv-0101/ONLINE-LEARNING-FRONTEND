import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiShield, FiSearch, FiVideo, FiClipboard, FiTrendingUp, FiEdit3 } from "react-icons/fi";
import { FaCubes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { checkUserAuthStatus } from "../../redux/slices/authSlice";
import {
  checkUserAuthStatusAPI,
  loginAPI,
} from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import "./Auth.css";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (userProfile?.role === "student") navigate("/student-dashboard");
      else if (userProfile?.role === "instructor") navigate("/instructor-courses");
    }
  }, [isAuthenticated, userProfile, navigate]);

  const mutation = useMutation({ mutationFn: loginAPI });

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      mutation.mutateAsync(values).then((data) => {
        if (data) {
          navigate("/student-dashboard");
          dispatch(checkUserAuthStatus());
        }
      });
    },
  });

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
      <div className="auth-bg-glow glow-1"></div>
      <div className="auth-bg-glow glow-2"></div>

      <motion.div 
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
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
            <motion.h1 variants={itemVariants}>Welcome Back</motion.h1>
            {/* <motion.p variants={itemVariants}>Initialize session to access Skill Buddy ecosystem</motion.p> */}
          </div>

          {mutation.isError && (
            <AlertMessage
              type="error"
              message={mutation.error.response?.data?.message || "Login Error"}
            />
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-2">
            <motion.div className="input-group" variants={itemVariants}>
              <div className={`input-wrapper ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : ''}`}>
                <FiMail className="input-icon" />
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Enter Email"
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
                  placeholder="Enter Password"
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
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending ? "Validating..." : "Continue"}
            </motion.button>

            <motion.div variants={itemVariants} className="relative py-4">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#12141f] px-2 text-gray-500">Secondary Methods</span></div>
            </motion.div>

            <motion.button
              variants={itemVariants}
              className="passkey-btn"
              type="button"
              onClick={() => navigate("/login-with-passkey")}
            >
              <FiShield /> Two-Step Authentication
            </motion.button>
          </form>

          <motion.div className="alt-action" variants={itemVariants}>
            New user? 
            <Link to="/register" className="alt-link">Sign Up</Link>
          </motion.div>
        </div>

        <div className="auth-info-side">
          <h3 className="info-title">Student Benefits</h3>
          <div className="feature-list">
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon"><FiSearch /></div>
              <div className="feature-item-small-text">
                <h4>Browse & Enroll</h4>
                <p>Explore a wide variety of courses and easily join any learning path.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)'}}><FiVideo /></div>
              <div className="feature-item-small-text">
                <h4>Immersive Content</h4>
                <p>Access high-quality video lessons and join our global study community.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)'}}><FiClipboard /></div>
              <div className="feature-item-small-text">
                <h4>Skill Evaluation</h4>
                <p>Test your knowledge through interactive exams built by instructors.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#34D399', background: 'rgba(52, 211, 153, 0.1)'}}><FiTrendingUp /></div>
              <div className="feature-item-small-text">
                <h4>Real-time Tracking</h4>
                <p>Track your learning progress and view your performance metrics.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#F472B6', background: 'rgba(244, 114, 182, 0.1)'}}><FiEdit3 /></div>
              <div className="feature-item-small-text">
                <h4>Dynamic Notes</h4>
                <p>Take important notes with timestamps directly while watching lessons.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
