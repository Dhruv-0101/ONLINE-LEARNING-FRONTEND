// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getCommentsAPI,
//   postCommentAPI,
//   replyToCommentAPI,
// } from "../../reactQuery/courseSections/courseSectionsAPI";
// import { format } from "date-fns"; // Import date-fns for formatting
// import { FaRegClock } from "react-icons/fa"; // Import watch icon

// const CommentsPage = () => {
//   const { videoId } = useParams();
//   const queryClient = useQueryClient();

//   // Error state
//   const [errorMessage, setErrorMessage] = useState("");

//   // State for managing visibility of new comment input
//   const [showNewComment, setShowNewComment] = useState(false);

//   // State for managing reply inputs and visibility
//   const [replies, setReplies] = useState({});
//   const [showReplyInput, setShowReplyInput] = useState({}); // Object to manage visibility for each comment
//   const [visibleReplies, setVisibleReplies] = useState({}); // Object to manage visible replies for each comment

//   // Fetch comments for the video
//   const {
//     data: comments,
//     isLoading,
//     isError: isQueryError,
//     error: queryError,
//   } = useQuery({
//     queryKey: ["comments", videoId],
//     queryFn: () => getCommentsAPI(videoId),
//   });

//   const [newComment, setNewComment] = useState("");

//   const { mutate: postComment } = useMutation({
//     mutationFn: (comment) => postCommentAPI(videoId, comment),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["comments", videoId]);
//       setNewComment("");
//       setShowNewComment(false); // Hide the new comment input on success
//       setErrorMessage(""); // Clear error message on success
//     },
//     onError: (error) => {
//       setErrorMessage(
//         error.response?.data?.message ||
//           "An error occurred while posting the comment."
//       );
//     },
//   });

//   const { mutate: postReply } = useMutation({
//     mutationFn: ({ commentId, text }) => replyToCommentAPI(commentId, text),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["comments", videoId]);
//       // Clear all reply inputs after success
//       setReplies({});
//       setShowReplyInput({});
//       setVisibleReplies({});
//       setErrorMessage(""); // Clear error message on success
//     },
//     onError: (error) => {
//       setErrorMessage(
//         error.response?.data?.message ||
//           "An error occurred while posting the reply."
//       );
//     },
//   });

//   const handlePostComment = (e) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       postComment(newComment);
//     }
//   };

//   const handleReplyChange = (commentId, text) => {
//     setReplies((prevReplies) => ({
//       ...prevReplies,
//       [commentId]: text,
//     }));
//   };

//   const handleReplySubmit = (commentId, e) => {
//     e.preventDefault();
//     const text = replies[commentId];
//     if (text.trim()) {
//       postReply({ commentId, text }); // Pass commentId and text as replyData
//     }
//   };

//   const toggleReplyInput = (commentId) => {
//     setShowReplyInput((prev) => ({
//       ...prev,
//       [commentId]: !prev[commentId],
//     }));
//   };

//   const toggleNewCommentInput = () => {
//     setShowNewComment((prev) => !prev);
//   };

//   // Load more replies function
//   const loadMoreReplies = (commentId) => {
//     setVisibleReplies((prevVisible) => ({
//       ...prevVisible,
//       [commentId]: (prevVisible[commentId] || 3) + 3,
//     }));
//   };

//   return (
//     <div className="container mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
//       <h1 className="text-3xl font-bold text-gray-900 mb-6">Comments</h1>

//       {/* Error Message */}
//       {errorMessage && (
//         <div className="bg-red-100 text-red-800 p-4 mb-6 rounded-lg">
//           {errorMessage}
//         </div>
//       )}

//       {/* New Comment Button */}
//       <div className="bg-white p-6 rounded-lg shadow-md mb-8">
//         <button
//           onClick={toggleNewCommentInput}
//           className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
//         >
//           {showNewComment ? "Cancel" : "Post a Comment"}
//         </button>

//         {showNewComment && (
//           <form onSubmit={handlePostComment} className="mt-4">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               rows="4"
//               className="w-full p-3 border border-gray-300 rounded-lg mb-4"
//               placeholder="Write your comment here..."
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
//             >
//               Post Comment
//             </button>
//           </form>
//         )}
//       </div>

