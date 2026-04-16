import { useQuery } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import { 
  FiAward, FiTrendingUp, FiLayers, FiCalendar, 
  FiChevronLeft, FiActivity, FiArrowUp, FiTerminal
} from "react-icons/fi";
import { getAllUsersAPI } from "../../reactQuery/user/usersAPI";
import AlertMessage from "../Alert/AlertMessage";
import { motion } from "framer-motion";

const StudentRankList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const { data, error, isLoading } = useQuery({
    queryKey: ["course-rankings", courseId],
    queryFn: () => getAllUsersAPI(courseId),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  const topThree = data?.slice(0, 3) || [];
  const otherStudents = data?.slice(3) || [];

  const getRankStyle = (index) => {
    switch(index) {
       case 0: return { border: "border-yellow-500/50", glow: "shadow-[0_0_50px_rgba(234,179,8,0.2)]", icon: "text-yellow-500", label: "Gold Medalist" };
       case 1: return { border: "border-gray-300/50", glow: "shadow-[0_0_50px_rgba(209,213,219,0.1)]", icon: "text-gray-300", label: "Silver Medalist" };
       case 2: return { border: "border-orange-500/50", glow: "shadow-[0_0_50px_rgba(249,115,22,0.1)]", icon: "text-orange-500", label: "Bronze Medalist" };
       default: return {};
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-20">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-6 group"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
           </button>
           <h1 className="text-5xl font-black tracking-tighter mb-4">Student Leaderboard</h1>
           <p className="text-sm text-gray-500 uppercase tracking-[0.4em] font-black flex items-center justify-center gap-3">
              <FiActivity className="text-blue-500" /> Course Performance Rank
           </p>
        </header>

        {/* TOP 3 PODIUM */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 px-4">
           {topThree.map((student, idx) => {
             const style = getRankStyle(idx);
             return (
               <motion.div 
                 initial={{ y: 20, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 transition={{ delay: idx * 0.1 }}
                 key={student.id}
                 className={`p-10 rounded-[3rem] bg-white/[0.03] border-2 backdrop-blur-3xl relative overflow-hidden group hover:scale-[1.02] transition-all duration-500 ${style.border} ${style.glow}`}
               >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] -rotate-45 translate-x-16 -translate-y-16 group-hover:bg-white/[0.05] transition-all"></div>
                  
                  <div className="relative z-10 text-center">
                     <span className={`text-[10px] font-black uppercase tracking-[0.3em] mb-6 block ${style.icon}`}>{style.label}</span>
                     
                     <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-black/40 border border-white/10 flex items-center justify-center relative">
                        <FiAward size={36} className={style.icon} />
                        <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-blue-600 text-[10px] font-black flex items-center justify-center border-2 border-[#0B0F1A]">
                           {idx + 1}
                        </div>
                     </div>

                     <h3 className="text-2xl font-black tracking-tighter mb-2 truncate">{student.username}</h3>
                     <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-8 flex items-center justify-center gap-2">
                        <FiActivity /> Joined {new Date(student?.dateJoined).toLocaleDateString()}
                     </p>

                     <div className="pt-8 border-t border-white/5">
                        <div className="text-4xl font-black text-white mb-1">{student.progressPercentage}%</div>
                        <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest leading-none">Course Progress</p>
                        <p className="text-[9px] mt-2 text-gray-600 font-bold uppercase">{student.sectionsCompleted} / {student.totalSections} Lessons Completed</p>
                     </div>
                  </div>
               </motion.div>
             );
           })}
        </div>

        {/* THE REST OF THE PACK */}
        <div className="space-y-4 px-4">
           <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 mb-8 flex items-center gap-6">
              <FiLayers /> All Active Students
              <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
           </h3>

           {otherStudents.length === 0 && topThree.length === 0 && (
             <div className="py-24 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
                <p className="text-[10px] uppercase tracking-[0.5em] font-black">No active students found for this course yet.</p>
             </div>
           )}

           {otherStudents.map((student, idx) => (
             <motion.div 
               initial={{ x: -20, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               viewport={{ once: true }}
               transition={{ delay: idx * 0.05 }}
               key={student.id}
               className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-white/20 transition-all group flex items-center justify-between gap-6"
             >
                <div className="flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center font-mono text-sm text-gray-500">
                      {student.position}
                   </div>
                   <div>
                      <h4 className="font-black text-sm text-gray-200">{student.username}</h4>
                      <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Active Learner</p>
                   </div>
                </div>

                <div className="flex items-center gap-12 text-right">
                   <div className="hidden sm:block">
                      <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden mb-2">
                         <div className="h-full bg-blue-500/40" style={{ width: `${student.progressPercentage}%` }}></div>
                      </div>
                      <p className="text-[10px] text-gray-600 uppercase font-black tracking-tighter">{student.sectionsCompleted} / {student.totalSections} Lessons Completed</p>
                   </div>
                   <div className="min-w-[80px]">
                      <div className="text-xl font-black text-gray-300">{student.progressPercentage}%</div>
                      <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest">Progress</p>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>

        {/* Footer Metrics */}
        <div className="mt-24 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 opacity-40">
           <div className="flex items-center gap-4">
              <FiTrendingUp size={24} className="text-blue-500" />
              <p className="text-[10px] uppercase font-black tracking-[0.3em]">Platform performance optimized</p>
           </div>
           <p className="text-[8px] font-mono tracking-widest uppercase">Skill Buddy Global Education Network</p>
        </div>
      </div>
    </div>
  );
};

export default StudentRankList;
