import React from "react";
import { FiAward, FiClock, FiUsers, FiDollarSign, FiZap, FiBookOpen } from "react-icons/fi";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CourseChallengeAnnouncement = () => {
  const navigate = useNavigate();

  const handleStartNowClick = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-12 px-6 flex items-center justify-center relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl w-full bg-white/[0.02] border border-white/10 rounded-[4rem] p-12 lg:p-20 backdrop-blur-3xl shadow-3xl relative z-10"
      >
        <div className="flex flex-col items-center text-center">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-32 h-32 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-[2.5rem] flex items-center justify-center border border-yellow-500/30 mb-10 shadow-[0_0_50px_rgba(234,179,8,0.2)]"
          >
            <FiAward className="text-6xl text-yellow-500" />
          </motion.div>

          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-6 px-6 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">Exclusive Learning Challenge</span>
          
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-8 leading-tight">
            Win <span className="text-green-400">$100</span> & Unlock <br/>
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent italic">Elite Rewards</span>
          </h1>
          
          <p className="text-gray-400 text-lg max-w-2xl mb-16 leading-relaxed">
            Be the first to complete our <span className="text-white font-bold">Fullstack Web Development Course (MERN)</span> and claim your spot among the top achievers.
          </p>
        </div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center gap-4 text-center hover:bg-white/5 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-400 border border-green-500/20">
              <FiDollarSign size={28} />
            </div>
            <h3 className="text-xl font-black tracking-tight">$100 Cash</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">First Finisher Prize</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center gap-4 text-center hover:bg-white/5 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <FiBookOpen size={28} />
            </div>
            <h3 className="text-xl font-black tracking-tight">Free Course</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">Skill Expansion Credit</p>
          </div>

          <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 flex flex-col items-center gap-4 text-center hover:bg-white/5 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
              <FiUsers size={28} />
            </div>
            <h3 className="text-xl font-black tracking-tight">Live Support</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-500">3 Days VIP Assistance</p>
          </div>
        </div>

        <div className="bg-blue-600/5 border border-blue-500/10 p-10 rounded-[3rem] text-center mb-16 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <FiClock size={100} />
          </div>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 relative z-10">
            <div className="flex items-center gap-3">
              <FiClock className="text-blue-500" size={32} />
              <div className="text-left">
                <p className="text-[10px] uppercase font-black tracking-widest text-gray-500 leading-none mb-1">Duration</p>
                <p className="text-2xl font-black tracking-tighter">3 Months</p>
              </div>
            </div>
            <div className="h-px w-24 bg-white/5 hidden md:block"></div>
            <p className="text-gray-400 font-bold italic tracking-tight">Accelerate your learning and be the first to complete the course!</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-8">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-gray-600">
            Note: The winner will be interviewed to assess understanding.
          </p>
          <button
            onClick={handleStartNowClick}
            className="px-12 py-6 bg-blue-600 hover:bg-blue-500 rounded-[2rem] text-white font-black text-sm uppercase tracking-[0.3em] transition-all shadow-[0_20px_50px_rgba(37,99,235,0.3)] hover:-translate-y-2 active:scale-95 flex items-center gap-3"
          >
            Start Now <FiZap className="fill-current" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseChallengeAnnouncement;
