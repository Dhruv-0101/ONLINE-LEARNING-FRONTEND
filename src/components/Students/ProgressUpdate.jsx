import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { 
  FiLayers, FiChevronLeft, FiActivity, FiZap, 
  FiCheckCircle, FiClock, FiCoffee, FiPauseCircle,
  FiPlay, FiCheck, FiCpu
} from "react-icons/fi";
import { getUserProfileAPI } from "../../reactQuery/user/usersAPI";
import { updateProgressAPI } from "../../reactQuery/courseSections/courseSectionsAPI";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ProgressUpdate = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const {
    data,
    error,
    isLoading,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ["course-sections"],
    queryFn: () => getUserProfileAPI(courseId),
  });

  const updateProgressMutation = useMutation({
    mutationKey: ["update-course-sections"],
    mutationFn: updateProgressAPI,
  });

  const ongoingSections = data?.courseProgress?.sections || [];
  const ongoingCourse = data?.courseProgress?.courseId;

  const handleProgressChange = async (sectionId, newStatus) => {
    const updateData = {
      sectionId: sectionId?._id,
      newStatus,
      courseId,
    };
    updateProgressMutation.mutateAsync(updateData).then(() => {
      profileRefetch();
    });
  };

  const statusMap = [
    { value: "In Progress", label: "In Progress", icon: <FiZap />, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { value: "Paused", label: "Paused", icon: <FiPauseCircle />, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
    { value: "Completed", label: "Completed", icon: <FiCheckCircle />, color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20" },
    { value: "Away", label: "Away", icon: <FiCoffee />, color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20" },
  ];

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
           <div className="flex-1 text-center md:text-left">
              <button 
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-6 group"
              >
                <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
              </button>
              <h1 className="text-4xl font-black tracking-tighter mb-4">{ongoingCourse?.title}</h1>
              <p className="text-sm text-gray-500 uppercase tracking-[0.2em] font-black flex items-center justify-center md:justify-start gap-3">
                 <FiActivity className="text-blue-500" /> Manual Progress Update
              </p>
           </div>
           
           <div className="p-8 rounded-[2.5rem] bg-blue-600/10 border border-blue-500/20 backdrop-blur-3xl text-center min-w-[200px]">
              <div className="text-4xl font-black tracking-tighter text-blue-500 mb-1">
                 {Math.round((ongoingSections.filter(s => s.status === 'Completed').length / ongoingSections.length) * 100) || 0}%
              </div>
              <p className="text-[10px] text-blue-500/60 uppercase font-black tracking-widest">Section Progress</p>
           </div>
        </div>

        {/* Sync Status HUD */}
        <AnimatePresence>
          {updateProgressMutation.isPending && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-8 p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-blue-400">
               <FiZap className="animate-pulse" /> Updating course progress...
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6">
          {ongoingSections?.map((section, index) => (
            <motion.div 
              key={section.sectionId?._id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-8 rounded-[3rem] bg-white/[0.03] border border-white/5 hover:border-blue-500/20 transition-all group lg:flex items-center justify-between gap-12"
            >
              <div className="mb-8 lg:mb-0">
                <div className="flex items-center gap-3 mb-3">
                   <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 font-mono text-xs">
                      {(index + 1).toString().padStart(2, '0')}
                   </div>
                   <h3 className="text-lg font-bold text-gray-100">{section.sectionId?.sectionName}</h3>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full ${section.status === 'Completed' ? 'bg-green-500' : 'bg-blue-500'} transition-all`} style={{ width: section.status === 'Completed' ? '100%' : '40%' }}></div>
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{section.status}</span>
                </div>
              </div>

              {/* Status Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
                 {statusMap.map((status) => (
                   <button
                     key={status.value}
                     onClick={() => handleProgressChange(section.sectionId, status.value)}
                     className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-3 w-28 ${
                       section.status === status.value 
                        ? `${status.bg} ${status.border} ${status.color} shadow-lg scale-105` 
                        : 'bg-white/5 border-transparent text-gray-600 hover:bg-white/10'
                     }`}
                   >
                     <div className={`text-xl ${section.status === status.value ? status.color : 'text-gray-500'}`}>
                        {status.icon}
                     </div>
                     <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{status.label}</span>
                   </button>
                 ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Stats Footer */}
        <div className="mt-20 p-12 rounded-[4rem] bg-gradient-to-br from-blue-600 text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
                 <FiCpu size={32} />
              </div>
              <div>
                 <h4 className="text-xl font-black italic tracking-tighter">Learning Mode Active</h4>
                 <p className="text-[10px] uppercase font-black tracking-widest opacity-60">Saving your progress across all devices.</p>
              </div>
           </div>
           <button onClick={() => navigate(-1)} className="relative z-10 px-10 py-4 bg-white text-black rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all">Save Progress</button>
        </div>
      </div>
    </div>
  );
};

export default ProgressUpdate;
