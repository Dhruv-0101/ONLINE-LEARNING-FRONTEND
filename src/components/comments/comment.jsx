import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCommentsAPI,
  postCommentAPI,
  replyToCommentAPI,
} from "../../reactQuery/courseSections/courseSectionsAPI";
import { format } from "date-fns"; // Import date-fns for formatting
import { FaRegClock } from "react-icons/fa"; // Import watch icon

const CommentsPage = () => {
  const { videoId } = useParams();
  const queryClient = useQueryClient();

  // Error state
  const [errorMessage, setErrorMessage] = useState("");

  // State for managing visibility of new comment input
  const [showNewComment, setShowNewComment] = useState(false);

  // State for managing reply inputs and visibility
  const [replies, setReplies] = useState({});
  const [showReplyInput, setShowReplyInput] = useState({}); // Object to manage visibility for each comment
  const [visibleReplies, setVisibleReplies] = useState({}); // Object to manage visible replies for each comment

  // Fetch comments for the video
  const {
    data: comments,
    isLoading,
    isError: isQueryError,
    error: queryError,
  } = useQuery({
    queryKey: ["comments", videoId],
    queryFn: () => getCommentsAPI(videoId),
  });

  const [newComment, setNewComment] = useState("");

  const { mutate: postComment } = useMutation({
    mutationFn: (comment) => postCommentAPI(videoId, comment),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      setNewComment("");
      setShowNewComment(false); // Hide the new comment input on success
      setErrorMessage(""); // Clear error message on success
    },
    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while posting the comment."
      );
    },
  });

  const { mutate: postReply } = useMutation({
    mutationFn: ({ commentId, text }) => replyToCommentAPI(commentId, text),
    onSuccess: () => {
      queryClient.invalidateQueries(["comments", videoId]);
      // Clear all reply inputs after success
      setReplies({});
      setShowReplyInput({});
      setVisibleReplies({});
      setErrorMessage(""); // Clear error message on success
    },
    onError: (error) => {
      setErrorMessage(
        error.response?.data?.message ||
          "An error occurred while posting the reply."
      );
    },
  });

  const handlePostComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      postComment(newComment);
    }
  };

  const handleReplyChange = (commentId, text) => {
    setReplies((prevReplies) => ({
      ...prevReplies,
      [commentId]: text,
    }));
  };

  const handleReplySubmit = (commentId, e) => {
    e.preventDefault();
    const text = replies[commentId];
    if (text.trim()) {
      postReply({ commentId, text }); // Pass commentId and text as replyData
    }
  };

  const toggleReplyInput = (commentId) => {
    setShowReplyInput((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleNewCommentInput = () => {
    setShowNewComment((prev) => !prev);
  };

  // Load more replies function
  const loadMoreReplies = (commentId) => {
    setVisibleReplies((prevVisible) => ({
      ...prevVisible,
      [commentId]: (prevVisible[commentId] || 3) + 3,
    }));
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Comments</h1>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 text-red-800 p-4 mb-6 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* New Comment Button */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <button
          onClick={toggleNewCommentInput}
          className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
        >
          {showNewComment ? "Cancel" : "Post a Comment"}
        </button>

        {showNewComment && (
          <form onSubmit={handlePostComment} className="mt-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg mb-4"
              placeholder="Write your comment here..."
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Post Comment
            </button>
          </form>
        )}
      </div>

      {/* Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <p>Loading comments...</p>
        ) : isQueryError ? (
          <p>Error loading comments.</p>
        ) : (
          comments?.map((comment) => (
            <div
              key={comment._id}
              className="bg-white p-4 border border-gray-300 rounded-lg"
            >
              <div className="flex flex-col">
                {/* Comment Creator and Reply Button */}
                <div className="flex justify-between items-center mb-2">
                  <div className="flex-grow">
                    <p className="text-gray-800">{comment.commentText}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FaRegClock className="text-gray-500" />
                    <p className="text-gray-600 text-sm">
                      commented By {comment.user.username} on{" "}
                      {format(new Date(comment.createdAt), "PPPpp")}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => toggleReplyInput(comment._id)}
                    className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded transition duration-200"
                  >
                    {showReplyInput[comment._id] ? "Cancel Reply" : "Reply"}
                  </button>
                </div>

                {/* Reply Input Form */}
                {showReplyInput[comment._id] && (
                  <form
                    onSubmit={(e) => handleReplySubmit(comment._id, e)}
                    className="mt-4"
                  >
                    <textarea
                      value={replies[comment._id] || ""}
                      onChange={(e) =>
                        handleReplyChange(comment._id, e.target.value)
                      }
                      rows="2"
                      className="w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="Write a reply..."
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-800 text-white font-semibold py-1 px-4 rounded mt-2 transition duration-200"
                    >
                      Reply
                    </button>
                  </form>
                )}

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {comment.replies
                      .slice(0, visibleReplies[comment._id] || 3)
                      .map((reply) => (
                        <div
                          key={reply._id}
                          className="bg-gray-100 p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-gray-800 mb-1">
                              {reply.replyText}
                            </p>
                            <div className="flex items-center space-x-2">
                              <FaRegClock className="text-gray-500" />
                              <p className="text-gray-600 text-sm">
                                Replied By {reply.user.username} on{" "}
                                {format(new Date(reply.createdAt), "PPPpp")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}

                    {comment.replies.length >
                      (visibleReplies[comment._id] || 3) && (
                      <button
                        onClick={() => loadMoreReplies(comment._id)}
                        className="text-blue-600 hover:underline"
                      >
                        Load More Replies
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentsPage;
