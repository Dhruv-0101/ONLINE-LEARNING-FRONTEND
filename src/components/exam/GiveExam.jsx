import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
import { useQuery } from "@tanstack/react-query";
import {
  getExamDetailsAPI,
  submitExamAPI,
} from "../../reactQuery/courseSections/courseSectionsAPI"; // Import the API functions

const ExamDetails = () => {
  const { sectionId } = useParams();
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // State to handle loading after submission

  // Query to fetch exam details
  const {
    data: exam,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["exam", sectionId],
    queryFn: () => getExamDetailsAPI(sectionId),
  });

  const handleAnswerChange = (questionId, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }));
  };

  const handleSubmit = async () => {
    if (!exam) return;

    const answers = Object.keys(selectedAnswers).map((questionId) => ({
      questionId,
      selectedOption: selectedAnswers[questionId],
    }));

    try {
      setIsSubmitting(true); // Set loading state
      const result = await submitExamAPI(sectionId, answers);
      setSubmissionStatus({ success: true, message: result.message });

      // Wait for 2 seconds, then redirect to exam results page
      setTimeout(() => {
        navigate(`/exam-results/${sectionId}`); // Redirect to exam results page
      }, 2000);
    } catch (error) {
      setSubmissionStatus({ success: false, message: error.message });
      setIsSubmitting(false); // Stop loading if there's an error
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!exam) return <div>No exam details available</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
        <p className="text-gray-700 mb-4">{exam.description}</p>
        <p className="text-gray-600 mb-6">Total Score: {exam.score}</p>

        <h2 className="text-2xl font-semibold mb-4">Questions</h2>
        {exam?.questions?.length === 0 ? (
          <p>No questions available for this exam.</p>
        ) : (
          <ul className="space-y-4">
            {exam?.questions?.map((question, index) => (
              <li key={index} className="border p-4 rounded-md">
                <h3 className="text-lg font-semibold mb-2">
                  Question {index + 1}
                </h3>
                <p className="text-gray-800 mb-2">{question.question}</p>
                <ul className="list-disc ml-5">
                  <li>
                    <input
                      type="radio"
                      id={`question${question._id}-A`}
                      name={`question${question._id}`}
                      value="A"
                      checked={selectedAnswers[question._id] === "optionA"}
                      onChange={() =>
                        handleAnswerChange(question._id, "optionA")
                      }
                    />
                    <label htmlFor={`question${question._id}-A`}>
                      <strong>A:</strong> {question.optionA}
                    </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id={`question${question._id}-B`}
                      name={`question${question._id}`}
                      value="B"
                      checked={selectedAnswers[question._id] === "optionB"}
                      onChange={() =>
                        handleAnswerChange(question._id, "optionB")
                      }
                    />
                    <label htmlFor={`question${question._id}-B`}>
                      <strong>B:</strong> {question.optionB}
                    </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id={`question${question._id}-C`}
                      name={`question${question._id}`}
                      value="C"
                      checked={selectedAnswers[question._id] === "optionC"}
                      onChange={() =>
                        handleAnswerChange(question._id, "optionC")
                      }
                    />
                    <label htmlFor={`question${question._id}-C`}>
                      <strong>C:</strong> {question.optionC}
                    </label>
                  </li>
                  <li>
                    <input
                      type="radio"
                      id={`question${question._id}-D`}
                      name={`question${question._id}`}
                      value="D"
                      checked={selectedAnswers[question._id] === "optionD"}
                      onChange={() =>
                        handleAnswerChange(question._id, "optionD")
                      }
                    />
                    <label htmlFor={`question${question._id}-D`}>
                      <strong>D:</strong> {question.optionD}
                    </label>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
          disabled={isSubmitting} // Disable button while submitting
        >
          {isSubmitting ? "Submitting..." : "Submit Exam"}{" "}
          {/* Show loading text */}
        </button>
        {submissionStatus && (
          <div
            className={`mt-4 p-4 rounded ${
              submissionStatus.success
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {submissionStatus.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamDetails;
