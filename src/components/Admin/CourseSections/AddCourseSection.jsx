import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { addCourseSectionAPI } from "../../../reactQuery/courseSections/courseSectionsAPI";
import AlertMessage from "../../Alert/AlertMessage";
import { useState } from "react";
import { 
  FiPlusCircle, FiVideo, FiFilePlus, FiLayers, 
  FiChevronLeft, FiActivity, FiXCircle, FiHardDrive,
  FiUploadCloud, FiTerminal
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const AddCourseSections = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: addCourseSectionAPI,
  });

  const formik = useFormik({
    initialValues: {
      sectionName: "",
      videos: [
        {
          title: "",
          file: null,
        },
      ],
    },
    validationSchema: Yup.object({
      sectionName: Yup.string().required("Section name is required"),
      videos: Yup.array()
        .of(
          Yup.object().shape({
            title: Yup.string().required("Video title is required"),
            file: Yup.mixed()
              .required("Video file is required")
              .test(
                "fileType",
                "Unsupported file format. Please upload a valid video file.",
                (value) => {
                  if (!value) return false;
                  const supportedFormats = [
                    "video/mp4",
                    "video/mov",
                    "video/avi",
                    "video/mkv",
                  ];
                  return supportedFormats.includes(value.type);
                }
              )
              .test(
                "fileSize",
                "File too large. Maximum size is 500MB.",
                (value) => {
                  if (!value) return false;
                  const maxSize = 500 * 1024 * 1024; // 500MB
                  return value.size <= maxSize;
                }
              ),
          })
        )
        .min(1, "At least one video is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("sectionName", values.sectionName);

      values.videos.forEach((video, index) => {
        if (video.file) {
          formData.append("videos", video.file);
          formData.append(`titles[${index}]`, video.title);
        }
      });

      try {
        await mutation.mutateAsync({ courseId, formData });
        resetForm();
        setIsSubmitting(false);
        navigate(`/instructor-courses/${courseId}`);
      } catch (error) {
        console.error("Error adding section:", error);
        setIsSubmitting(false);
      }
    },
  });

  const handleAddVideoField = () => {
    formik.setFieldValue("videos", [
      ...formik.values.videos,
      { title: "", file: null },
    ]);
  };

  const handleRemoveVideoField = (index) => {
    const videos = [...formik.values.videos];
    videos.splice(index, 1);
    formik.setFieldValue("videos", videos);
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-10 group"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Course
           </button>
           
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 shadow-[0_0_30px_#4f46e5] flex items-center justify-center shrink-0">
                 <FiLayers size={32} />
              </div>
              <div>
                 <h1 className="text-4xl font-black tracking-tighter text-white">Add New Section</h1>
                 <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black flex items-center gap-3">
                    <FiTerminal className="text-indigo-500" /> Course Content & Lessons
                 </p>
              </div>
           </div>
        </header>

        <form onSubmit={formik.handleSubmit} encType="multipart/form-data" className="space-y-10">
          <AnimatePresence>
            {(isSubmitting || mutation.isPending) && (
              <AlertMessage type="loading" message="Uploading Lessons..." />
            )}
            {mutation.isError && !isSubmitting && (
              <AlertMessage type="error" message={mutation.error.response?.data?.message || "Upload Failed."} />
            )}
          </AnimatePresence>

          {/* Section Designation Card */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-2xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
             
             <div className="relative z-10">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-4 block flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                   <FiHardDrive /> Section Name
                </label>
                <input
                  type="text"
                  placeholder="Enter section name (e.g., Introduction to Development)"
                  {...formik.getFieldProps("sectionName")}
                  className={`w-full bg-black/40 border ${formik.touched.sectionName && formik.errors.sectionName ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-6 text-gray-200 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-xl font-black tracking-tighter`}
                />
                {formik.touched.sectionName && formik.errors.sectionName && (
                  <p className="text-red-500 text-[10px] uppercase font-black tracking-widest mt-4 animate-pulse">{formik.errors.sectionName}</p>
                )}
             </div>
          </motion.div>

          {/* Video Capsules Container */}
          <div className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 flex items-center gap-6 mb-8">
                <FiVideo /> Content Capsules
                <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
             </h3>

             {formik.values.videos.map((video, index) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={index}
                  className="p-8 rounded-[2.5rem] bg-[#161B28] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 relative group"
                >
                   <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 font-mono text-xs">
                            {index + 1}
                         </div>
                         <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Lesson {index + 1}</h4>
                      </div>
                      {formik.values.videos.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveVideoField(index)}
                          className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <FiXCircle size={18} />
                        </button>
                      )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Video Title */}
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3 block">Video Title</label>
                         <input
                           type="text"
                           placeholder="Enter video title..."
                           value={video.title}
                           onChange={(e) => formik.setFieldValue(`videos[${index}].title`, e.target.value)}
                           className={`w-full bg-black/40 border ${formik.touched.videos?.[index]?.title && formik.errors.videos?.[index]?.title ? 'border-red-500/50' : 'border-white/5'} rounded-2xl p-4 text-sm text-gray-300 outline-none focus:border-indigo-500/50 transition-all`}
                         />
                      </div>

                      {/* Video File Upload */}
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3 block">Video File (.mp4, .mov, .avi)</label>
                         <div className="relative group/upload">
                            <input
                              type="file"
                              accept="video/*"
                              onChange={(event) => formik.setFieldValue(`videos[${index}].file`, event.currentTarget.files[0])}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className={`w-full p-4 border border-dashed ${video.file ? 'border-indigo-500 bg-indigo-500/5' : 'border-white/10 bg-black/40'} rounded-2xl flex items-center justify-center gap-4 transition-all group-hover/upload:border-indigo-500/50`}>
                               {video.file ? (
                                 <><FiFilePlus className="text-indigo-500" /> <span className="text-[10px] font-black uppercase text-indigo-400 truncate max-w-[200px]">{video.file.name}</span></>
                               ) : (
                                 <><FiUploadCloud size={20} className="text-gray-600" /> <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">Select Video</span></>
                               )}
                            </div>
                         </div>
                      </div>
                   </div>
                </motion.div>
             ))}

             {/* Add Video Button */}
             <button
                type="button"
                onClick={handleAddVideoField}
                className="w-full py-6 rounded-[2rem] border-2 border-dashed border-white/5 hover:border-indigo-500/30 text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] group"
             >
                <FiPlusCircle className="group-hover:rotate-90 transition-transform duration-500" /> Add Another Lesson
             </button>
          </div>

          {/* Submit Action */}
          <div className="pt-10 flex flex-col items-center border-t border-white/5">
             <button
               type="submit"
               disabled={isSubmitting || mutation.isLoading}
               className="group w-full max-w-md py-6 rounded-[2.5rem] bg-indigo-600 hover:bg-white hover:text-black text-white text-sm font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-[0_20px_60px_rgba(79,70,229,0.3)] hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
             >
               {isSubmitting || mutation.isLoading ? (
                 <><span>Uploading Video...</span> <FiActivity className="animate-spin-slow" /></>
               ) : (
                 <><span>Add Section & Lessons</span> <FiPlusCircle /></>
               )}
             </button>
             <p className="mt-6 text-[8px] text-gray-700 font-mono tracking-widest uppercase text-center max-w-sm">
                All lessons are processed and secured automatically.
             </p>
          </div>
        </form>
      </div>

      {/* Decorative Background HUD */}
      <div className="fixed top-32 right-12 opacity-5 pointer-events-none hidden xl:block">
         <div className="flex flex-col items-end gap-2">
            <div className="w-1 h-32 bg-white rounded-full"></div>
            <p className="text-[10px] font-black uppercase tracking-widest [writing-mode:vertical-lr]">SECTOR_ARCHITECT</p>
         </div>
      </div>
    </div>
  );
};

export default AddCourseSections;
