import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiTerminal, FiLayout, FiVideo, FiClipboard, FiUsers, FiMessageSquare } from "react-icons/fi";
import { FaCubes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { checkUserAuthStatus } from "../../redux/slices/authSlice";
import { loginAPI } from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import "./Auth.css";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginInstructor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);

  React.useEffect(() => {
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
          dispatch(checkUserAuthStatus());
          navigate("/instructor-courses");
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
      <div className="auth-bg-glow glow-1" style={{ background: "radial-gradient(circle, rgba(138, 43, 226, 0.15) 0%, transparent 70%)" }}></div>
      <div className="auth-bg-glow glow-2"></div>

      <motion.div 
        className="auth-container"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ borderColor: "rgba(138, 43, 226, 0.2)" }}
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
              <FiTerminal className="text-purple-400 text-xl" />
            </motion.div>
            <motion.h1 variants={itemVariants}>Instructor Portal</motion.h1>
            <motion.p variants={itemVariants}>Secure access for platform educators and mentors</motion.p>
          </div>

          {mutation.isError && (
            <AlertMessage
              type="error"
              message={mutation.error.response?.data?.message || "Login Failed"}
            />
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-2">
            <motion.div className="input-group" variants={itemVariants}>
              <div className={`input-wrapper ${formik.touched.email && formik.errors.email ? 'border-red-500/50' : ''}`}>
                <FiMail className="input-icon" />
                <input
                  type="email"
                  {...formik.getFieldProps("email")}
                  placeholder="Admin/Instructor Email"
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
              {mutation.isPending ? "Logging in..." : "Access Dashboard"}
            </motion.button>
          </form>

          <motion.div className="alt-action" variants={itemVariants}>
            Not an instructor? 
            <Link to="/InstructorRegister" className="alt-link" style={{ color: "#A855F7" }}>Apply for Access</Link>
          </motion.div>
        </div>

        <div className="auth-info-side">
          <h3 className="info-title">Instructor Benefits</h3>
          <div className="feature-list">
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#A855F7', background: 'rgba(168, 85, 247, 0.1)'}}><FiLayout /></div>
              <div className="feature-item-small-text">
                <h4>Course Builder</h4>
                <p>Create detailed courses with structured, easy-to-follow lessons.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#3B82F6', background: 'rgba(59, 130, 246, 0.1)'}}><FiVideo /></div>
              <div className="feature-item-small-text">
                <h4>Lecture Management</h4>
                <p>Upload and organize high-quality video lessons easily.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#06B6D4', background: 'rgba(6, 182, 212, 0.1)'}}><FiClipboard /></div>
              <div className="feature-item-small-text">
                <h4>Quiz Builder</h4>
                <p>Build and create custom quizzes to assess student knowledge.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#F472B6', background: 'rgba(244, 114, 182, 0.1)'}}><FiUsers /></div>
              <div className="feature-item-small-text">
                <h4>Student Management</h4>
                <p>Manage enrolled students and track their performance effectively.</p>
              </div>
            </motion.div>
            <motion.div className="feature-item-small" variants={itemVariants}>
              <div className="feature-item-small-icon" style={{color: '#34D399', background: 'rgba(52, 211, 153, 0.1)'}}><FiMessageSquare /></div>
              <div className="feature-item-small-text">
                <h4>Announcements</h4>
                <p>Send updates and notifications to your student community.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginInstructor;
