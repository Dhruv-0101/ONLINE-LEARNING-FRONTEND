import React, { useState } from "react";
import Slider from "react-slider";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import AlertMessage from "../Alert/AlertMessage";
import { useParams } from "react-router-dom";
import { submitReview } from "../../reactQuery/courses/coursesAPI";


const ReviewForm = () => {
  const { courseId } = useParams(); // Retrieve courseId from URL params
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");

  const { mutate: submit } = useMutation({
    mutationFn: () => submitReview(courseId, { rating, reviewText }),
    onSuccess: () => {
      setReviewText("");
      setRating(0);
    },
    onError: (error) => {
      setSubmissionError(error?.response?.data?.message || error?.message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    submit();
    setIsSubmitting(false);
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <>
        {[...Array(fullStars)].map((_, i) => (
          <FaStar key={`full-${i}`} className="text-yellow-400 text-2xl" />
        ))}
        {halfStar && <FaStarHalfAlt className="text-yellow-400 text-2xl" />}
        {[...Array(emptyStars)].map((_, i) => (
          <FaStar key={`empty-${i}`} className="text-gray-300 text-2xl" />
        ))}
      </>
    );
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Leave a Review
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating Slider */}
            <div className="flex flex-col items-center">
              <span className="text-xl font-semibold mb-2">
                Rating: {rating.toFixed(1)}
              </span>
              <Slider
                className="slider-container"
                value={rating}
                onChange={setRating}
                min={0}
                max={5}
                step={0.1}
                trackClassName="slider-track"
                thumbClassName="slider-thumb"
                ariaLabel="Rating slider"
                ariaValuetext="Rating slider"
                styles={{
                  track: {
                    background: "#ddd",
                    height: "8px",
                    borderRadius: "4px",
                  },
                  thumb: {
                    background: "#007bff",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                  },
                }}
              />
              <div className="flex mt-2">{renderStars(rating)}</div>
            </div>

            {/* Review Text */}
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows="4"
              placeholder="Write your review here..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 px-4 text-white font-semibold rounded-lg ${
                isSubmitting ? "bg-blue-400" : "bg-blue-500"
              } hover:bg-blue-600 transition duration-300`}
            >
              {isSubmitting ? "Submitting..." : "Submit Review"}
            </button>

            {/* Error Message */}
            {submissionError && (
              <AlertMessage type="error" message={submissionError} />
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;
