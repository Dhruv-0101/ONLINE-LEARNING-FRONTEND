import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsAPI,
  postCommentAPI,
  replyToCommentAPI,
} from "../../reactQuery/courseSections/courseSectionsAPI";
import { format } from "date-fns";
import { 
  FiClock, FiMessageCircle, FiCornerDownRight, 
  FiSend, FiChevronLeft, FiUser, FiActivity, FiLayers
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const CommentsPage = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [errorMessage, setErrorMessage] = useState("");
  const [newComment, setNewComment] = useState("");
  const [replies, setReplies] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});

  const {
    data: comments,
    isLoading,
    isError: isQueryError,
  } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getCommentsAPI(videoId),
  });

  const { mutate: postComment, isPending: isPosting } = useMutation({
    mutationFn: (comment) => postCommentAPI(videoId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      setNewComment("");
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || "Submission failed.");
    },
  });

  const { mutate: postReply, isPending: isReplying } = useMutation({
    mutationFn: ({ commentId, text }) => replyToCommentAPI(commentId, text),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      setReplies({});
      setShowReplyInput({});
      setErrorMessage("");
    },
    onError: (error) => {
      setErrorMessage(error.response?.data?.message || "Reply failed.");
    },
  });

  const handlePostComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) postComment(newComment);
  };

  const handleReplySubmit = (commentId, e) => {
    e.preventDefault();
    const text = replies[commentId];
    if (text?.trim()) postReply({ commentId, text });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (isLoading) return (
    <div className="min-h-screen bg-[#0B0F1A] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white pt-24 pb-20 px-6">
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(37,99,235,0.05)_0%,_transparent_50%)] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-12">
           <button 
             onClick={() => navigate(-1)} 
             className="flex items-center gap-2 group text-gray-400 hover:text-white transition-all bg-white/5 px-4 py-2 rounded-xl border border-white/5 hover:border-white/10"
           >
             <FiChevronLeft className="group-hover:-translate-x-1 transition-transform" />
             <span className="text-[10px] font-black uppercase tracking-widest">Back to Lessons</span>
           </button>
           <h1 className="text-xl font-black tracking-tight flex items-center gap-3">
             <FiMessageCircle className="text-blue-500" /> Community Discussions
           </h1>
        </div>

        {/* Global Transmission Field (New Comment) */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-16 p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FiActivity size={18} />
             </div>
             <h3 className="text-sm font-black uppercase tracking-widest">Post a Comment</h3>
          </div>
          <form onSubmit={handlePostComment} className="relative">
             <textarea
               value={newComment}
               onChange={(e) => setNewComment(e.target.value)}
               placeholder="Share your thoughts or ask a question..."
               className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-6 text-sm text-gray-300 focus:border-blue-500/30 outline-none transition-all resize-none mb-4"
             />
             <div className="flex items-center justify-between">
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest px-2">Public Comment Section</p>
                <button
                  type="submit"
                  disabled={isPosting || !newComment.trim()}
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-600/20 disabled:opacity-30"
                >
                  {isPosting ? "Posting..." : <><span>Post Comment</span> <FiSend /></>}
                </button>
             </div>
          </form>
           {errorMessage && <p className="mt-4 text-xs font-bold text-red-500 uppercase tracking-widest flex items-center gap-2 px-2"><FiActivity /> {errorMessage}</p>}
        </motion.div>

        {/* Intelligence Feed */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {comments?.length === 0 ? (
            <div className="py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] opacity-20">
               <p className="text-[10px] uppercase tracking-[0.4rem] font-black">No comments found. Be the first to start the conversation!</p>
            </div>
          ) : (
            comments?.map((comment) => (
              <motion.div 
                key={comment._id} 
                variants={itemVariants}
                className="group relative"
              >
                {/* Connector Line for Replies */}
                {comment.replies?.length > 0 && <div className="absolute left-6 top-16 bottom-0 w-px bg-white/5 group-hover:bg-blue-500/20 transition-colors"></div>}

                <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 group-hover:bg-white/[0.04] transition-all relative z-10">
                   <div className="flex items-start gap-4">
                      {/* Operative Avatar */}
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/10 border border-white/10 flex items-center justify-center text-blue-400 font-black shrink-0 shadow-inner">
                         {comment.user?.username?.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1">
                         <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                            <div className="flex items-center gap-3">
                               <h4 className="font-black text-sm text-gray-200">{comment.user?.username}</h4>
                               <span className="text-[8px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 font-black uppercase tracking-widest">Student</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                               <FiClock size={12} />
                               {format(new Date(comment.createdAt), "PPP")}
                            </div>
                         </div>
                         
                         <p className="text-sm text-gray-400 leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">{comment.commentText}</p>

                         <div className="flex items-center gap-4">
                            <button
                              onClick={() => setShowReplyInput(prev => ({ ...prev, [comment._id]: !prev[comment._id] }))}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                showReplyInput[comment._id] ? 'bg-white/10 text-white' : 'bg-blue-500/5 text-blue-400 hover:bg-blue-500/10'
                              }`}
                            >
                              <FiCornerDownRight /> {showReplyInput[comment._id] ? "Cancel" : "Reply"}
                            </button>
                         </div>

                         {/* Inline Reply Input */}
                         <AnimatePresence>
                            {showReplyInput[comment._id] && (
                              <motion.form 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                onSubmit={(e) => handleReplySubmit(comment._id, e)}
                                className="mt-6 overflow-hidden"
                              >
                               <textarea
                                  value={replies[comment._id] || ""}
                                  onChange={(e) => setReplies(prev => ({ ...prev, [comment._id]: e.target.value }))}
                                  placeholder="Write your reply..."
                                  className="w-full h-24 bg-black/40 border border-white/5 rounded-2xl p-5 text-xs text-gray-300 focus:border-blue-500/30 outline-none transition-all resize-none mb-3"
                                />
                                <button
                                  type="submit"
                                  disabled={isReplying || !replies[comment._id]?.trim()}
                                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                                >
                                  {isReplying ? "Submitting..." : <><span>Post Reply</span> <FiSend /></>}
                                </button>
                              </motion.form>
                            )}
                         </AnimatePresence>
                      </div>
                   </div>
                </div>

                {/* Replies Thread */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-12 space-y-4">
                    {comment.replies
                      .slice(0, visibleReplies[comment._id] || 3)
                      .map((reply) => (
                        <motion.div 
                          key={reply._id} 
                          initial={{ x: 20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="p-5 rounded-[1.5rem] bg-white/[0.01] border border-white/5 flex items-start gap-4 group/reply"
                        >
                           <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 flex items-center justify-center text-[10px] text-gray-500 font-black shrink-0 italic">
                             {reply.user?.username?.charAt(0).toUpperCase()}
                           </div>
                           <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                 <h5 className="text-[11px] font-black text-gray-300">{reply.user?.username}</h5>
                                 <span className="text-[9px] text-gray-600 font-mono">{format(new Date(reply.createdAt), "HH:mm")}</span>
                              </div>
                              <p className="text-xs text-gray-500 group-hover/reply:text-gray-300 transition-colors leading-relaxed">{reply.replyText}</p>
                           </div>
                        </motion.div>
                      ))}

                    {comment.replies.length > (visibleReplies[comment._id] || 3) && (
                      <button
                        onClick={() => setVisibleReplies(prev => ({ ...prev, [comment._id]: (prev[comment._id] || 3) + 3 }))}
                        className="text-[10px] text-blue-500 hover:text-blue-400 font-black uppercase tracking-widest flex items-center gap-2 mt-4 ml-2"
                      >
                         <FiLayers size={14} /> Show More Replies
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CommentsPage;
