import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { 
  FiRefreshCw, FiEdit, FiHardDrive, FiChevronLeft, 
  FiSettings, FiActivity, FiLayers, FiTerminal 
} from "react-icons/fi";
import {
  getSingleSectionAPI,
  updateSectionAPI,
} from "../../../reactQuery/courseSections/courseSectionsAPI";
import AlertMessage from "../../Alert/AlertMessage";
import { motion, AnimatePresence } from "framer-motion";

// Validation schema using Yup
const validationSchema = Yup.object({
  sectionName: Yup.string().required("Section name is required"),
});

const UpdateCourseSection = () => {
  const navigate = useNavigate();
  const { sectionId } = useParams();

  const { data: sectionDetails, isLoading: isNavigating } = useQuery({
    queryKey: ["course-section", sectionId],
    queryFn: () => getSingleSectionAPI(sectionId),
  });

  const mutation = useMutation({ mutationFn: updateSectionAPI });

  const formik = useFormik({
    initialValues: {
      sectionName: sectionDetails?.sectionName || "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const data = {
        sectionId,
        sectionName: values.sectionName,
      };
      mutation.mutateAsync(data).then(() => {
        // We'll navigate back to the previous screen
        navigate(-1);
      });
    },
  });

  if (isNavigating) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12 text-center md:text-left">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-10 group"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
           </button>
           
           <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 shadow-[0_0_30px_#4f46e5] flex items-center justify-center shrink-0">
                 <FiRefreshCw size={32} className="animate-spin-slow" />
              </div>
              <div>
                 <h1 className="text-4xl font-black tracking-tighter">Edit Section Name</h1>
                 <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black flex items-center justify-center md:justify-start gap-3">
                    <FiSettings className="text-indigo-500" /> Update Section Details
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
            {mutation.isPending && <AlertMessage type="loading" message="Updating Section..." />}
            {mutation.isError && <AlertMessage type="error" message={mutation?.error?.response?.data?.message} />}
            {mutation.isSuccess && <AlertMessage type="success" message="Section Updated Successfully." />}
          </AnimatePresence>

          <form onSubmit={formik.handleSubmit} className="space-y-10 mt-4">
            {/* Section Name Input */}
            <div className="group">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4 block flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                 <FiHardDrive /> Current Section Name
              </label>
              <input
                className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 text-gray-200 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-2xl font-black tracking-tighter"
                type="text"
                placeholder="Enter new section name..."
                {...formik.getFieldProps("sectionName")}
              />
              {formik.touched.sectionName && formik.errors.sectionName && (
                <p className="text-red-500 text-[10px] uppercase font-black tracking-widest mt-4 animate-pulse">{formik.errors.sectionName}</p>
              )}
            </div>

            {/* Strategic Info Slot */}
            <div className="p-8 rounded-[2rem] bg-[#161B28] border border-white/5 flex items-center gap-6 opacity-60">
               <FiLayers className="text-indigo-500" size={24} />
               <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500 leading-relaxed">
                  Updating the section name will be visible to all students enrolled in this course.
               </p>
            </div>

            {/* Submit Action */}
            <div className="pt-8 flex flex-col items-center">
               <button
                 className="group w-full max-w-sm py-6 rounded-[2.5rem] bg-indigo-600 hover:bg-white hover:text-black text-white text-sm font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
                 type="submit"
                 disabled={mutation.isPending}
               >
                 {mutation.isPending ? "Saving Changes..." : <><span>Save Changes</span> <FiActivity /></>}
               </button>
               <p className="mt-8 text-[8px] text-center text-gray-700 uppercase tracking-widest font-bold font-mono">
                  Platform Secure | Status: Online
               </p>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Decorative HUD Elements */}
      <div className="fixed bottom-12 left-12 opacity-5 pointer-events-none">
         <div className="flex flex-col gap-2">
            <FiTerminal size={24} />
            <div className="h-24 w-px bg-white"></div>
         </div>
      </div>
    </div>
  );
};

export default UpdateCourseSection;
