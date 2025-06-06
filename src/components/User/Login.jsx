import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { AiOutlineEye, AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
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
  const mutation = useMutation({ mutationFn: loginAPI });
  // Formik setup for form handling
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      mutation.mutateAsync(values).then((data) => {
        //redirect if user is authenticated
        if (data) {
          navigate("/student-dashboard");
          //dispatch login action
          dispatch(checkUserAuthStatus());
        }
      });
      //reset form
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

          {mutation.isError && (
            <AlertMessage
              type="error"
              message={mutation.error.response?.data?.message}
            />
          )}

          {mutation.isSuccess && (
            <AlertMessage
              type="success"
              message="Login success you will be redirected soon..."
            />
          )}

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
          {/* New two-step authentication button */}
          <button
            className="h-14 inline-flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-blue-500 w-full text-white font-bold font-heading shadow hover:bg-blue-600 focus:ring focus:ring-blue-200 transition duration-200"
            type="button"
            onClick={() => navigate("/login-with-passkey")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={21}
              height={21}
              viewBox="0 0 21 21"
              fill="none"
            >
              <path
                d="M10.5 1.5C5.80558 1.5 2 5.30558 2 10C2 14.6944 5.80558 18.5 10.5 18.5C15.1944 18.5 19 14.6944 19 10C19 5.30558 15.1944 1.5 10.5 1.5ZM11.35 15.15L10.5 16L9.65 15.15L6.35 11.85L7.2 11L10.5 14.3L13.8 11L14.65 11.85L11.35 15.15ZM10.5 9.3C9.67157 9.3 9 8.62843 9 7.8C9 6.97157 9.67157 6.3 10.5 6.3C11.3284 6.3 12 6.97157 12 7.8C12 8.62843 11.3284 9.3 10.5 9.3Z"
                fill="white"
              />
            </svg>
            Login With Two-step Authentication
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
