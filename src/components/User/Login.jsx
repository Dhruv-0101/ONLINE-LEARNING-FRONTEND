import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import {
  checkUserAuthStatusAPI,
  loginAPI,
} from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import { useDispatch } from "react-redux";
import { FiMail, FiLock } from "react-icons/fi";
import { checkUserAuthStatus } from "../../redux/slices/authSlice";

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const data = await checkUserAuthStatusAPI();
        if (data.isAuthenticated) {
          navigate(-1);
        }
      } catch (error) {
        console.error("Failed to check authentication status", error);
      }
    };

    checkAuthStatus();
  }, [navigate]);

  //---mutation
  const mutation = useMutation({
    mutationFn: loginAPI,
    onError: (error) => {
      setLoginError(error.response?.data?.message || "Login failed");
    },
    onSuccess: (data) => {
      // Handle login success
      if (data) {
        // Check user role
        if (data.role === "instructor") {
          setLoginError("This page is not for instructors.");
        } else {
          navigate("/student-dashboard");
          dispatch(checkUserAuthStatus());
        }
      }
    },
  });

  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      mutation.mutateAsync(values);
      formik.resetForm();
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="max-w-sm w-full bg-white rounded-xl shadow-md p-8">
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">
            Sign In
          </h1>

          {loginError && <AlertMessage type="error" message={loginError} />}

          {/* {mutation.isSuccess && !loginError && (
            <AlertMessage
              type="success"
              message="Login success you will be redirected soon..."
            />
          )} */}

          <Link
            to="/register"
            className="text-sm text-indigo-600 hover:text-indigo-700 transition duration-200 block text-center mb-6"
          >
            New here? <span className="font-medium">Create an account</span>
          </Link>

          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <FiMail className="text-gray-500" />
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className="w-full bg-transparent focus:ring-0 placeholder-gray-400 ml-2"
              placeholder="Email address"
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.email}
            </div>
          )}

          <div className="flex items-center bg-gray-100 rounded-full px-3 py-2">
            <FiLock className="text-gray-500" />
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className="w-full bg-transparent focus:ring-0 placeholder-gray-400 ml-2"
              placeholder="Password"
            />
          </div>
          {formik.touched.password && formik.errors.password && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.password}
            </div>
          )}

          <button
            className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 font-medium rounded-full text-sm px-5 py-2.5 text-center"
            type="submit"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
