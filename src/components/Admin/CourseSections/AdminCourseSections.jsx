import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { 
  FiEdit, FiTrash2, FiPlusCircle, FiTerminal, 
  FiActivity, FiCpu, FiBox, FiArrowRight,
  FiChevronLeft, FiLayers
} from "react-icons/fi";
import {
  deleteSectionAPI,
  getAllCourseSectionsAPI,
} from "../../../reactQuery/courseSections/courseSectionsAPI";
import { Link, useNavigate } from "react-router-dom";
import AlertMessage from "../../Alert/AlertMessage";
import { motion, AnimatePresence } from "framer-motion";

const AdminCourseSections = () => {
  const navigate = useNavigate();
  
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["course-sections"],
    queryFn: () => getAllCourseSectionsAPI(),
  });

  const mutation = useMutation({ mutationFn: deleteSectionAPI });

  const handleDelete = (sectionId) => {
    mutation.mutateAsync(sectionId).then(() => {
      refetch();
    });
  };

  const handleCreateExam = (sectionId) => {
    navigate(`/create-exam/${sectionId}`);
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-12">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-10 group"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
           </button>
           
           <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 shadow-[0_0_30px_#4f46e5] flex items-center justify-center shrink-0">
                 <FiTerminal size={32} />
              </div>
              <div>
                 <h1 className="text-4xl font-black tracking-tighter">Assessment Manager</h1>
                 <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black flex items-center gap-3">
                    <FiCpu className="text-indigo-500" /> Manage Course Exams
                 </p>
              </div>
           </div>
        </header>

        <AnimatePresence>
            {mutation.isPending && <AlertMessage type="loading" message="Deleting Section..." />}
            {mutation.isError && <AlertMessage type="error" message={mutation.error?.response?.data?.message} />}
        </AnimatePresence>

        <div className="space-y-6">
           <div className="flex items-center justify-between mb-8 px-4">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 flex items-center gap-6">
                 <FiLayers /> Course Sections ({data?.length})
                 <div className="hidden sm:block h-px w-32 bg-gradient-to-r from-white/5 to-transparent"></div>
              </h3>
              <p className="text-[8px] font-mono text-gray-700 uppercase tracking-widest italic">Platform Secure</p>
           </div>

           {data?.length > 0 ? (
             <div className="grid grid-cols-1 gap-4">
                {data?.map((section, idx) => (
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    key={section._id}
                    className="group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 hover:bg-white/[0.04] flex items-center justify-between"
                  >
                     <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-[#161B28] border border-white/5 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-xl">
                           <FiBox size={24} />
                        </div>
                        <div>
                           <h3 className="text-xl font-black tracking-tighter text-gray-200 group-hover:text-indigo-400 transition-colors uppercase">{section.sectionName}</h3>
                           <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1">Status: Ready for Assessment</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleCreateExam(section._id)}
                          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white transition-all shadow-lg"
                        >
                           Create Quiz <FiPlusCircle size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(section._id)}
                          className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 text-gray-500 hover:text-red-500 hover:border-red-500/50 flex items-center justify-center transition-all"
                          title="Delete Section"
                        >
                           <FiTrash2 size={18} />
                        </button>
                     </div>
                  </motion.div>
                ))}
             </div>
           ) : (
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="py-32 flex flex-col items-center justify-center text-center bg-white/[0.02] border border-white/5 rounded-[4rem] backdrop-blur-3xl group"
             >
                <div className="w-20 h-20 bg-indigo-500/10 rounded-[2rem] flex items-center justify-center text-indigo-500 mb-8 border border-white/5 group-hover:rotate-12 transition-transform">
                   <FiActivity size={40} />
                </div>
                <h2 className="text-2xl font-black tracking-tighter mb-4">No Sections Available</h2>
                <p className="text-gray-500 max-w-xs mx-auto text-sm leading-relaxed mb-10 italic">
                   Once you add sections to your courses, they will appear here for assessment management.
                </p>
                <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.5em] text-gray-700">
                   <div className="w-8 h-px bg-white/5"></div>
                   System Standby
                   <div className="w-8 h-px bg-white/5"></div>
                </div>
             </motion.div>
           )}
        </div>

        {/* HUD FOOTER */}
        <div className="mt-24 flex items-center justify-center opacity-10">
           <div className="text-center">
              <p className="text-[8px] font-mono tracking-[0.5em] uppercase mb-2">Quiz Management System v2.4</p>
              <div className="flex items-center gap-2 justify-center">
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
                 <div className="w-1 h-1 bg-white rounded-full"></div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseSections;
