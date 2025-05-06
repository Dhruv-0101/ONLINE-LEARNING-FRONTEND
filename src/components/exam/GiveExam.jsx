// import React, { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate for redirection
// import { useQuery } from "@tanstack/react-query";
// import {
//   getExamDetailsAPI,
//   submitExamAPI,
// } from "../../reactQuery/courseSections/courseSectionsAPI"; // Import the API functions

// const ExamDetails = () => {
//   const { sectionId } = useParams();
//   const navigate = useNavigate(); // Initialize navigate for redirection
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false); // State to handle loading after submission

//   // Query to fetch exam details
//   const {
//     data: exam,
//     error,
//     isLoading,
//   } = useQuery({
//     queryKey: ["exam", sectionId],
//     queryFn: () => getExamDetailsAPI(sectionId),
//   });

//   const handleAnswerChange = (questionId, option) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: option,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!exam) return;

//     const answers = Object.keys(selectedAnswers).map((questionId) => ({
//       questionId,
//       selectedOption: selectedAnswers[questionId],
//     }));

//     try {
//       setIsSubmitting(true); // Set loading state
//       const result = await submitExamAPI(sectionId, answers);
//       setSubmissionStatus({ success: true, message: result.message });

//       // Wait for 2 seconds, then redirect to exam results page
//       setTimeout(() => {
//         navigate(`/exam-results/${sectionId}`); // Redirect to exam results page
//       }, 2000);
//     } catch (error) {
//       setSubmissionStatus({ success: false, message: error.message });
//       setIsSubmitting(false); // Stop loading if there's an error
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;
//   if (!exam) return <div>No exam details available</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
//         <p className="text-gray-700 mb-4">{exam.description}</p>
//         <p className="text-gray-600 mb-6">Total Score: {exam.score}</p>

