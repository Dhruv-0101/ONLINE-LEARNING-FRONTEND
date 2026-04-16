import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { 
  FiLayers, FiUsers, FiUser, FiActivity, FiSettings, 
  FiPlusCircle, FiList, FiEdit, FiTrash2, FiAward, 
  FiRadio, FiChevronLeft, FiTag, FiBook
} from "react-icons/fi";
import {
  deleteCourseAPI,
  getSingleCourseAPI,
} from "../../../reactQuery/courses/coursesAPI";
import { createCourseNotificationAPI } from "../../../reactQuery/user/usersAPI";
import AlertMessage from "../../Alert/AlertMessage";
import { motion, AnimatePresence } from "framer-motion";

const AdminCourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const {
    data: courseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
  });

  // Notification form state
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  const createNotificationMutation = useMutation({
    mutationFn: createCourseNotificationAPI,
  });

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    await createNotificationMutation.mutateAsync({
      courseId,
      message,
    });
    setMessage("");
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(168,85,247,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-20">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-10 group"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Courses
           </button>
           
           <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>
              
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest">
                       Course Details
                    </span>
                    <span className="text-gray-600 text-[10px] font-mono tracking-tighter">ID: {courseId}</span>
                 </div>
                 <h1 className="text-5xl font-black tracking-tighter mb-6 leading-tight max-w-3xl">{courseData?.title}</h1>
                 <p className="text-lg text-gray-500 leading-relaxed italic max-w-2xl">{courseData?.description}</p>
              </div>
           </motion.div>
        </header>

        {/* COURSE OVERVIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-20">
           {/* Instructor Slot */}
           <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 flex items-center gap-8 group">
              <div className="w-20 h-20 rounded-[2rem] bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shadow-inner group-hover:scale-110 transition-transform duration-500">
                 <FiUser size={36} />
              </div>
              <div>
                 <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-1">Instructor</p>
                 <h3 className="text-2xl font-black text-white tracking-tighter">{courseData?.user?.username}</h3>
                 <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:gap-4 transition-all cursor-pointer">
                    View Profile <FiActivity />
                 </div>
              </div>
           </motion.div>

           {/* Metrics Slot */}
           <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="p-10 rounded-[3rem] bg-white/[0.03] border border-white/5 grid grid-cols-3 gap-4">
              <div className="text-center p-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 mx-auto mb-3">
                    <FiUsers size={20} />
                 </div>
                 <p className="text-xl font-black text-white">{courseData?.students?.length}</p>
                 <p className="text-[8px] text-gray-600 uppercase font-black tracking-tighter">Students</p>
              </div>
              <div className="text-center p-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-green-500 mx-auto mb-3">
                    <FiLayers size={20} />
                 </div>
                 <p className="text-xl font-black text-white">{courseData?.sections?.length}</p>
                 <p className="text-[8px] text-gray-600 uppercase font-black tracking-tighter">Lessons</p>
              </div>
              <div className="text-center p-4">
                 <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-purple-500 mx-auto mb-3">
                    <FiTag size={20} />
                 </div>
                 <p className="text-xl font-black text-white uppercase">{courseData?.difficulty}</p>
                 <p className="text-[8px] text-gray-600 uppercase font-black tracking-tighter">Difficulty</p>
              </div>
           </motion.div>
        </div>

        {/* INSTRUCTOR CONTROLS */}
        <div className="space-y-8 mb-20">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 flex items-center gap-6">
              <FiSettings /> Course Management
              <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
           </h3>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <Link to={`/students-position/${courseId}`} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-yellow-500/30 hover:bg-yellow-500/5 transition-all group flex flex-col items-center gap-4 text-center">
                 <FiAward size={28} className="text-yellow-500 group-hover:scale-125 transition-transform" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-yellow-500">Student Rankings</span>
              </Link>
              <Link to={`/instructor-add-course-sections/${courseId}`} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all group flex flex-col items-center gap-4 text-center">
                 <FiPlusCircle size={28} className="text-purple-500 group-hover:scale-125 transition-transform" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-purple-500">Add Lesson</span>
              </Link>
              <Link to={`/instructor-update-course/${courseId}`} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group flex flex-col items-center gap-4 text-center">
                 <FiEdit size={28} className="text-blue-500 group-hover:scale-125 transition-transform" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-blue-500">Edit Course</span>
              </Link>
              <Link to={`/instructor-course-sections/${courseId}`} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-green-500/30 hover:bg-green-500/5 transition-all group flex flex-col items-center gap-4 text-center">
                 <FiList size={28} className="text-green-500 group-hover:scale-125 transition-transform" />
                 <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-green-500">Lesson Manager</span>
              </Link>
              <button onClick={() => setShowForm(!showForm)} className={`p-8 rounded-[2.5rem] border transition-all group flex flex-col items-center gap-4 text-center ${showForm ? 'bg-orange-500/20 border-orange-500/50' : 'bg-white/[0.03] border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5'}`}>
                 <FiRadio size={28} className={`text-orange-500 transition-transform ${showForm ? 'scale-125' : 'group-hover:scale-125'}`} />
                 <span className={`text-[9px] font-black uppercase tracking-widest ${showForm ? 'text-orange-500' : 'text-gray-500 group-hover:text-orange-500'}`}>Send Announcement</span>
              </button>
           </div>
        </div>

        {/* BROADCAST TRANSMISSION FORM */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <form onSubmit={handleAnnouncementSubmit} className="p-12 rounded-[4rem] bg-[#161B28] border border-white/10 shadow-2xl relative">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <FiRadio size={48} />
                 </div>
                 <h4 className="text-2xl font-black tracking-tighter mb-8 flex items-center gap-3">
                    <FiRadio className="text-orange-500 animate-pulse" /> Course Announcement
                 </h4>
                 
                 <div className="space-y-6 mb-10">
                    <div>
                       <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-2 block">Message Content</label>
                       <textarea
                         value={message}
                         onChange={(e) => setMessage(e.target.value)}
                         rows={4}
                         required
                         placeholder="Enter your announcement message for all enrolled students..."
                         className="w-full bg-black/40 border border-white/5 rounded-3xl p-6 text-sm text-gray-300 focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none italic"
                       ></textarea>
                    </div>
                 </div>

                 <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest max-w-sm">
                       This message will be sent to all students enrolled in this course.
                    </p>
                    <button
                      type="submit"
                      disabled={createNotificationMutation.isPending}
                      className="px-12 py-5 rounded-[2rem] bg-orange-600 hover:bg-orange-500 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-4 transition-all shadow-xl disabled:opacity-50"
                    >
                      {createNotificationMutation.isPending ? "Sending..." : <><span>Send Announcement</span> <FiActivity /></>}
                    </button>
                 </div>

                 {createNotificationMutation.isSuccess && (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 p-6 rounded-[2rem] bg-green-500/10 border border-green-500/20 text-center text-[10px] font-black uppercase tracking-widest text-green-500">
                      Announcement sent successfully. Students notified.
                   </motion.div>
                 )}
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PLATFORM STATUS FOOTER */}
        <div className="mt-24 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
           <div className="flex items-center gap-4">
              <FiBook size={24} className="text-blue-500" />
              <p className="text-[10px] uppercase font-black tracking-[0.3em]">Course Content Verified</p>
           </div>
           <p className="text-[8px] font-mono tracking-widest uppercase">Course Metadata Verified</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetails;
