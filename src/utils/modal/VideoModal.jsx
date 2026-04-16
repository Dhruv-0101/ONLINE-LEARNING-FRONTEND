import React from "react";
import { FiX, FiMonitor } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const VideoModal = ({ video, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Process the video URL
  const embedUrl = video.url.includes("youtube.com")
    ? video.url.replace("watch?v=", "embed/")
    : video.url;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center z-[300] p-4 md:p-12">
        {/* Deep Background Dimmer */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-[#000]/95 backdrop-blur-sm"
        />

        {/* Video Player Frame */}
        <motion.div 
          initial={{ scale: 0.1, opacity: 0, rotate: -5 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          exit={{ scale: 0, opacity: 0 }}
          className="relative w-full max-w-5xl aspect-video bg-[#1A1F2C] rounded-[2rem] md:rounded-[3rem] p-3 md:p-6 shadow-[0_0_100px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(255,255,255,0.05)] border-4 md:border-[12px] border-[#252B3B]"
        >
          {/* TV Top Bar / Bezel Detail */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-2 md:h-3 bg-[#252B3B] rounded-b-xl border-b border-white/5"></div>

          {/* Screen Content */}
          <div className="relative w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden bg-black shadow-inner group">
             {/* CRT Glass Effect Overlay */}
             <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-transparent z-10"></div>
             
             {/* Power Indicator */}
             <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2">
                <div className="text-[8px] font-black uppercase tracking-widest text-gray-600">Live</div>
                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-pulse"></div>
             </div>

             {/* The Video */}
             <iframe
               className="w-full h-full border-0"
               src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1&rel=0&modestbranding=1`}
               title={video.title}
               allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
               allowFullScreen
             ></iframe>
          </div>

          {/* Close / "Power Off" Button */}
          <button
            className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl hover:bg-red-500 hover:scale-110 transition-all z-50 border-4 border-[#0B0F1A]"
            onClick={onClose}
            title="Close Player"
          >
            <FiX size={24} />
          </button>

          {/* Footer Label */}
          <div className="absolute -bottom-10 left-0 w-full text-center">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] uppercase tracking-[0.3em] font-black backdrop-blur-xl">
               <FiMonitor className="text-sm" /> Lesson: {video.title}
             </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default VideoModal;
