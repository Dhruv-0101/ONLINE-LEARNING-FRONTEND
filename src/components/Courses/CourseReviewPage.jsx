import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCourseReviewsAPI } from "../../reactQuery/courses/coursesAPI";
import AlertMessage from "../Alert/AlertMessage";
import {
  FaStar,
  FaStarHalfAlt,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";

const REVIEWS_PER_PAGE = 5;

const CourseReviewPage = () => {
  const { courseId } = useParams();
  const [currentPage, setCurrentPage] = useState(0);

  const {
    data: courseWithReviews,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["course-reviews", courseId],
    queryFn: () => getCourseReviewsAPI(courseId),
  });

  const renderStars = (rating) => {
    const safeRating = typeof rating === "number" && rating >= 0 ? rating : 0;
    const fullStars = Math.floor(safeRating);
    const halfStar = safeRating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(safeRating);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-500" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-500" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300" />
        ))}
      </>
    );
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString("en-US", options);
  };

  if (isLoading)
    return <AlertMessage type="loading" message="Loading reviews..." />;
  if (isError)
    return (
      <AlertMessage
        type="error"
        message={error?.response?.data?.message || error?.message}
      />
    );

  const reviews = courseWithReviews || [];
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const startIndex = currentPage * REVIEWS_PER_PAGE;
  const currentReviews = reviews.slice(
    startIndex,
    startIndex + REVIEWS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Course Reviews
      </h2>

      {reviews.length === 0 ? (
        <p className="text-gray-600 text-center">No reviews yet.</p>
      ) : (
        <div className="flex flex-col items-center">
          <div className="space-y-6 w-full max-w-3xl">
            {currentReviews.map((review) => (
              <div
                key={review._id}
                className="border border-gray-300 rounded-lg p-5 bg-white shadow-md"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg uppercase">
                      {review?.user?.username?.charAt(0) || "U"}
                    </div>
                    {/* Username and email */}
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {review?.user?.username || "Anonymous"}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {review?.user?.email}
                      </p>
                    </div>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                  </div>
                </div>

                {/* Message */}
                <p className="text-gray-700 mb-2">{review.message}</p>

                {/* Date */}
                <p className="text-sm text-gray-400">
                  Reviewed on: {formatDate(review.createdAt)}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                disabled={currentPage === 0}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <FaArrowLeft />
              </button>
              <span className="text-gray-600">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                }
                disabled={currentPage === totalPages - 1}
                className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
              >
                <FaArrowRight />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseReviewPage;
