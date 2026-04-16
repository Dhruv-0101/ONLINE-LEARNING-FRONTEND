import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { 
  FiPlusCircle, FiFileText, FiTag, FiClock, 
  FiGlobe, FiZap, FiChevronLeft, FiActivity,
  FiLayout, FiCode, FiAward
} from "react-icons/fi";
import { addCourseAPI } from "../../../reactQuery/courses/coursesAPI";
import AlertMessage from "../../Alert/AlertMessage";
import { motion, AnimatePresence } from "framer-motion";

// Validation schema using Yup
const validationSchema = Yup.object({
  title: Yup.string().required("Course title is required"),
  description: Yup.string().required("Course description is required"),
  difficulty: Yup.string().required("Difficulty level must be defined"),
  duration: Yup.number().required("Course duration is required"),
  communityLink: Yup.string().url("Invalid Link").required("Community link is required"),
  price: Yup.number().required("Course price is required"),
});

const AddCourse = () => {
  const navigate = useNavigate();
  const mutation = useMutation({ mutationFn: addCourseAPI });

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      difficulty: "",
      duration: "",
      communityLink: "",
      price: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      mutation.mutateAsync(values).then(() => {
        navigate("/instructor-courses");
      });
    },
  });

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(168,85,247,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-10 group"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
           </button>
           
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-purple-600 shadow-[0_0_30px_#9333ea] flex items-center justify-center shrink-0">
                 <FiPlusCircle size={32} />
              </div>
              <div>
                 <h1 className="text-4xl font-black tracking-tighter">Create New Course</h1>
                 <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black flex items-center gap-3">
                    <FiCode className="text-purple-500" /> Course Development Phase
                 </p>
              </div>
           </div>
        </header>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-3xl overflow-hidden relative"
        >
          {/* Form Alert States */}
          <AnimatePresence>
            {mutation.isPending && <AlertMessage type="loading" message="Creating Course..." />}
            {mutation.isError && <AlertMessage type="error" message={mutation?.error?.response?.data?.message} />}
            {mutation.isSuccess && <AlertMessage type="success" message="Course Created Successfully." />}
          </AnimatePresence>

          <form onSubmit={formik.handleSubmit} className="space-y-8 mt-4">
            {/* Title Section */}
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2 group-focus-within:text-purple-400 transition-colors">
                 <FiFileText /> Course Title
              </label>
              <input
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                type="text"
                placeholder="Enter course title..."
                {...formik.getFieldProps("title")}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-500 text-[10px] uppercase font-black tracking-widest mt-3 animate-pulse">{formik.errors.title}</p>
              )}
            </div>

            {/* Description Section */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2">
                 <FiActivity /> Course Description
              </label>
              <textarea
                className="w-full bg-black/40 border border-white/5 rounded-[2rem] p-5 text-gray-200 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all h-32 italic"
                placeholder="Describe what students will learn in this course..."
                {...formik.getFieldProps("description")}
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-[10px] uppercase font-black tracking-widest mt-3">{formik.errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Difficulty */}
               <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2">
                     <FiTag /> Difficulty Level
                  </label>
                  <select
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all appearance-none cursor-pointer"
                    {...formik.getFieldProps("difficulty")}
                  >
                    <option value="" disabled className="bg-[#0B0F1A]">Select Difficulty</option>
                    <option value="easy" className="bg-[#0B0F1A]">Beginner (Easy)</option>
                    <option value="medium" className="bg-[#0B0F1A]">Intermediate (Medium)</option>
                    <option value="hard" className="bg-[#0B0F1A]">Advanced (Hard)</option>
                  </select>
               </div>

               {/* Duration */}
               <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2">
                     <FiClock /> Course Duration (Hours)
                  </label>
                  <input
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                    type="number"
                    placeholder="2.5"
                    {...formik.getFieldProps("duration")}
                  />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Community */}
               <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2">
                     <FiGlobe /> Community Link
                  </label>
                  <input
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all"
                    type="url"
                    placeholder="https://community-portal.com"
                    {...formik.getFieldProps("communityLink")}
                  />
               </div>

               {/* Price */}
               <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2 text-purple-400">
                     <FiZap /> Course Price ($)
                  </label>
                  <input
                    className="w-full bg-black/40 border border-purple-500/20 rounded-2xl p-5 text-gray-200 outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/5 transition-all font-bold text-xl"
                    type="number"
                    placeholder="49"
                    {...formik.getFieldProps("price")}
                  />
               </div>
            </div>

            {/* Submit Action */}
            <div className="pt-8 flex flex-col items-center">
               <button
                 className="group w-full max-w-sm py-6 rounded-[2.5rem] bg-purple-600 hover:bg-purple-500 text-white text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_rgba(147,51,234,0.3)] hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                 type="submit"
                 disabled={mutation.isPending}
               >
                 {mutation.isPending ? "Creating..." : <><span>Create Course</span> <FiAward /></>}
               </button>
               <p className="mt-6 text-[8px] text-center text-gray-700 uppercase tracking-widest font-bold">
                  By creating this course, you agree to the platform terms and conditions.
               </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Background Decorative Elements */}
      <div className="fixed bottom-12 right-12 opacity-10 flex flex-col gap-4 items-end pointer-events-none">
         <div className="flex items-center gap-2">
            <div className="h-px w-24 bg-white"></div>
            <FiLayout />
         </div>
         <p className="text-[8px] font-mono whitespace-nowrap">PLATFORM INSTRUCTOR TOOLS</p>
         <p className="text-[8px] font-mono">STATUS: READY</p>
      </div>
    </div>
  );
};

export default AddCourse;
