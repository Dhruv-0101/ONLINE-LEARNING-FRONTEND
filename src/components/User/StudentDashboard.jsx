import { useQuery } from "@tanstack/react-query";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBookOpen, FiActivity, FiCheckCircle, FiClock, FiSearch, FiArrowRight, FiHexagon } from "react-icons/fi";
import { getPrivateUserProfileAPI } from "../../reactQuery/user/usersAPI";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";

function Dashboard() {
  const navigate = useNavigate();
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["student-profile"],
    queryFn: getPrivateUserProfileAPI,
  });

  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);
  const courses = profileData?.coursesProgress || [];
  const hasCourses = courses.length > 0;
  
  // Use profileData username or fallback to Redux userProfile username
  const studentName = profileData?.user?.username || userProfile?.username;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-12 px-6 lg:px-12 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <header className="mb-12">
          <motion.div variants={itemVariants} className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-400">
              <FiActivity size={20} />
            </div>
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-blue-400">Learning Dashboard</span>
          </motion.div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div variants={itemVariants}>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                Hello, <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent capitalize">{studentName || 'Learner'}</span>
              </h1>
              <p className="text-gray-400 max-w-xl">
                Track your active courses, lessons, and learning progress. 
                Manage your journey through the Skill Buddy platform.
              </p>
            </motion.div>

            {hasCourses && (
              <motion.div variants={itemVariants}>
                <Link 
                  to="/courses" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all active:scale-95"
                >
                  <FiSearch /> Explore More Courses
                </Link>
              </motion.div>
            )}
          </div>
        </header>

        {/* Dashboard Grid */}
        <AnimatePresence mode="wait">
          {!hasCourses ? (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center py-24 px-6 bg-white/[0.02] border border-white/5 rounded-[2.5rem] backdrop-blur-3xl text-center"
            >
              <div className="relative mb-8">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-[-20px] border-2 border-dashed border-blue-500/20 rounded-full"
                />
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full flex items-center justify-center border border-white/10 shadow-2xl">
                  <FiHexagon className="text-5xl text-blue-400" />
                </div>
              </div>
              
              <h2 className="text-3xl font-bold mb-4 tracking-tight">No Active Courses Found</h2>
              <p className="text-gray-400 max-w-md mb-10 text-lg leading-relaxed">
                You haven't enrolled in any courses yet. Start your journey by exploring our available courses and lessons.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/courses"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 transition-all flex items-center gap-2"
                >
                  Find Your First Course <FiArrowRight />
                </Link>
              </div>

              {/* Student stats elements */}
              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-40">
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Status</p>
                  <p className="text-sm font-mono text-blue-400">Active</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Completed</p>
                  <p className="text-sm font-mono text-blue-400">{profileData?.totalCompleted || 0}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Points</p>
                  <p className="text-sm font-mono text-blue-400">{profileData?.totalPoints || 0}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Rank</p>
                  <p className="text-sm font-mono text-blue-400">Member</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={containerVariants}
            >
              {courses.map((course) => (
                <CourseCard key={course.courseId} course={course} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function CourseCard({ course }) {
  const navigate = useNavigate();
  const percentage = course.totalSections > 0 ? (course.completed / course.totalSections) * 100 : 0;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -8 }}
      onClick={() => navigate(`/courses/${course.courseId}`)}
      className="group bg-white/[0.03] border border-white/10 rounded-[2rem] p-8 cursor-pointer hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-300 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20 group-hover:scale-110 transition-transform">
          <FiBookOpen size={24} />
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-gray-500 font-black mb-1">Progress</p>
          <p className="text-xl font-mono text-blue-400">{Math.round(percentage)}%</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
        {course.courseTitle}
      </h2>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] uppercase tracking-widest text-gray-500 font-bold">
            <span>Lessons Completed</span>
            <span>{course.completed}/{course.totalSections}</span>
          </div>
          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
            />
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 uppercase tracking-tighter">
          <div className="flex items-center gap-2">
            <FiCheckCircle className="text-green-500" />
            <span className="text-xs text-gray-400 font-medium">Completed: {course.completed}</span>
          </div>
          <div className="flex items-center gap-2">
            <FiClock className="text-blue-400" />
            <span className="text-xs text-gray-400 font-medium">Ongoing: {course.ongoing}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default Dashboard;