//         <h2 className="text-2xl font-semibold mb-4">Questions</h2>
//         {exam?.questions?.length === 0 ? (
//           <p>No questions available for this exam.</p>
//         ) : (
//           <ul className="space-y-4">
//             {exam?.questions?.map((question, index) => (
//               <li key={index} className="border p-4 rounded-md">
//                 <h3 className="text-lg font-semibold mb-2">
//                   Question {index + 1}
//                 </h3>
//                 <p className="text-gray-800 mb-2">{question.question}</p>
//                 <ul className="list-disc ml-5">
//                   <li>
//                     <input
//                       type="radio"
//                       id={`question${question._id}-A`}
//                       name={`question${question._id}`}
//                       value="A"
//                       checked={selectedAnswers[question._id] === "optionA"}
//                       onChange={() =>
//                         handleAnswerChange(question._id, "optionA")
//                       }
//                     />
//                     <label htmlFor={`question${question._id}-A`}>
//                       <strong>A:</strong> {question.optionA}
//                     </label>
//                   </li>
//                   <li>
//                     <input
//                       type="radio"
//                       id={`question${question._id}-B`}
//                       name={`question${question._id}`}
//                       value="B"
//                       checked={selectedAnswers[question._id] === "optionB"}
//                       onChange={() =>
//                         handleAnswerChange(question._id, "optionB")
//                       }
//                     />
//                     <label htmlFor={`question${question._id}-B`}>
//                       <strong>B:</strong> {question.optionB}
//                     </label>
//                   </li>
//                   <li>
//                     <input
//                       type="radio"
//                       id={`question${question._id}-C`}
//                       name={`question${question._id}`}
//                       value="C"
//                       checked={selectedAnswers[question._id] === "optionC"}
//                       onChange={() =>
//                         handleAnswerChange(question._id, "optionC")
//                       }
//                     />
//                     <label htmlFor={`question${question._id}-C`}>
//                       <strong>C:</strong> {question.optionC}
//                     </label>
//                   </li>
//                   <li>
//                     <input
//                       type="radio"
//                       id={`question${question._id}-D`}
//                       name={`question${question._id}`}
//                       value="D"
//                       checked={selectedAnswers[question._id] === "optionD"}
//                       onChange={() =>
//                         handleAnswerChange(question._id, "optionD")
//                       }
//                     />
//                     <label htmlFor={`question${question._id}-D`}>
//                       <strong>D:</strong> {question.optionD}
//                     </label>
//                   </li>
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         )}
//         <button
//           onClick={handleSubmit}
//           className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
//           disabled={isSubmitting} // Disable button while submitting
//         >
//           {isSubmitting ? "Submitting..." : "Submit Exam"}{" "}
//           {/* Show loading text */}
//         </button>
//         {submissionStatus && (
//           <div
//             className={`mt-4 p-4 rounded ${
//               submissionStatus.success
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {submissionStatus.message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExamDetails;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";
// import {
//   getExamDetailsAPI,
//   submitExamAPI,
// } from "../../reactQuery/courseSections/courseSectionsAPI";

// const ExamDetails = () => {
//   const { sectionId } = useParams();
//   const navigate = useNavigate();
//   const [selectedAnswers, setSelectedAnswers] = useState({});
//   const [submissionStatus, setSubmissionStatus] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [shuffledQuestions, setShuffledQuestions] = useState([]);

//   const {
//     data: exam,
//     error,
//     isLoading,
//   } = useQuery({
//     queryKey: ["exam", sectionId],
//     queryFn: () => getExamDetailsAPI(sectionId),
//   });

//   const shuffleArray = (array) => {
//     return array
//       .map((value) => ({ value, sort: Math.random() }))
//       .sort((a, b) => a.sort - b.sort)
//       .map(({ value }) => value);
//   };

//   useEffect(() => {
//     if (exam?.questions) {
//       const shuffled = exam.questions.map((q) => {
//         const options = [
//           { key: "optionA", label: q.optionA },
//           { key: "optionB", label: q.optionB },
//           { key: "optionC", label: q.optionC },
//           { key: "optionD", label: q.optionD },
//         ];
//         return {
//           ...q,
//           shuffledOptions: shuffleArray(options),
//         };
//       });
//       setShuffledQuestions(shuffled);
//     }
//   }, [exam]);

//   const handleAnswerChange = (questionId, optionKey) => {
//     setSelectedAnswers((prev) => ({
//       ...prev,
//       [questionId]: optionKey,
//     }));
//   };

//   const handleSubmit = async () => {
//     if (!exam) return;

//     const answers = Object.keys(selectedAnswers).map((questionId) => ({
//       questionId,
//       selectedOption: selectedAnswers[questionId],
//     }));

//     try {
//       setIsSubmitting(true);
//       const result = await submitExamAPI(sectionId, answers);
//       setSubmissionStatus({ success: true, message: result.message });

//       setTimeout(() => {
//         navigate(`/exam-results/${sectionId}`);
//       }, 2000);
//     } catch (error) {
//       setSubmissionStatus({ success: false, message: error.message });
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;
//   if (!exam) return <div>No exam details available</div>;

//   return (
//     <div className="container mx-auto p-4">
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
//         <p className="text-gray-700 mb-4">{exam.description}</p>
//         <p className="text-gray-600 mb-6">Total Score: {exam.score}</p>

//         <h2 className="text-2xl font-semibold mb-4">Questions</h2>
//         {shuffledQuestions.length === 0 ? (
//           <p>No questions available for this exam.</p>
//         ) : (
//           <ul className="space-y-4">
//             {shuffledQuestions.map((question, index) => (
//               <li key={index} className="border p-4 rounded-md">
//                 <h3 className="text-lg font-semibold mb-2">
//                   Question {index + 1}
//                 </h3>
//                 <p className="text-gray-800 mb-2">{question.question}</p>
//                 <ul className="list-disc ml-5">
//                   {question.shuffledOptions.map((option) => (
//                     <li key={option.key}>
//                       <input
//                         type="radio"
//                         id={`question${question._id}-${option.key}`}
//                         name={`question${question._id}`}
//                         value={option.key}
//                         checked={selectedAnswers[question._id] === option.key}
//                         onChange={() =>
//                           handleAnswerChange(question._id, option.key)
//                         }
//                       />
//                       <label htmlFor={`question${question._id}-${option.key}`}>
//                         <strong>{option.key.slice(-1)}:</strong> {option.label}
//                       </label>
//                     </li>
//                   ))}
//                 </ul>
//               </li>
//             ))}
//           </ul>
//         )}
//         <button
//           onClick={handleSubmit}
//           className="mt-6 bg-blue-500 text-white py-2 px-4 rounded"
//           disabled={isSubmitting}
//         >
//           {isSubmitting ? "Submitting..." : "Submit Exam"}
//         </button>
//         {submissionStatus && (
//           <div
//             className={`mt-4 p-4 rounded ${
//               submissionStatus.success
//                 ? "bg-green-100 text-green-800"
//                 : "bg-red-100 text-red-800"
//             }`}
//           >
//             {submissionStatus.message}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExamDetails;

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  getExamDetailsAPI,
  submitExamAPI,
} from "../../reactQuery/courseSections/courseSectionsAPI";

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
  const [finalSubmitTimeLeft, setFinalSubmitTimeLeft] = useState(180); // 3 minutes for final submit

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
          { key: "optionA", label: q.optionA },
          { key: "optionB", label: q.optionB },
          { key: "optionC", label: q.optionC },
          { key: "optionD", label: q.optionD },
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
      const timer = setInterval(() => {
        setFinalSubmitTimeLeft((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            handleSubmit(); // Automatically submit after 3 minutes
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
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

      setTimeout(() => {
        navigate(`/exam-results/${sectionId}`);
      }, 2000);
    } catch (error) {
      setSubmissionStatus({ success: false, message: error.message });
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!exam) return <div>No exam found</div>;

  if (showReview) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Review Your Answers</h1>
          {shuffledQuestions.map((question, index) => (
            <div
              key={question._id}
              className="mb-4 border p-4 rounded bg-gray-50"
            >
              <h3 className="font-semibold mb-2">
                {index + 1}. {question.question}
              </h3>
              <ul className="ml-5">
                {question.shuffledOptions.map((option) => (
                  <li key={option.key}>
                    <input
                      type="radio"
                      id={`${question._id}-${option.key}`}
                      name={`question-${question._id}`}
                      value={option.key}
                      checked={selectedAnswers[question._id] === option.key}
                      onChange={() =>
                        handleAnswerChange(question._id, option.key)
                      }
                    />
                    <label
                      htmlFor={`${question._id}-${option.key}`}
                      className="ml-1"
                    >
                      <strong>{option.key.slice(-1)}:</strong> {option.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="mt-4 text-red-600">
            Time Left to Submit: {finalSubmitTimeLeft}s
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            {isSubmitting ? "Submitting..." : "Submit Final Answers"}
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
  }

  const currentQuestion = shuffledQuestions[currentQuestionIndex];

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
        <p className="mb-2 text-gray-700">{exam.description}</p>
        <p className="mb-6 text-gray-600">Total Score: {exam.score}</p>

        <div className="text-xl font-bold text-red-600 mb-4">
          Time Left: {timeLeft}s
        </div>

        <div className="border p-4 rounded-md mb-4">
          <h3 className="text-lg font-semibold mb-2">
            Question {currentQuestionIndex + 1}
          </h3>
          <p className="text-gray-800 mb-2">{currentQuestion.question}</p>
          <ul className="ml-5">
            {currentQuestion.shuffledOptions.map((option) => (
              <li key={option.key}>
                <input
                  type="radio"
                  id={`${currentQuestion._id}-${option.key}`}
                  name={`question-${currentQuestion._id}`}
                  value={option.key}
                  checked={selectedAnswers[currentQuestion._id] === option.key}
                  onChange={() =>
                    handleAnswerChange(currentQuestion._id, option.key)
                  }
                />
                <label
                  htmlFor={`${currentQuestion._id}-${option.key}`}
                  className="ml-1"
                >
                  <strong>{option.key.slice(-1)}:</strong> {option.label}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={goToNextQuestion}
          className="bg-yellow-500 text-white py-2 px-4 rounded"
        >
          {currentQuestionIndex === shuffledQuestions.length - 1
            ? "Review Answers"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export default ExamDetails;