//       {/* Comments List */}
//       <div className="space-y-4">
//         {isLoading ? (
//           <p>Loading comments...</p>
//         ) : isQueryError ? (
//           <p>Error loading comments.</p>
//         ) : (
//           comments?.map((comment) => (
//             <div
//               key={comment._id}
//               className="bg-white p-4 border border-gray-300 rounded-lg"
//             >
//               <div className="flex flex-col">
//                 {/* Comment Creator and Reply Button */}
//                 <div className="flex justify-between items-center mb-2">
//                   <div className="flex-grow">
//                     <p className="text-gray-800">{comment.commentText}</p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <FaRegClock className="text-gray-500" />
//                     <p className="text-gray-600 text-sm">
//                       commented By {comment.user.username} on{" "}
//                       {format(new Date(comment.createdAt), "PPPpp")}
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex justify-between items-center">
//                   <button
//                     onClick={() => toggleReplyInput(comment._id)}
//                     className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded transition duration-200"
//                   >
//                     {showReplyInput[comment._id] ? "Cancel Reply" : "Reply"}
//                   </button>
//                 </div>

//                 {/* Reply Input Form */}
//                 {showReplyInput[comment._id] && (
//                   <form
//                     onSubmit={(e) => handleReplySubmit(comment._id, e)}
//                     className="mt-4"
//                   >
//                     <textarea
//                       value={replies[comment._id] || ""}
//                       onChange={(e) =>
//                         handleReplyChange(comment._id, e.target.value)
//                       }
//                       rows="2"
//                       className="w-full p-2 border border-gray-300 rounded-lg"
//                       placeholder="Write a reply..."
//                     />
//                     <button
//                       type="submit"
//                       className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded mt-2 transition duration-200"
//                     >
//                       Reply
//                     </button>
//                   </form>
//                 )}

//                 {/* Replies */}
//                 {comment.replies && comment.replies.length > 0 && (
//                   <div className="mt-4 space-y-2">
//                     {comment.replies
//                       .slice(0, visibleReplies[comment._id] || 3)
//                       .map((reply) => (
//                         <div
//                           key={reply._id}
//                           className="bg-gray-100 p-3 border border-gray-200 rounded-lg"
//                         >
//                           <div className="flex justify-between items-center mb-1">
//                             <p className="text-gray-800 mb-1">
//                               {reply.replyText}
//                             </p>
//                             <div className="flex items-center space-x-2">
//                               <FaRegClock className="text-gray-500" />
//                               <p className="text-gray-600 text-sm">
//                                 Replied By {reply.user.username} on{" "}
//                                 {format(new Date(reply.createdAt), "PPPpp")}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}

//                     {comment.replies.length >
//                       (visibleReplies[comment._id] || 3) && (
//                       <button
//                         onClick={() => loadMoreReplies(comment._id)}
//                         className="text-blue-600 hover:underline"
//                       >
//                         Load More Replies
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentsPage;

// import React, { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getCommentsAPI,
//   postCommentAPI,
//   replyToCommentAPI,
// } from "../../reactQuery/courseSections/courseSectionsAPI";
// import { format } from "date-fns";
// import { FaRegClock } from "react-icons/fa";

// const CommentsPage = () => {
//   const { videoId } = useParams();
//   const queryClient = useQueryClient();

//   const [errorMessage, setErrorMessage] = useState("");
//   const [showNewComment, setShowNewComment] = useState(false);
//   const [newComment, setNewComment] = useState("");
//   const [replies, setReplies] = useState({});
//   const [showReplyInput, setShowReplyInput] = useState({});
//   const [visibleReplies, setVisibleReplies] = useState({});

//   const {
//     data: comments,
//     isLoading,
//     isError: isQueryError,
//   } = useQuery({
//     queryKey: ["comments", videoId],
//     queryFn: () => getCommentsAPI(videoId),
//   });

