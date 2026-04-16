import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createExamAPI } from "../../reactQuery/courseSections/courseSectionsAPI";
import { 
  FiPlusCircle, FiTrash2, FiTarget, FiEdit, FiLayers, 
  FiChevronLeft, FiActivity, FiTerminal, FiShield,
  FiCheckCircle, FiCpu, FiAlertCircle
} from "react-icons/fi";
import AlertMessage from "../Alert/AlertMessage";
import { motion, AnimatePresence } from "framer-motion";

const CreateExam = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState(10);
  const [students, setStudents] = useState([]);
  const [questions, setQuestions] = useState([
    {
      question: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "",
      isCorrect: false,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleQuestionChange = (index, event) => {
    const { name, value } = event.target;
    const newQuestions = [...questions];
    newQuestions[index][name] = value;
    setQuestions(newQuestions);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
        isCorrect: false,
      },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const examData = {
      name,
      description,
      sectionId,
      score,
      students,
      questions,
    };

    try {
      await createExamAPI(examData);
      setSuccess("Quiz created successfully.");
      setTimeout(() => navigate(-1), 2000);
    } catch (error) {
      setError("Failed to create quiz. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-32 pb-24 px-6 relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(79,70,229,0.05)_0%,_transparent_100%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        <header className="mb-12">
           <button 
             onClick={() => navigate(-1)}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-gray-400 hover:text-white transition-all text-[10px] font-black uppercase tracking-widest mb-10 group"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Dashboard
           </button>
           
           <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-indigo-600 shadow-[0_0_30px_#4f46e5] flex items-center justify-center shrink-0">
                 <FiTarget size={32} />
              </div>
              <div>
                 <h1 className="text-4xl font-black tracking-tighter">Create New Quiz</h1>
                 <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] font-black flex items-center gap-3">
                    <FiTerminal className="text-indigo-500" /> Quiz Configuration Manager
                 </p>
              </div>
           </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-10">
          <AnimatePresence>
            {loading && <AlertMessage type="loading" message="Creating Quiz..." />}
            {error && <AlertMessage type="error" message={error} />}
            {success && <AlertMessage type="success" message={success} />}
          </AnimatePresence>

          {/* Core Configuration Card */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 backdrop-blur-3xl shadow-3xl overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
             
             <div className="space-y-8 relative z-10">
                <div className="group">
                   <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2 group-focus-within:text-indigo-400 transition-colors">
                      <FiEdit /> Quiz Title
                   </label>
                   <input
                     type="text"
                     placeholder="Enter quiz title..."
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-xl font-black tracking-tighter"
                     required
                   />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="md:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-3 block flex items-center gap-2">
                         <FiActivity /> Quiz Description
                      </label>
                      <textarea
                        placeholder="Provide a brief description of this quiz..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 outline-none focus:border-indigo-500/50 transition-all h-24 italic text-sm"
                        required
                      ></textarea>
                   </div>
                   <div>
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400 mb-3 block flex items-center gap-2">
                         <FiShield /> Total Marks
                      </label>
                      <input
                        type="number"
                        placeholder="100"
                        value={score}
                        onChange={(e) => setScore(Number(e.target.value))}
                        className="w-full bg-black/40 border border-indigo-500/20 rounded-2xl p-5 text-white outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-2xl font-black tracking-tighter"
                        required
                      />
                   </div>
                </div>
             </div>
          </motion.div>

          {/* Assessment Capsules (Questions) */}
          <div className="space-y-6">
             <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-600 flex items-center gap-6 mb-8 px-4">
                <FiLayers /> Quiz Questions ({questions.length})
                <div className="h-px flex-1 bg-gradient-to-r from-white/5 to-transparent"></div>
             </h3>

             {questions.map((question, index) => (
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  key={index}
                  className="p-10 rounded-[2.5rem] bg-[#161B28] border border-white/5 hover:border-indigo-500/30 transition-all duration-500 relative group shadow-2xl"
                >
                   <div className="flex justify-between items-center mb-10">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white shadow-[0_0_20px_#4f46e5]">
                            <FiTarget />
                         </div>
                         <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Question {index + 1}</h4>
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(index)}
                          className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      )}
                   </div>

                   <div className="space-y-8">
                      {/* Question Text */}
                      <div>
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-3 block">Question Text</label>
                         <input
                           type="text"
                           placeholder="Enter the question here..."
                           name="question"
                           value={question.question}
                           onChange={(e) => handleQuestionChange(index, e)}
                           className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-gray-200 outline-none focus:border-indigo-500/50 transition-all font-bold tracking-tight"
                           required
                         />
                      </div>

                      {/* Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {['optionA', 'optionB', 'optionC', 'optionD'].map((optKey, i) => (
                            <div key={optKey} className="group/opt relative">
                               <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-gray-500 group-focus-within/opt:bg-indigo-500 group-focus-within/opt:text-white transition-all uppercase">
                                  {String.fromCharCode(65 + i)}
                               </div>
                               <input
                                 type="text"
                                 name={optKey}
                                 placeholder={`Option ${String.fromCharCode(65 + i)}...`}
                                 value={question[optKey]}
                                 onChange={(e) => handleQuestionChange(index, e)}
                                 className="w-full bg-black/40 border border-white/10 rounded-xl p-4 pl-16 text-sm text-gray-300 outline-none focus:border-indigo-500/50 transition-all font-medium"
                                 required
                               />
                            </div>
                         ))}
                      </div>

                      {/* Correct Answer Selector */}
                      <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row items-center gap-6">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 shrink-0 flex items-center gap-2">
                            <FiCheckCircle className="text-indigo-500" /> Correct Answer:
                         </label>
                         <select
                           name="correctAnswer"
                           value={question.correctAnswer}
                           onChange={(e) => handleQuestionChange(index, e)}
                           className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs text-indigo-400 outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer font-black uppercase tracking-widest"
                           required
                         >
                           <option value="" disabled className="bg-black">Select Correct Option</option>
                           <option value="optionA" className="bg-black">Option A</option>
                           <option value="optionB" className="bg-black">Option B</option>
                           <option value="optionC" className="bg-black">Option C</option>
                           <option value="optionD" className="bg-black">Option D</option>
                         </select>
                      </div>
                   </div>
                </motion.div>
             ))}

             {/* Add Question Button */}
             <button
                type="button"
                onClick={handleAddQuestion}
                className="w-full py-8 rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-indigo-500/30 text-gray-600 hover:text-indigo-400 hover:bg-indigo-500/5 transition-all flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] group"
             >
                <FiPlusCircle className="group-hover:rotate-90 transition-transform duration-500" /> Add New Question
             </button>
          </div>

          {/* Submit Action */}
          <div className="pt-10 flex flex-col items-center border-t border-white/5">
             <button
               type="submit"
               disabled={loading}
               className="group w-full max-w-lg py-6 rounded-[2.5rem] bg-indigo-600 hover:bg-white hover:text-black text-white text-sm font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4 transition-all shadow-[0_20px_60px_rgba(79,70,229,0.3)] hover:-translate-y-2 active:scale-95 disabled:opacity-50 disabled:translate-y-0"
             >
               {loading ? (
                 <><span>Creating Quiz...</span> <FiCpu className="animate-spin-slow" /></>
               ) : (
                 <><span>Create Quiz</span> <FiCheckCircle /></>
               )}
             </button>
             <div className="mt-8 flex items-center gap-4 px-6 py-2 rounded-full border border-white/5 bg-white/[0.02] text-[8px] font-mono tracking-widest text-gray-700 uppercase">
                <FiAlertCircle className="text-indigo-500" /> Ensure all questions have a correct answer selected.
             </div>
          </div>
        </form>
      </div>

      {/* Decorative HUD Elements */}
      <div className="fixed top-32 right-12 opacity-5 pointer-events-none hidden xl:block">
         <div className="flex flex-col items-end gap-2">
            <div className="w-1 h-32 bg-white rounded-full"></div>
            <p className="text-[10px] font-black uppercase tracking-widest [writing-mode:vertical-lr]">CHALLENGE_ARCHITECT</p>
         </div>
      </div>
      <div className="fixed bottom-12 left-12 opacity-5 pointer-events-none hidden xl:block">
         <div className="flex flex-col gap-2">
            <FiShield size={24} />
            <div className="h-32 w-px bg-white"></div>
         </div>
      </div>
    </div>
  );
};

export default CreateExam;
