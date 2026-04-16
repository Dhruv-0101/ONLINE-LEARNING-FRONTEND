import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBookOpen, FiUser, FiUsers, FiLayers, FiPlay, FiAward, 
  FiActivity, FiBell, FiCheckCircle, FiInfo, FiMessageCircle,
  FiChevronRight, FiLock, FiStar, FiZap, FiArrowRight, FiEdit3, FiSend, FiX
} from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getSingleCourseAPI,
  checkInrolled,
  getCourseReviewsAPI,
  submitReview
} from "../../reactQuery/courses/coursesAPI";
import {
  getUserNotificationsAPI,
  markNotificationAsReadAPI,
  markAllNotificationsAsReadAPI,
} from "../../reactQuery/user/usersAPI";
import { useSelector } from "react-redux";
import VideoModal from "../../utils/modal/VideoModal";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.auth.userProfile);

  // Core Data
  const { data: courseData, isLoading: courseLoading } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => getCourseReviewsAPI(courseId),
  });

  const { mutate: checkEnrollment, data: enrollmentData } = useMutation({
    mutationFn: checkInrolled,
  });

  const isEnrolled = enrollmentData?.isEnrolled;

  useEffect(() => {
    if (courseId) {
      checkEnrollment({ courseId });
    }
  }, [courseId, checkEnrollment]);

  // Review Submission State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const reviewMutation = useMutation({
    mutationFn: (data) => submitReview(courseId, data),
    onSuccess: () => {
      refetchReviews();
      setReviewText("");
      setReviewRating(5);
      setIsSubmittingReview(false);
    },
    onError: (err) => {
      alert(err?.response?.data?.message || "Review submission failed.");
      setIsSubmittingReview(false);
    }
  });

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    setIsSubmittingReview(true);
    reviewMutation.mutate({ reviewText, rating: reviewRating });
  };

  // Notifications Logic
  const [notifications, setNotifications] = useState([]);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const fetchNotifications = async () => {
    if (!userProfile?._id) return;
    try {
      const data = await getUserNotificationsAPI();
      setNotifications(prev => {
        // Merge strategy: if a notification is marks as read locally, 
        // keep it that way unless the server provides a NEWER state.
        // Actually, just keep the local 'isRead' if it's already true.
        return (data || []).map(newNotif => {
          const localMatch = prev.find(p => p._id === newNotif._id);
          if (localMatch && localMatch.isRead) {
            return { ...newNotif, isRead: true };
          }
          return newNotif;
        });
      });
    } catch (err) {
      console.error("Notification sync failed", err);
    }
  };

  // Poll for notifications every 15 seconds to ensure real-time response
  useEffect(() => {
    if (userProfile) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 15000);
      return () => clearInterval(interval);
    }
  }, [userProfile]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Video/Modal Logic
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleOpenModal = (video) => {
    setSelectedVideo({ title: video.title, url: video.url });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (courseLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-12 px-6 lg:px-12 relative overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div 
        className="max-w-7xl mx-auto relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Navigation */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Link to="/courses" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm transition-colors">
              <FiZap /> Courses
            </Link>
            <FiChevronRight className="text-gray-600" />
            <span className="text-blue-400 font-bold text-sm tracking-widest uppercase">Course Details</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowNotifModal(!showNotifModal)}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <FiBell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-[#0B0F1A]">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifModal && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-4 w-96 bg-[#161B28] border border-white/10 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] p-6 z-50 backdrop-blur-3xl overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <FiBell size={16} />
                         </div>
                         <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-gray-400">Course Notifications</h3>
                      </div>
                      <button onClick={() => setShowNotifModal(false)} className="text-gray-600 hover:text-white transition-colors"><FiX size={14}/></button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                       {notifications.length > 0 ? (
                         notifications.map(n => (
                          <div key={n._id} className="relative group">
                            <div className={`p-4 rounded-2xl border transition-all duration-300 ${n.isRead ? 'bg-transparent border-white/5 opacity-60' : 'bg-blue-600/5 border-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.05)]'}`}>
                               <div className="flex items-start justify-between gap-4">
                                  <div className="flex-1">
                                     <p className={`text-xs leading-relaxed ${n.isRead ? 'text-gray-500' : 'text-gray-200 font-medium'}`}>
                                       {n.message}
                                     </p>
                                     <div className="flex items-center gap-3 mt-3">
                                        <span className="text-[10px] text-gray-600 font-mono tracking-tighter uppercase">{new Date(n.createdAt).toLocaleDateString()}</span>
                                        {!n.isRead && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>}
                                     </div>
                                  </div>
                                  {!n.isRead && (
                                    <button 
                                      onClick={async (e) => {
                                        e.stopPropagation();
                                        
                                        // 1. Optimistic UI Update (Immediate response)
                                        setNotifications(prev => prev.map(item => 
                                          item._id === n._id ? { ...item, isRead: true } : item
                                        ));

                                        const btn = e.currentTarget;
                                        btn.disabled = true;
                                        btn.classList.add('animate-pulse');
                                        try {
                                          await markNotificationAsReadAPI(n._id);
                                          // Note: fetchNotifications is called in the background by polling anyway,
                                          // but we've already updated the state locally.
                                        } catch (err) {
                                          console.error("Failed to mark log as read", err);
                                          fetchNotifications(); // Revert on failure
                                        } finally {
                                          btn.disabled = false;
                                          btn.classList.remove('animate-pulse');
                                        }
                                      }}
                                      className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-lg active:scale-90"
                                      title="Mark as Read"
                                    >
                                      <FiCheckCircle size={14} />
                                    </button>
                                  )}
                               </div>
                            </div>
                          </div>
                         ))
                       ) : (
                         <div className="py-12 text-center opacity-20">
                            <FiActivity size={32} className="mx-auto mb-4" />
                             <p className="text-[10px] uppercase font-black tracking-widest">No notifications found</p>
                         </div>
                       )}
                    </div>

                    {unreadCount > 0 && (
                       <div className="mt-6 pt-4 border-t border-white/5">
                          <button 
                            onClick={async () => {
                               // 1. Optimistic UI Update
                               setNotifications(prev => prev.map(item => ({ ...item, isRead: true })));

                               try {
                                  await markAllNotificationsAsReadAPI();
                               } catch (err) {
                                  console.error("Bulk mark as read failed", err);
                                  fetchNotifications(); // Revert on failure
                               }
                            }}
                            className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-white/10 transition-all"
                          >
                             Mark All as Read
                          </button>
                       </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <section className="relative mb-12 rounded-[2.5rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/[0.03] to-transparent p-8 md:p-12 lg:p-16 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-8">
             <div className="w-24 h-24 bg-blue-500/10 rounded-3xl border border-blue-500/20 flex items-center justify-center text-blue-400 opacity-20 hidden lg:flex">
               <FiActivity size={48} />
             </div>
          </div>

          <div className="max-w-3xl">
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase tracking-[0.3em] font-bold mb-6">
              <FiInfo /> Featured Course
            </motion.div>
            
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-black tracking-tighter mb-8 leading-tight">
              {courseData?.title}
            </motion.h1>

            <motion.p variants={itemVariants} className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10 border-l-2 border-blue-500/30 pl-6 italic">
              {courseData?.description || "A comprehensive course designed to help you master new skills and advance your learning journey."}
            </motion.p>

            {/* Quick Stats Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Instructor</span>
                <span className="text-sm font-bold flex items-center gap-2 mt-1"><FiUser className="text-blue-500"/> {courseData?.user?.username}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Students</span>
                <span className="text-sm font-bold flex items-center gap-2 mt-1"><FiUsers className="text-purple-500"/> {courseData?.students?.length || 0} Enrolled</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Level</span>
                <span className="text-sm font-bold flex items-center gap-2 mt-1 text-cyan-400"><FiLayers /> {courseData?.difficulty}</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Course Controls */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {isEnrolled ? (
            <>
              <Link to={`/start-section/${courseId}`} className="flex items-center justify-between p-6 bg-blue-600 rounded-3xl hover:bg-blue-700 transition-all group overflow-hidden relative">
                <div className="z-10">
                  <span className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1 block">Ongoing Course</span>
                  <span className="text-xl font-bold">Continue Learning</span>
                </div>
                <FiPlay size={28} className="z-10 group-hover:scale-125 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/10 pointer-events-none"></div>
              </Link>

              <Link to={`/progress-update/${courseId}`} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all group">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Metrics</span>
                  <span className="text-xl font-bold">Update Progress</span>
                </div>
                <FiActivity size={28} className="text-blue-400 group-hover:rotate-12 transition-transform" />
              </Link>

              <Link to={`/students-position/${courseId}`} className="flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 rounded-3xl hover:bg-white/[0.08] transition-all group">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 block">Leaderboard</span>
                  <span className="text-xl font-bold">My Rank</span>
                </div>
                <FiAward size={28} className="text-yellow-500 group-hover:scale-110 transition-transform" />
              </Link>

              {courseData?.communityLink && (
                <a href={courseData.communityLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-[#2D1B69]/30 border border-purple-500/20 rounded-3xl hover:bg-[#2D1B69]/50 transition-all group">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-1 block">Network</span>
                    <span className="text-xl font-bold">Join Community</span>
                  </div>
                  <FiUsers size={28} className="text-purple-400" />
                </a>
              )}
            </>
          ) : (
            <button onClick={() => navigate(`/checkout/${courseId}`)} className="col-span-1 md:col-span-2 lg:col-span-2 flex items-center justify-between p-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded-[2.5rem] hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] transition-all group overflow-hidden relative">
              <div className="z-10 text-left">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-white/60 mb-2 block font-mono">ENROLL NOW</span>
                <span className="text-3xl font-black tracking-tight">Join Course & Start Learning</span>
              </div>
              <div className="z-10 w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                <FiZap size={32} className="text-white animate-pulse" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none"></div>
            </button>
          )}
        </motion.div>

        {/* Curriculum / Sections */}
        <section className="mb-20">
          <div className="flex items-center gap-4 mb-10 pb-4 border-b border-white/5">
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <FiLayers className="text-blue-500" /> Course Curriculum
            </h2>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-500">
              {courseData?.sections?.length || 0} SECTIONS
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
             {courseData?.sections?.map((section, idx) => (
               <motion.div key={section._id} variants={itemVariants} className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden backdrop-blur-3xl">
                 <button onClick={() => setExpandedSection(expandedSection === section._id ? null : section._id)} className="w-full text-left p-6 md:p-8 flex items-center justify-between hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-6">
                       <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-mono font-bold text-lg">
                         {(idx + 1).toString().padStart(2, '0')}
                       </div>
                       <div>
                         <h3 className="text-xl font-bold mb-1">{section.sectionName}</h3>
                         <span className="text-[10px] tracking-widest uppercase font-black text-gray-500">
                           {section.videos?.length || 0} Video Lessons
                         </span>
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {isEnrolled ? (
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/give-exam/${section._id}`); }} className="hidden md:flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all">
                           Challenge <FiArrowRight />
                        </button>
                      ) : (
                        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-500 text-[10px] font-black uppercase tracking-widest cursor-not-allowed">
                           Locked <FiLock />
                        </div>
                      )}
                      <FiChevronRight className={`text-gray-600 transition-transform duration-300 ${expandedSection === section._id ? 'rotate-90' : 'rotate-0'}`} />
                    </div>
                 </button>
                 <AnimatePresence>
                   {expandedSection === section._id && (
                     <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/5">
                       <div className="p-6 md:p-8 pt-4 space-y-3">
                         {section.videos?.map((video) => (
                           <div key={video._id} className="group flex items-center justify-between p-4 rounded-2xl bg-[#0B0F1A]/50 border border-white/5 hover:border-blue-500/30 transition-all">
                              <div className="flex items-center gap-4">
                                <div className="p-2.5 rounded-xl bg-white/5 text-gray-500 group-hover:text-blue-400 transition-colors">
                                  {isEnrolled ? <FiPlay size={14}/> : <FiLock size={14}/>}
                                </div>
                                <span className={`text-sm font-medium ${isEnrolled ? 'cursor-pointer hover:text-blue-400' : 'text-gray-600 opacity-50'} transition-all`} onClick={() => isEnrolled && handleOpenModal(video)}>
                                  {video.title}
                                </span>
                              </div>
                              {isEnrolled && (
                                <button 
                                  onClick={() => navigate(`/video/comments/${video._id}`)}
                                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-400 hover:border-blue-500/30 transition-all shadow-inner"
                                  title="View Discussion"
                                >
                                  <FiMessageCircle size={14} />
                                  <span className="hidden sm:inline">Discussion</span>
                                </button>
                              )}
                           </div>
                         ))}
                       </div>
                     </motion.div>
                   )}
                 </AnimatePresence>
               </motion.div>
             ))}
          </div>
        </section>

      </motion.div>

      {/* Video Player */}
      {selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          video={selectedVideo}
        />
      )}
    </div>
  );
};

export default CourseDetail;