//   const { mutate: postComment } = useMutation({
//     mutationFn: (comment) => postCommentAPI(videoId, comment),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["comments", videoId]);
//       setNewComment("");
//       setShowNewComment(false);
//       setErrorMessage("");
//     },
//     onError: (error) => {
//       setErrorMessage(error.response?.data?.message || "Error posting comment.");
//     },
//   });

//   const { mutate: postReply } = useMutation({
//     mutationFn: ({ commentId, text }) => replyToCommentAPI(commentId, text),
//     onSuccess: () => {
//       queryClient.invalidateQueries(["comments", videoId]);
//       setReplies({});
//       setShowReplyInput({});
//       setVisibleReplies({});
//       setErrorMessage("");
//     },
//     onError: (error) => {
//       setErrorMessage(error.response?.data?.message || "Error posting reply.");
//     },
//   });

//   const handlePostComment = (e) => {
//     e.preventDefault();
//     if (newComment.trim()) {
//       postComment(newComment);
//     }
//   };

//   const handleReplyChange = (commentId, text) => {
//     setReplies((prev) => ({ ...prev, [commentId]: text }));
//   };

//   const handleReplySubmit = (commentId, e) => {
//     e.preventDefault();
//     const text = replies[commentId];
//     if (text.trim()) {
//       postReply({ commentId, text });
//     }
//   };

//   const toggleReplyInput = (commentId) => {
//     setShowReplyInput((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
//   };

//   const loadMoreReplies = (commentId) => {
//     setVisibleReplies((prev) => ({
//       ...prev,
//       [commentId]: (prev[commentId] || 3) + 3,
//     }));
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white">
//       <h2 className="text-2xl font-semibold mb-4">Comments</h2>

//       {errorMessage && (
//         <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
//           {errorMessage}
//         </div>
//       )}

//       {/* Post a new comment */}
//       <div className="mb-6">
//         <button
//           onClick={() => setShowNewComment((prev) => !prev)}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//         >
//           {showNewComment ? "Cancel" : "Add a Comment"}
//         </button>
//         {showNewComment && (
//           <form onSubmit={handlePostComment} className="mt-4 space-y-3">
//             <textarea
//               value={newComment}
//               onChange={(e) => setNewComment(e.target.value)}
//               rows="3"
//               className="w-full border border-gray-300 p-3 rounded-md"
//               placeholder="Write a comment..."
//             />
//             <button
//               type="submit"
//               className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
//             >
//               Post
//             </button>
//           </form>
//         )}
//       </div>

//       {/* Comment List */}
//       <div className="space-y-6">
//         {isLoading ? (
//           <p>Loading comments...</p>
//         ) : isQueryError ? (
//           <p>Failed to load comments.</p>
//         ) : (
//           comments?.map((comment) => (
//             <div key={comment._id} className="flex gap-3">
//               <div className="flex-shrink-0">
//                 <img
//                   src={`https://ui-avatars.com/api/?name=${comment.user.username}`}
//                   alt="avatar"
//                   className="w-10 h-10 rounded-full"
//                 />
//               </div>
//               <div className="flex-1">
//                 <div className="bg-gray-100 rounded-md p-3">
//                   <div className="text-sm font-semibold">
//                     {comment.user.username}
//                   </div>
//                   <p className="text-gray-800 mt-1">{comment.commentText}</p>
//                   <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                     <FaRegClock />
//                     {format(new Date(comment.createdAt), "PPPpp")}
//                   </div>
//                 </div>

//                 <div className="mt-2">
//                   <button
//                     onClick={() => toggleReplyInput(comment._id)}
//                     className="text-sm text-blue-600 hover:underline"
//                   >
//                     {showReplyInput[comment._id] ? "Cancel" : "Reply"}
//                   </button>

//                   {showReplyInput[comment._id] && (
//                     <form
//                       onSubmit={(e) => handleReplySubmit(comment._id, e)}
//                       className="mt-2"
//                     >
//                       <textarea
//                         value={replies[comment._id] || ""}
//                         onChange={(e) =>
//                           handleReplyChange(comment._id, e.target.value)
//                         }
//                         rows="2"
//                         className="w-full border border-gray-300 p-2 rounded-md"
//                         placeholder="Write a reply..."
//                       />
//                       <button
//                         type="submit"
//                         className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded"
//                       >
//                         Reply
//                       </button>
//                     </form>
//                   )}
//                 </div>

