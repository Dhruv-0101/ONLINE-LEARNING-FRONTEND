import { useQuery } from "@tanstack/react-query";
import React from "react";
import { 
  FiPlus, FiUsers, FiLayers, FiActivity, FiEdit, 
  FiEye, FiTrash2, FiClock, FiSettings, FiGrid,
  FiBookOpen, FiTerminal
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { getAllCoursesAPI } from "../../../reactQuery/courses/coursesAPI";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const AdminCourses = () => {
  const { userProfile } = useSelector((state) => state.auth);
  const userCourses = userProfile?.coursesCreated || [];

  // Calculate global instructor stats
  const totalStudents = userCourses.reduce((acc, c) => acc + (c.students?.length || 0), 0);
  const totalSections = userCourses.reduce((acc, c) => acc + (c.sections?.length || 0), 0);

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(168,85,247,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* DASHBOARD HEADER */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
           <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                 <FiSettings /> Instructor Dashboard
              </div>
              <h1 className="text-5xl font-black tracking-tighter mb-4">My Courses</h1>
              <p className="text-sm text-gray-500 uppercase tracking-[0.4em] font-black flex items-center justify-center md:justify-start gap-3">
                 <FiGrid className="text-purple-500" /> Instructor Status: Active
              </p>
           </div>
           
           <div className="flex flex-wrap justify-center gap-4">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl min-w-[160px] text-center">
                 <div className="text-3xl font-black text-purple-500 mb-1">{userCourses.length}</div>
                 <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-none">Courses</p>
              </div>
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl min-w-[160px] text-center">
                 <div className="text-3xl font-black text-white mb-1">{totalStudents}</div>
                 <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest leading-none">Students</p>
              </div>
              <Link 
                to="/instructor-add-course" 
                className="group p-8 rounded-[2.5rem] bg-purple-600 hover:bg-purple-500 text-white min-w-[160px] flex flex-col items-center justify-center gap-2 transition-all shadow-[0_20px_60px_rgba(147,51,234,0.3)] hover:-translate-y-2"
              >
                 <FiPlus size={28} className="group-hover:rotate-90 transition-transform duration-500" />
                 <span className="text-[10px] font-black uppercase tracking-widest">New Course</span>
              </Link>
           </div>
        </header>

        {/* COURSES GRID / EMPTY STATE */}
        {userCourses.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative py-32 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-[4rem] backdrop-blur-3xl overflow-hidden group"
          >
             {/* Animated Background Element */}
             <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-[3s]"></div>
             
             <div className="relative z-10">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-600/20 to-blue-500/20 rounded-[2.5rem] flex items-center justify-center border border-white/10 mx-auto mb-10 shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                   <FiBookOpen size={40} className="text-purple-400" />
                </div>
                
                <h2 className="text-3xl font-black tracking-tighter mb-4">No Courses Found</h2>
                <p className="text-gray-500 max-w-sm mx-auto mb-12 text-sm leading-relaxed">
                   Your curriculum is currently empty. Start your instructor journey by creating your first high-impact course.
                </p>

                <Link 
                  to="/instructor-add-course" 
                  className="inline-flex items-center gap-4 px-10 py-5 bg-purple-600 hover:bg-purple-500 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(147,51,234,0.3)] hover:-translate-y-2 active:scale-95"
                >
                   <FiPlus size={20} /> Create Your First Course
                </Link>

                <div className="mt-20 flex gap-8 items-center justify-center opacity-30">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping"></div>
                      <span className="text-[8px] font-black uppercase tracking-widest">Active System</span>
                   </div>
                   <div className="w-12 h-px bg-white/10"></div>
                   <span className="text-[8px] font-black uppercase tracking-widest text-gray-400">Ready for Launch</span>
                </div>
             </div>

             {/* HUD Decorative Corners */}
             <div className="absolute top-8 left-8 w-8 h-8 border-t-2 border-l-2 border-white/5 rounded-tl-2xl"></div>
             <div className="absolute bottom-8 right-8 w-8 h-8 border-b-2 border-r-2 border-white/5 rounded-br-2xl"></div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userCourses.map((course, idx) => (
              <motion.div 
                key={course._id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative"
              >
                 <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                 
                 <div className="relative p-8 rounded-[3rem] bg-[#161B28] border border-white/5 hover:border-purple-500/30 transition-all duration-500 h-full flex flex-col shadow-2xl overflow-hidden">
                    {/* Top Stats HUD */}
                    <div className="flex items-center justify-between mb-8">
                       <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                            course.difficulty === 'advanced' ? 'bg-red-500/10 border-red-500/20 text-red-500' : 
                            course.difficulty === 'intermediate' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' : 
                            'bg-green-500/10 border-green-500/20 text-green-500'
                          }`}>
                            {course.difficulty}
                          </span>
                       </div>
                       <div className="flex items-center gap-1.5 text-gray-600">
                          <FiClock size={12} />
                          <span className="text-[9px] font-mono tracking-tighter">{new Date(course.createdAt).toLocaleDateString()}</span>
                       </div>
                    </div>

                    <div className="flex-1 mb-10">
                       <h3 className="text-2xl font-black tracking-tighter mb-4 text-white group-hover:text-purple-400 transition-colors leading-tight">{course.title}</h3>
                       <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">{course.description}</p>
                    </div>

                    {/* Metrics Footer */}
                    <div className="grid grid-cols-2 gap-4 mb-10 border-y border-white/5 py-6">
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-500">
                             <FiUsers size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] text-white font-black leading-none">{course?.students?.length}</p>
                             <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Students</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-purple-500/5 border border-purple-500/10 flex items-center justify-center text-purple-500">
                             <FiLayers size={16} />
                          </div>
                          <div>
                             <p className="text-[10px] text-white font-black leading-none">{course?.sections?.length}</p>
                             <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest">Lessons</p>
                          </div>
                       </div>
                    </div>

                    {/* ACTIONS BAR */}
                    <div className="flex items-center gap-3">
                       <Link 
                         to={`/instructor-courses/${course._id}`} 
                         className="flex-1 py-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-400 hover:text-white hover:bg-white/10 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                       >
                          <FiEye className="text-blue-500" /> View Details
                       </Link>
                       <Link 
                         to={`/instructor-update-course/${course._id}`} 
                         className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-purple-400 hover:border-purple-500/50 transition-all"
                       >
                          <FiEdit size={16} />
                       </Link>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* System Monitoring Footer */}
        <div className="mt-24 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 transition-all">
           <div className="flex items-center gap-4">
              <FiActivity size={24} className="text-purple-500" />
              <p className="text-[10px] uppercase font-black tracking-[0.3em]">Instructor Dashboard: Active</p>
           </div>
           <p className="text-[8px] font-mono tracking-widest uppercase">Security: Verified</p>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;
