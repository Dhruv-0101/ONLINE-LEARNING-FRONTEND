import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getExamDetailsAPI,
  submitExamAPI,
} from "../../reactQuery/courseSections/courseSectionsAPI";
import { 
  FiClock, FiAlertCircle, FiArrowRight, FiCheckCircle, 
  FiShield, FiZap, FiActivity, FiLayers, FiInfo
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ExamDetails = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();

  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [showReview, setShowReview] = useState(false);
  const [reviewTimeLeft, setReviewTimeLeft] = useState(180);

  const {
    data: exam,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["exam", sectionId],
    queryFn: () => getExamDetailsAPI(sectionId),
  });

  const shuffleArray = (array) =>
    array
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

  useEffect(() => {
    if (exam?.questions) {
      const shuffled = exam.questions.map((q) => {
        const options = [
          { key: "optionA", label: q.optionA, id: 'A' },
          { key: "optionB", label: q.optionB, id: 'B' },
          { key: "optionC", label: q.optionC, id: 'C' },
          { key: "optionD", label: q.optionD, id: 'D' },
        ];
        return {
          ...q,
          shuffledOptions: shuffleArray(options),
        };
      });
      setShuffledQuestions(shuffled);
    }
  }, [exam]);

  useEffect(() => {
    if (!showReview && currentQuestionIndex < shuffledQuestions.length) {
      setTimeLeft(60);
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            goToNextQuestion();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, shuffledQuestions, showReview]);

  useEffect(() => {
    if (showReview) {
      setReviewTimeLeft(180);
      const reviewTimer = setInterval(() => {
        setReviewTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(reviewTimer);
            handleSubmit();
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(reviewTimer);
    }
  }, [showReview]);

  const handleAnswerChange = (questionId, optionKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleSubmit = async () => {
    if (!exam) return;
    const answers = Object.keys(selectedAnswers).map((questionId) => ({
      questionId,
      selectedOption: selectedAnswers[questionId],
    }));

    try {
      setIsSubmitting(true);
      const result = await submitExamAPI(sectionId, answers);
      setSubmissionStatus({ success: true, message: result.message });
      setTimeout(() => navigate(`/exam-results/${sectionId}`), 2000);
    } catch (error) {
      setSubmissionStatus({ success: false, message: error.message });
      setIsSubmitting(false);
    }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (showReview) {
    return (
      <div className="min-h-screen bg-[#0B0F1A] text-white py-24 px-6 relative overflow-x-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
           <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-3xl font-black tracking-tighter mb-2">Final Review</h1>
                <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Status: Quiz Review</p>
              </div>
              <div className="text-right">
                 <div className="flex items-center gap-2 text-red-500 font-mono text-2xl mb-1">
                    <FiClock /> {formatTime(reviewTimeLeft)}
                 </div>
                 <p className="text-[10px] text-gray-600 uppercase font-black">Time remaining</p>
              </div>
           </div>

           <div className="space-y-6 mb-12">
              {shuffledQuestions?.map((question, index) => (
                <div key={question?._id} className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                   <div className="flex items-start gap-6">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 font-black shrink-0">
                         {index + 1}
                      </div>
                      <div className="flex-1">
                         <h3 className="text-lg font-bold text-gray-200 mb-6">{question?.question}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {question?.shuffledOptions?.map((option) => (
                              <button
                                key={option?.key}
                                onClick={() => handleAnswerChange(question?._id, option?.key)}
                                className={`p-4 rounded-2xl border text-left text-sm transition-all flex items-center gap-3 ${
                                  selectedAnswers?.[question?._id] === option?.key 
                                  ? 'bg-blue-600 border-blue-400 text-white shadow-lg' 
                                  : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/20'
                                }`}
                              >
                                <span className="w-6 h-6 rounded-lg bg-black/20 flex items-center justify-center text-[10px] font-black">{option.id}</span>
                                {option?.label}
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
              ))}
           </div>

           <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-12 py-5 rounded-3xl bg-green-600 hover:bg-green-500 text-sm font-black uppercase tracking-[0.2em] transition-all shadow-[0_10px_40px_rgba(22,163,74,0.3)] flex items-center gap-3"
              >
                {isSubmitting ? "Submitting Quiz..." : <><span>Submit Assessment</span> <FiCheckCircle /></>}
              </button>
           </div>
           
           {submissionStatus && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`mt-8 p-6 rounded-3xl text-center font-black uppercase tracking-widest text-xs border ${submissionStatus.success ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                {submissionStatus.message}
             </motion.div>
           )}
        </div>
      </div>
    );
  }

  const currentQuestion = shuffledQuestions?.[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Grid Accent */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_100%)]"></div>
      
      <div className="max-w-4xl w-full relative z-10">
        {/* PROGRESS HUD */}
        <div className="flex items-center justify-between mb-12">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 shadow-[0_0_20px_#2563eb] flex items-center justify-center">
                 <FiShield size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black tracking-tight">{exam?.name}</h2>
                 <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black flex items-center gap-2">
                    <FiLayers /> Question {currentQuestionIndex + 1} / {shuffledQuestions.length}
                 </p>
              </div>
           </div>
           <div className="text-right">
              <div className={`text-3xl font-mono font-black mb-1 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                 {formatTime(timeLeft)}
              </div>
              <p className="text-[10px] text-gray-600 uppercase font-black">Time remaining</p>
           </div>
        </div>

        {/* THE QUESTION TERMINAL */}
        <AnimatePresence mode="wait">
           <motion.div 
             key={currentQuestionIndex}
             initial={{ x: 50, opacity: 0 }}
             animate={{ x: 0, opacity: 1 }}
             exit={{ x: -50, opacity: 0 }}
             className="relative p-12 rounded-[4rem] bg-white/[0.03] border border-white/5 backdrop-blur-3xl shadow-3xl mb-12"
           >
              {/* Question Index Badge */}
              <div className="absolute -top-6 left-12 px-8 py-3 rounded-full bg-blue-600 text-[11px] font-black uppercase tracking-widest shadow-xl">
                 Question #{currentQuestionIndex + 1}
              </div>

              <div className="mb-12">
                <h3 className="text-2xl md:text-3xl font-black leading-tight text-gray-100">
                   {currentQuestion?.question}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {currentQuestion?.shuffledOptions?.map((option) => (
                   <button
                     key={option.key}
                     onClick={() => handleAnswerChange(currentQuestion?._id, option.key)}
                     className={`group p-6 rounded-[2rem] border-2 text-left transition-all duration-300 relative overflow-hidden flex items-center gap-6 ${
                       selectedAnswers?.[currentQuestion?._id] === option.key 
                       ? 'bg-blue-600 border-blue-400 text-white shadow-[0_20px_40px_rgba(37,99,235,0.3)]' 
                       : 'bg-black/40 border-white/5 hover:border-white/20 text-gray-400'
                     }`}
                   >
                     {/* Choice ID Circle */}
                     <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 transition-colors ${
                        selectedAnswers?.[currentQuestion?._id] === option.key ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                     }`}>
                        {option.id}
                     </div>
                     <span className="text-sm font-bold">{option.label}</span>

                     {/* Highlight effect */}
                     {selectedAnswers?.[currentQuestion?._id] === option.key && (
                       <motion.div layoutId="choice-glow" className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-transparent pointer-events-none" />
                     )}
                   </button>
                 ))}
              </div>
           </motion.div>
        </AnimatePresence>

        {/* ACTIONS */}
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <FiInfo className="text-blue-500" />
              <p className="text-[10px] text-gray-500 leading-tight">
                 SELECT THE CORRECT ANSWER TO COMPLETE THIS SECTION.<br/>
                 NO PENALTY FOR INCORRECT ANSWERS.
              </p>
           </div>
           <button
             onClick={goToNextQuestion}
             className="group px-10 py-5 rounded-[2rem] bg-white text-black text-sm font-black uppercase tracking-widest flex items-center gap-4 hover:bg-blue-500 hover:text-white transition-all duration-500"
           >
             {currentQuestionIndex === shuffledQuestions?.length - 1 ? "Review Answers" : "Next Question"}
             <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
};

export default ExamDetails;