//                 {/* Replies */}
//                 {comment.replies && comment.replies.length > 0 && (
//                   <div className="mt-4 pl-6 border-l border-gray-300 space-y-3">
//                     {comment.replies
//                       .slice(0, visibleReplies[comment._id] || 3)
//                       .map((reply) => (
//                         <div key={reply._id} className="flex gap-3">
//                           <img
//                             src={`https://ui-avatars.com/api/?name=${reply.user.username}`}
//                             alt="avatar"
//                             className="w-8 h-8 rounded-full"
//                           />
//                           <div className="flex-1 bg-gray-50 rounded-md p-2">
//                             <div className="text-sm font-semibold">
//                               {reply.user.username}
//                             </div>
//                             <p className="text-gray-800">{reply.replyText}</p>
//                             <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
//                               <FaRegClock />
//                               {format(new Date(reply.createdAt), "PPPpp")}
//                             </div>
//                           </div>
//                         </div>
//                       ))}

//                     {comment.replies.length >
//                       (visibleReplies[comment._id] || 3) && (
//                       <button
//                         onClick={() => loadMoreReplies(comment._id)}
//                         className="text-sm text-blue-600 hover:underline mt-1"
//                       >
//                         Load more replies
//                       </button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default CommentsPage;
import React, { useState } from "react";
import { format } from "date-fns";
import { FaRegClock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const CommentsPage = ({ comments, handleReplySubmit, handleReplyChange, replies }) => {
  const [showReplyInput, setShowReplyInput] = useState({});
  const [visibleReplies, setVisibleReplies] = useState({});

  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const loadMoreReplies = (commentId) => {
    setVisibleReplies((prev) => ({
      ...prev,
      [commentId]: (prev[commentId] || 3) + 3,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Comments</h2>
      <div className="space-y-6">
        {[...comments]
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .map((comment) => (
            <motion.div
              key={comment._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-white p-5 rounded-xl shadow hover:shadow-md transition"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-800">{comment.user.username}</p>
                    <p className="text-sm text-gray-700">{comment.commentText}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <FaRegClock />
                    {format(new Date(comment.createdAt), "PPp")}
                  </span>
                </div>

                <button
                  onClick={() => toggleReplyInput(comment._id)}
                  className="text-blue-600 text-sm hover:underline font-medium"
                >
                  {showReplyInput[comment._id] ? "Cancel" : "Reply"}
                </button>

                <AnimatePresence>
                  {showReplyInput[comment._id] && (
                    <motion.form
                      onSubmit={(e) => handleReplySubmit(comment._id, e)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="mt-3"
                    >
                      <textarea
                        value={replies[comment._id] || ""}
                        onChange={(e) => handleReplyChange(comment._id, e.target.value)}
                        rows="2"
                        placeholder="Write your reply..."
                        className="w-full p-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                      <button
                        type="submit"
                        className="mt-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                      >
                        Post Reply
                      </button>
                    </motion.form>
                  )}
                </AnimatePresence>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 ml-4 border-l-2 pl-4">
                    {[...comment.replies]
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .slice(0, visibleReplies[comment._id] || 3)
                      .map((reply) => (
                        <motion.div
                          key={reply._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          className="bg-gray-50 p-3 rounded-lg mb-3 shadow-sm"
                        >
                          <p className="font-medium text-sm text-gray-800">
                            {reply.user.username}
                          </p>
                          <p className="text-sm text-gray-700">{reply.replyText}</p>
                          <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                            <FaRegClock />
                            {format(new Date(reply.createdAt), "PPp")}
                          </span>
                        </motion.div>
                      ))}

                    {comment.replies.length > (visibleReplies[comment._id] || 3) && (
                      <button
                        onClick={() => loadMoreReplies(comment._id)}
                        className="text-blue-600 text-sm hover:underline"
                      >
                        Load more replies
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default CommentsPage;
