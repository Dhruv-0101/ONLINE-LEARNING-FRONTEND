import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FiUser, FiUnlock, FiArrowLeft, FiShield } from "react-icons/fi";
import { FaCubes } from "react-icons/fa";
import {
  checkUserAuthStatusAPI,
  loginpasskey,
} from "../../reactQuery/user/usersAPI";
import { checkUserAuthStatus } from "../../redux/slices/authSlice";
import AlertMessage from "../Alert/AlertMessage";
import "./Auth.css";

const LoginWithPasskey = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await checkUserAuthStatusAPI();
        if (data.isAuthenticated) {
          navigate("/student-dashboard");
        }
      } catch (error) {
        console.error("Failed to check authentication status", error);
      }
    };
    checkAuthStatus();
  }, [navigate]);

  const loginPasskeyMutation = useMutation({
    mutationKey: ["login-passkey"],
    mutationFn: ({ username }) => loginpasskey(username),
    onSuccess: () => {
      dispatch(checkUserAuthStatus());
      navigate("/student-dashboard");
    },
    onError: (error) => {
      console.error("Login with passkey failed", error);
    },
  });

  const formik = useFormik({
    initialValues: { username: "" },
    validationSchema: Yup.object({
      username: Yup.string().required("Username is required"),
    }),
    onSubmit: async (values) => {
      try {
        await loginPasskeyMutation.mutateAsync({ username: values.username });
      } catch (err) {
        console.log("Error during form submission:", err);
      }
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
        style={{ maxWidth: '500px' }} // Slightly narrower for single field
      >
        <div className="auth-form-side" style={{ width: '100%' }}>
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
            <motion.h1 variants={itemVariants} className="flex items-center gap-3">
              <FiShield className="text-purple-500" /> Two-Step Verification
            </motion.h1>
            <motion.p variants={itemVariants} className="text-gray-400 text-sm mt-2">
              Use your registered passkey to securely access your account.
            </motion.p>
          </div>

          {loginPasskeyMutation.isError && (
            <AlertMessage
              type="error"
              message={loginPasskeyMutation.error?.response?.data?.message || "Verification Failed"}
            />
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-4 mt-8">
            <motion.div className="input-group" variants={itemVariants}>
              <div className={`input-wrapper ${formik.touched.username && formik.errors.username ? 'border-red-500/50' : ''}`}>
                <FiUser className="input-icon" />
                <input
                  type="text"
                  {...formik.getFieldProps("username")}
                  placeholder="Enter Username"
                />
              </div>
              {formik.touched.username && formik.errors.username && (
                <div className="err-msg">{formik.errors.username}</div>
              )}
            </motion.div>

            <motion.button 
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="submit-btn flex items-center justify-center gap-2" 
              type="submit"
              disabled={loginPasskeyMutation.isPending}
            >
              <FiUnlock />
              {loginPasskeyMutation.isPending ? "Verifying..." : "Verify Passkey"}
            </motion.button>
          </form>

          <motion.div className="alt-action mt-6" variants={itemVariants}>
            <Link to="/login" className="alt-link inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
              <FiArrowLeft /> Back to Standard Login
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginWithPasskey;
