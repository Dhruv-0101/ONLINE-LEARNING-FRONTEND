import React from "react";
import { motion } from "framer-motion";
import { FiShield, FiLock, FiCpu } from "react-icons/fi";

const AuthCheckingComponent = () => {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0B0F1A] overflow-hidden">
      {/* Background Animated Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-600/10 blur-[80px] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="relative z-10 flex flex-col items-center">
        {/* Futuristic Spinner */}
        <div className="relative w-32 h-32 mb-12">
          {/* Outer Ring */}
          <motion.div 
            className="absolute inset-0 border-2 border-dashed border-purple-500/30 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Middle Ring */}
          <motion.div 
            className="absolute inset-2 border-2 border-t-blue-500 border-r-transparent border-b-cyan-500 border-l-transparent rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />

          {/* Inner Core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-blue-400 text-4xl"
            >
              <FiShield />
            </motion.div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-blue-500/50"></div>
            <span className="text-xs uppercase tracking-[0.4em] text-blue-400 font-bold">Secure Access</span>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-blue-500/50"></div>
          </motion.div>

          <motion.h2
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl font-bold text-white tracking-tight"
          >
            Setting up your session
          </motion.h2>

          <p className="text-gray-500 text-sm font-medium tracking-wide">
            Getting everything ready for you...
          </p>
        </div>

        {/* Bottom Status Info */}
        <motion.div 
          className="mt-16 flex items-center gap-6 px-6 py-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <FiCpu className="text-purple-400 animate-pulse" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">System: Online</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10"></div>
          <div className="flex items-center gap-2">
            <FiLock className="text-cyan-400 animate-pulse" />
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Safe & Secure</span>
          </div>
        </motion.div>
      </div>

      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
    </div>
  );
};

export default AuthCheckingComponent;
