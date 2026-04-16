import React from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchExamsResult } from "../../reactQuery/courseSections/courseSectionsAPI";
import { 
  FiCheckCircle, FiXCircle, FiTrendingUp, FiActivity, 
  FiShield, FiArrowRight, FiInfo, FiLayers, FiRefreshCw
} from "react-icons/fi";
import { motion } from "framer-motion";

const ExamResultsPage = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  const {
    data: courseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["examresult", sectionId],
    queryFn: () => fetchExamsResult(sectionId),
  });

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center px-6">
      <div className="p-12 rounded-[3rem] bg-red-500/5 border border-red-500/20 text-center max-w-md">
         <FiXCircle size={48} className="text-red-500 mx-auto mb-6" />
         <h2 className="text-xl font-black text-red-500 uppercase tracking-widest mb-4">Error Loading Results</h2>
         <p className="text-sm text-gray-500 leading-relaxed mb-8">Failed to retrieve quiz data from the server.</p>
         <button onClick={() => window.location.reload()} className="px-8 py-3 bg-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white">Retry</button>
      </div>
    </div>
  );

  const exams = courseData?.exams || [];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white py-24 pb-32 px-6">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="text-center mb-20">
           <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              <FiShield /> Quiz Results
           </motion.div>
           <h1 className="text-5xl font-black tracking-tighter mb-4">Quiz Results</h1>
           <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">Status: Completed</p>
        </header>

        {exams.length === 0 ? (
          <div className="text-center py-24 p-12 rounded-[4rem] bg-white/[0.02] border border-white/5 border-dashed">
             <FiInfo size={48} className="text-gray-600 mx-auto mb-6 opacity-30" />
             <p className="text-sm text-gray-600 font-black uppercase tracking-[0.4em]">No quiz records found for this section.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const totalQuestions = exam.answers.length;
            const correctOnes = exam.answers.filter(a => a.isCorrect).length;
            const scorePercentage = Math.round((correctOnes / totalQuestions) * 100);
            const isPassed = scorePercentage >= 70;

            return (
              <div key={exam.examId} className="space-y-12">
                {/* Summary Score Card */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="p-12 rounded-[4rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden text-center"
                >
                   {/* Background Status Indicator */}
                   <div className={`absolute top-0 right-0 w-64 h-64 blur-[120px] rounded-full opacity-20 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                   
                   <div className="relative z-10">
                      <div className="flex justify-center mb-8">
                         <div className={`w-36 h-36 rounded-full border-8 flex items-center justify-center relative ${isPassed ? 'border-green-500/20' : 'border-red-500/20'}`}>
                            {/* Circular Progress (Simplified) */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90">
                               <circle 
                                 cx="72" cy="72" r="64" 
                                 stroke="currentColor" strokeWidth="8" fill="transparent" 
                                 className={`${isPassed ? 'text-green-500' : 'text-red-500'}`}
                                 strokeDasharray={402}
                                 strokeDashoffset={402 - (402 * scorePercentage) / 100}
                               />
                            </svg>
                            <span className="text-4xl font-black tracking-tighter">{scorePercentage}%</span>
                         </div>
                      </div>
                      
                      <h2 className={`text-2xl font-black uppercase tracking-[0.3em] mb-4 ${isPassed ? 'text-green-500' : 'text-red-500'}`}>
                         {isPassed ? "Quiz Passed" : "Quiz Failed"}
                      </h2>
                      <p className="text-gray-400 text-sm mb-12 max-w-lg mx-auto leading-relaxed">
                         {isPassed 
                           ? "Congratulations! You have successfully passed this quiz."
                           : "Quiz not passed. Please review the lessons and try again to achieve the passing score of 70%."}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                         <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-widest mb-1">Total Questions</p>
                            <p className="text-2xl font-black">{totalQuestions}</p>
                         </div>
                         <div className="p-6 rounded-3xl bg-green-500/10 border border-green-500/20">
                            <p className="text-[10px] text-green-500/60 uppercase font-black tracking-widest mb-1">Correct</p>
                            <p className="text-2xl font-black text-green-500">{correctOnes}</p>
                         </div>
                         <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/20">
                            <p className="text-[10px] text-red-500/60 uppercase font-black tracking-widest mb-1">Incorrect</p>
                            <p className="text-2xl font-black text-red-500">{totalQuestions - correctOnes}</p>
                         </div>
                      </div>
                   </div>
                </motion.div>

                {/* Question Breakdown */}
                <div className="space-y-6">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-600 mb-8 flex items-center gap-4">
                      <FiActivity /> Question Breakdown
                      <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
                   </h3>
                   
                   {exam.answers.map((answer, index) => {
                     const options = answer.options || {};
                     return (
                       <motion.div 
                         key={index} 
                         initial={{ opacity: 0, x: -20 }}
                         whileInView={{ opacity: 1, x: 0 }}
                         viewport={{ once: true }}
                         className={`p-10 rounded-[3rem] bg-white/[0.02] border transition-all ${answer.isCorrect ? 'border-green-500/10 hover:border-green-500/30' : 'border-red-500/10 hover:border-red-500/30'}`}
                       >
                         <div className="flex items-start gap-8">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all ${answer.isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                               {answer.isCorrect ? <FiCheckCircle size={24}/> : <FiXCircle size={24}/>}
                            </div>
                            
                            <div className="flex-1">
                               <div className="flex items-center justify-between mb-8">
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">Question #{index + 1}</span>
                                  <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${answer.isCorrect ? 'bg-green-500/5 border-green-500/10 text-green-500' : 'bg-red-500/5 border-red-500/10 text-red-500'}`}>
                                     {answer.isCorrect ? 'CORRECT' : 'INCORRECT'}
                                  </span>
                               </div>
                               
                               <h4 className="text-xl font-bold text-gray-100 mb-10 leading-relaxed italic">{answer.question.question}</h4>
                               
                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 opacity-60">
                                  {Object.entries(options).map(([key, label]) => (
                                    <div key={key} className={`p-4 rounded-2xl border text-sm flex items-center gap-4 ${
                                      answer.correctAnswer.slice(-1) === key ? 'bg-green-500/10 border-green-500/20 text-green-500 font-bold opacity-100' : 'bg-black/20 border-white/5 text-gray-500'
                                    }`}>
                                       <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-[10px] font-black uppercase tracking-tighter">{key}</span>
                                       {label}
                                    </div>
                                  ))}
                               </div>
                               
                               <div className="flex items-center gap-12 pt-8 border-t border-white/5">
                                  <div>
                                     <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">Your Answer</p>
                                     <p className={`text-sm font-black uppercase tracking-tighter flex items-center gap-2 ${answer.isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                                        <FiActivity size={14}/> Option {answer.selectedOption?.slice(-1)}
                                     </p>
                                  </div>
                                  <div>
                                     <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest mb-2">Correct Answer</p>
                                     <p className="text-sm font-black text-blue-500 uppercase tracking-tighter flex items-center gap-2">
                                        <FiShield size={14}/> Option {answer.correctAnswer?.slice(-1)}
                                     </p>
                                  </div>
                               </div>
                            </div>
                         </div>
                       </motion.div>
                     );
                   })}
                </div>

                {/* Action Bar */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-12">
                   {!isPassed && (
                     <button
                       onClick={() => navigate(`/give-exam/${sectionId}`)}
                       className="px-10 py-5 rounded-[2.5rem] bg-orange-600 hover:bg-orange-500 text-sm font-black uppercase tracking-widest transition-all shadow-[0_10px_40px_rgba(234,88,12,0.2)] flex items-center gap-3"
                     >
                       <FiRefreshCw /> Retake Quiz
                     </button>
                   )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <footer className="mt-24 text-center border-t border-white/5 pt-12 opacity-20">
         <p className="text-[10px] font-black uppercase tracking-[0.5em]">Skill Buddy © 2026 Learning Network</p>
      </footer>
    </div>
  );
};

export default ExamResultsPage;
