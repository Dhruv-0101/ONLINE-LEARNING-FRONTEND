import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiSearch, FiFilter, FiBookOpen, FiUser, FiUsers, FiLayers, 
  FiStar, FiTrendingUp, FiCheckCircle, FiChevronDown, FiZap,
  FiAward, FiX, FiMessageCircle, FiEdit3, FiSend, FiLock
} from "react-icons/fi";
import {
  checkAllCourseEnrolled,
  getAllCoursesAPI,
  getCourseReviewsAPI,
  submitReview
} from "../../reactQuery/courses/coursesAPI";
import { Link } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

const Courses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState([0, 1000]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedDate, setSelectedDate] = useState("latest");
  const [activeReviewId, setActiveReviewId] = useState(null);

  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
  });

  const { data: enrolledCourses, refetch: refetchEnrollment } = useQuery({
    queryKey: ["courses-check"],
    queryFn: checkAllCourseEnrolled,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
          <p className="text-blue-400 font-mono text-xs uppercase tracking-widest animate-pulse">Loading Courses...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return <AlertMessage type="error" message={error?.response?.data?.message || error?.message} />;
  }

  const isEnrolled = (courseId) => enrolledCourses?.some(c => c._id === courseId);

  const filteredCourses = data
    ?.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(c => c.price >= selectedPrice[0] && c.price <= selectedPrice[1])
    .filter(c => c.averageRating >= selectedRating)
    .sort((a, b) => {
      return selectedDate === "latest" 
        ? new Date(b.createdAt) - new Date(a.createdAt) 
        : new Date(a.createdAt) - new Date(b.createdAt);
    });

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-28 pb-20 px-6 lg:px-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto relative z-10">
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-2/3 max-w-2xl">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 text-xl" />
            <input
              type="text"
              placeholder="Search for courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all text-gray-200"
            />
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <button onClick={() => setShowFilter(!showFilter)} className={`flex items-center gap-2 px-6 py-4 rounded-2xl border transition-all font-bold text-sm ${showFilter ? 'bg-blue-600 border-blue-500 shadow-lg' : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'}`}>
              <FiFilter /> Filters {showFilter ? <FiChevronDown className="rotate-180 transition-transform" /> : <FiChevronDown className="transition-transform" />}
            </button>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-gray-400 focus:outline-none hover:bg-white/10 transition-all cursor-pointer">
              <option value="latest" className="bg-[#0B0F1A]">Newest</option>
              <option value="oldest" className="bg-[#0B0F1A]">Oldest</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showFilter && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-12">
              <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 backdrop-blur-3xl">
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Course Price</h4>
                  <div className="px-2">
                    <Slider range min={0} max={1000} defaultValue={selectedPrice} onChange={(value) => setSelectedPrice(value)} trackStyle={{ backgroundColor: "#3B82F6", height: 6 }} railStyle={{ backgroundColor: "rgba(255,255,255,0.05)", height: 6 }} />
                    <div className="flex justify-between mt-4 text-[10px] font-mono text-gray-500">
                      <span>${selectedPrice[0]}</span>
                      <span className="text-blue-400">${selectedPrice[1]} MAX</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6">Student Rating</h4>
                  <div className="flex gap-2 flex-wrap">
                    {[0, 1, 2, 3, 4, 5].map((r) => (
                      <button key={r} onClick={() => setSelectedRating(r)} className={`px-4 py-2 rounded-xl border text-[10px] font-bold transition-all ${selectedRating === r ? 'bg-blue-600 border-blue-500 shadow-lg shadow-blue-500/20' : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                        {r === 0 ? "All" : `${r}+ Stars`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses?.map((course) => (
            <CourseCard 
              key={course._id} 
              course={course} 
              isEnrolled={isEnrolled(course._id)} 
              onReviewClick={() => setActiveReviewId(course._id)}
            />
          ))}
        </div>
      </motion.div>

      {/* Global Review Modal */}
      <AnimatePresence>
        {activeReviewId && (
          <CourseReviewModal 
            courseId={activeReviewId} 
            isEnrolled={isEnrolled(activeReviewId)}
            onClose={() => setActiveReviewId(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

const CourseReviewModal = ({ courseId, isEnrolled, onClose }) => {
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterRating, setFilterRating] = useState(0); // 0 means 'All'

  const { data: reviews, refetch } = useQuery({
    queryKey: ["reviews", courseId],
    queryFn: () => getCourseReviewsAPI(courseId),
  });

  const filteredReviews = reviews?.filter(r => {
    if (filterRating === 0) return true;
    return Math.floor(Number(r.rating)) === Number(filterRating);
  }) || [];

  const mutation = useMutation({
    mutationFn: (data) => submitReview(courseId, data),
    onSuccess: () => {
      refetch();
      setMessage("");
      setIsSubmitting(false);
    },
    onError: (err) => {
      alert(err?.response?.data?.message || "Submission failed.");
      setIsSubmitting(false);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSubmitting(true);
    mutation.mutate({ reviewText: message, rating });
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-8 backdrop-blur-xl bg-[#0B0F1A]/80"
    >
      <motion.div 
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-4xl max-h-[90vh] bg-[#161B28] border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
               <FiMessageCircle size={24} />
             </div>
             <div>
               <h2 className="text-xl font-black uppercase tracking-tight">Review Center</h2>
               <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em]">STUDENT EXPERIENCES & FEEDBACK</p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
            <FiX size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-12 p-8 overflow-hidden">
           {/* Reviews List Column */}
           <div className="overflow-y-auto custom-scrollbar pr-4 space-y-6">
              <div className="mb-8">
                 <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Student Reviews ({filteredReviews.length})</h3>
                    <div className="flex items-center gap-2">
                       <FiZap className="text-yellow-500 text-xs" />
                       <span className="text-[8px] text-gray-700 font-bold uppercase tracking-widest">Live Feedback</span>
                    </div>
                 </div>
                 
                 {/* Rating Filters */}
                 <div className="flex flex-wrap gap-2">
                    {[0, 5, 4, 3, 2, 1].map((num) => (
                      <button
                        key={num}
                        onClick={() => setFilterRating(num)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          filterRating === num 
                            ? 'bg-purple-600 border-purple-500 text-white shadow-lg' 
                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'
                        }`}
                      >
                         {num === 0 ? 'All' : `${num} ★`}
                      </button>
                    ))}
                 </div>
              </div>
              
              {filteredReviews.length > 0 ? filteredReviews.map(r => (
                <div key={r._id} className="p-6 rounded-3xl bg-white/[0.02] border border-white/10 relative overflow-hidden group">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                         <div className="flex items-center gap-3 mb-1">
                           <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-xs uppercase">
                             {r.user?.username?.charAt(0)}
                           </div>
                           <span className="text-xs font-bold text-gray-300">{r.user?.username}</span>
                         </div>
                         <p className="text-[8px] text-gray-600 font-bold uppercase tracking-widest pl-11">
                            {r.createdAt ? new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Recent Review'}
                         </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                         <span className="text-xs font-black text-yellow-500">{Number(r.rating).toFixed(1)}</span>
                         <div className="flex items-center gap-1 text-yellow-500 text-[10px]">
                            {[...Array(5)].map((_, i) => <FiStar key={i} className={i < r.rating ? "fill-current" : "opacity-30"} />)}
                         </div>
                      </div>
                   </div>
                   <p className="text-gray-400 text-xs leading-relaxed italic border-t border-white/5 pt-4 mt-2">"{r.message}"</p>
                </div>
              )) : (
                <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-gray-700 mb-6">
                     <FiZap size={32} />
                  </div>
                  <h4 className="text-sm font-black uppercase tracking-widest text-gray-500 mb-2">Pristine Course</h4>
                  <p className="text-[10px] text-gray-600 font-bold tracking-widest uppercase">Be the first to share your learning experience.</p>
                </div>
              )}
           </div>

           {/* Submission Column - Static */}
           <div className="h-full">
              {isEnrolled ? (
                <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 sticky top-0">
                   <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                     <FiEdit3 className="text-blue-400" /> Share Your Review
                   </h3>
                   <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] text-gray-500 uppercase tracking-widest font-black block">Your Rating</span>
                          <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
                            <FiStar className="fill-current" /> {rating.toFixed(1)}
                          </span>
                        </div>
                        <div className="px-2 mb-8">
                          <Slider 
                            min={1} 
                            max={5} 
                            step={0.1}
                            defaultValue={rating} 
                            onChange={(val) => setRating(val)} 
                            trackStyle={{ backgroundColor: "#EAB308", height: 6 }} 
                            handleStyle={{ borderColor: "#EAB308", backgroundColor: "#fff", width: 20, height: 20, marginTop: -7, opacity: 1, boxShadow: "0 0 10px rgba(234, 179, 8, 0.4)" }}
                            railStyle={{ backgroundColor: "rgba(255,255,255,0.05)", height: 6 }} 
                          />
                        </div>
                     </div>
                     <textarea 
                       value={message}
                       onChange={(e) => setMessage(e.target.value)}
                       placeholder="Write your review here..."
                       className="w-full h-32 bg-[#0B0F1A] border border-white/5 rounded-2xl p-4 text-xs text-gray-300 focus:border-blue-500/50 outline-none transition-all resize-none"
                     />
                     <button disabled={isSubmitting || !message.trim()} className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 disabled:opacity-50">
                        {isSubmitting ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><FiSend /> Submit Review</>}
                     </button>
                   </form>
                </div>
              ) : (
                <div className="p-8 rounded-[2rem] bg-white/[0.01] border border-white/5 border-dashed text-center h-full flex flex-col items-center justify-center">
                  <FiLock size={40} className="mx-auto mb-4 text-gray-700" />
                  <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-2">Enrollment Required</h4>
                  <p className="text-[10px] text-gray-600 leading-relaxed mb-6">You must be enrolled in this course to leave a review.</p>
                  <Link to={`/checkout/${courseId}`} className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 hover:text-blue-300 underline underline-offset-8">Enroll Now</Link>
                </div>
              )}
           </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CourseCard = ({ course, isEnrolled, onReviewClick }) => {
  return (
    <motion.div whileHover={{ y: -8 }} className="group flex flex-col h-full bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden hover:bg-white/[0.05] transition-all relative">
      {isEnrolled && (
        <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-widest">
          <FiCheckCircle /> Enrolled
        </div>
      )}

      <div className="h-48 relative overflow-hidden bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
        <div className="absolute inset-0 bg-[#000]/10 pointer-events-none"></div>
        <motion.div className="relative z-10 w-16 h-16 bg-white shadow-2xl rounded-2xl flex items-center justify-center text-blue-600">
          <FiBookOpen size={30} />
        </motion.div>
        <div className="absolute bottom-6 right-6 px-4 py-2 rounded-xl bg-[#0B0F1A]/80 backdrop-blur-md border border-white/10 text-[10px] font-black tracking-widest uppercase text-white shadow-xl">
          ${course.price}
        </div>
      </div>

      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400/80">{course.difficulty} LEVEL</span>
          <button 
            onClick={onReviewClick} 
            className="flex items-center gap-1.5 text-yellow-500 text-[10px] font-black hover:scale-110 transition-transform bg-yellow-500/5 px-2 py-1 rounded-lg border border-yellow-500/20"
          >
            <FiStar className="fill-current" /> {course.averageRating || '0.0'}
          </button>
        </div>

        <h3 className="text-xl font-bold mb-4 line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors uppercase tracking-tight">{course.title}</h3>
        
        <p className="text-gray-500 text-xs mb-8 line-clamp-2 leading-relaxed italic">"{course.description}"</p>

        <div className="mt-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><FiUsers size={12} className="text-purple-400"/></div>
              <span className="text-[10px] font-bold text-gray-400">{course.students?.length || 0} Students</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center"><FiLayers size={12} className="text-blue-400"/></div>
              <span className="text-[10px] font-bold text-gray-400">{course.sections?.length || 0} Lessons</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[8px] font-black text-white uppercase border border-white/10">
                {course?.user?.username?.charAt(0)}
              </div>
              <span className="text-[10px] font-bold text-gray-500 tracking-wide">{course?.user?.username}</span>
            </div>
            
            <Link to={`/courses/${course._id}`} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isEnrolled ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
              {isEnrolled ? "View" : "Enroll"} <FiTrendingUp />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Courses;
