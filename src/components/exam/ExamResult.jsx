// import React from "react";
// import { useParams } from "react-router-dom";
// import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
// import { useQuery } from "@tanstack/react-query";
// import { fetchExamsResult } from "../../reactQuery/courseSections/courseSectionsAPI";

// const styles = {
//   container: {
//     padding: "20px",
//     fontFamily: "Arial, sans-serif",
//     maxWidth: "1200px",
//     margin: "0 auto",
//   },
//   header: {
//     textAlign: "center",
//     marginBottom: "30px",
//   },
//   h1: {
//     fontSize: "2.5em",
//     color: "#333",
//   },
//   examCard: {
//     border: "1px solid #ddd",
//     borderRadius: "10px",
//     padding: "20px",
//     marginBottom: "20px",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
//     backgroundColor: "#f9f9f9",
//   },
//   examTitle: {
//     fontSize: "1.8em",
//     color: "#007bff",
//   },
//   examDescription: {
//     fontSize: "1.2em",
//     color: "#666",
//   },
//   examScore: {
//     fontSize: "1.5em",
//     fontWeight: "bold",
//   },
//   questionsContainer: {
//     marginTop: "20px",
//   },
//   questionCard: {
//     border: "1px solid #eee",
//     borderRadius: "8px",
//     padding: "15px",
//     marginBottom: "15px",
//     backgroundColor: "#fff",
//   },
//   questionText: {
//     fontSize: "1.2em",
//     fontWeight: "bold",
//   },
//   answerStatus: {
//     fontWeight: "bold",
//     display: "flex",
//     alignItems: "center",
//     marginTop: "10px",
//   },
//   correct: {
//     color: "green",
//   },
//   incorrect: {
//     color: "red",
//   },
//   answerStatusIcon: {
//     marginRight: "5px",
//   },
//   loading: {
//     textAlign: "center",
//     fontSize: "1.2em",
//     color: "#555",
//   },
//   error: {
//     textAlign: "center",
//     fontSize: "1.2em",
//     color: "#555",
//   },
//   noExams: {
//     textAlign: "center",
//     fontSize: "1.2em",
//     color: "#555",
//   },
//   footer: {
//     textAlign: "center",
//     marginTop: "30px",
//     fontSize: "0.9em",
//     color: "#777",
//   },
// };

// const ExamResultsPage = () => {
//   const { sectionId } = useParams(); // Extract sectionId from URL parameters
//   console.log(sectionId);

//   // Query to fetch exam results using the sectionId
//   const {
//     data: courseData,
//     error,
//     isLoading,
//   } = useQuery({
//     queryKey: ["examresult", sectionId],
//     queryFn: () => fetchExamsResult(sectionId),
//   });

//   console.log(courseData)
//   if (isLoading) return <p style={styles.loading}>Loading...</p>;
//   if (error)
//     return <p style={styles.error}>Failed to fetch exams: {error.message}</p>;

//   const exams = courseData?.exams || [];

//   return (
//     <div style={styles.container}>
//       <header style={styles.header}>
//         <h1 style={styles.h1}>Your Exam Results</h1>
//       </header>
//       {exams.length === 0 ? (
//         <p style={styles.noExams}>No exams found</p>
//       ) : (
//         exams.map((exam) => (
//           <div key={exam.examId} style={styles.examCard}>
//             <h2 style={styles.examTitle}>{exam.name}</h2>
//             <p style={styles.examDescription}>{exam.description}</p>
//             <h3 style={styles.examScore}>Score: {exam.score}</h3>
//             <div style={styles.questionsContainer}>
//               {exam.answers.map((answer, index) => (
//                 <div key={index} style={styles.questionCard}>
//                   <h4 style={styles.questionText}>
//                     Question: {answer.questionText}
//                   </h4>
//                   <p>
//                     <strong>Your Answer:</strong> {answer.selectedOption}
//                   </p>
//                   <p>
//                     <strong>Correct Answer:</strong> {answer.correctAnswer}
//                   </p>
//                   <p
//                     style={{
//                       ...styles.answerStatus,
//                       ...(answer.isCorrect ? styles.correct : styles.incorrect),
//                     }}
//                   >
//                     {answer.isCorrect ? (
//                       <FaCheckCircle style={styles.answerStatusIcon} />
//                     ) : (
//                       <FaTimesCircle style={styles.answerStatusIcon} />
//                     )}{" "}
//                     {answer.isCorrect ? "Correct" : "Incorrect"}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>
//         ))
//       )}
//       <footer style={styles.footer}>
//         <p>© 2024 Your Exam Platform</p>
//       </footer>
//     </div>
//   );
// };

// export default ExamResultsPage;

import React from "react";
import { useParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { fetchExamsResult } from "../../reactQuery/courseSections/courseSectionsAPI";

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  h1: {
    fontSize: "2.5em",
    color: "#333",
  },
  examCard: {
    border: "1px solid #ddd",
    borderRadius: "10px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#f9f9f9",
  },
  examTitle: {
    fontSize: "1.8em",
    color: "#007bff",
  },
  examDescription: {
    fontSize: "1.2em",
    color: "#666",
  },
  examScore: {
    fontSize: "1.5em",
    fontWeight: "bold",
  },
  questionsContainer: {
    marginTop: "20px",
  },
  questionCard: {
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "15px",
    marginBottom: "15px",
    backgroundColor: "#fff",
  },
  questionText: {
    fontSize: "1.2em",
    fontWeight: "bold",
  },
  optionsContainer: {
    marginTop: "10px",
    marginBottom: "10px",
  },
  option: {
    fontSize: "1em",
    marginBottom: "5px",
  },
  answerStatus: {
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    marginTop: "10px",
  },
  correct: {
    color: "green",
  },
  incorrect: {
    color: "red",
  },
  answerStatusIcon: {
    marginRight: "5px",
  },
  loading: {
    textAlign: "center",
    fontSize: "1.2em",
    color: "#555",
  },
  error: {
    textAlign: "center",
    fontSize: "1.2em",
    color: "#555",
  },
  noExams: {
    textAlign: "center",
    fontSize: "1.2em",
    color: "#555",
  },
  footer: {
    textAlign: "center",
    marginTop: "30px",
    fontSize: "0.9em",
    color: "#777",
  },
};

const ExamResultsPage = () => {
  const { sectionId } = useParams(); // Extract sectionId from URL parameters
  console.log(sectionId);

  // Query to fetch exam results using the sectionId
  const {
    data: courseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["examresult", sectionId],
    queryFn: () => fetchExamsResult(sectionId),
  });

  console.log(courseData);
  if (isLoading) return <p style={styles.loading}>Loading...</p>;
  if (error)
    return <p style={styles.error}>Failed to fetch exams: {error.message}</p>;

  const exams = courseData?.exams || [];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.h1}>Your Exam Results</h1>
      </header>
      {exams.length === 0 ? (
        <p style={styles.noExams}>No exams found</p>
      ) : (
        exams.map((exam) => (
          <div key={exam.examId} style={styles.examCard}>
            <h2 style={styles.examTitle}>{exam.name}</h2>
            <p style={styles.examDescription}>{exam.description}</p>
            <h3 style={styles.examScore}>Score: {exam.score}</h3>
            <div style={styles.questionsContainer}>
              {exam.answers.map((answer, index) => {
                const options = answer.options || {}; // Add default value for options
                return (
                  <div key={index} style={styles.questionCard}>
                    <h4 style={styles.questionText}>
                      Question: {answer.question.question}
                    </h4>
                    <div style={styles.optionsContainer}>
                      <p style={styles.option}>
                        <strong>A:</strong> {options.A}
                      </p>
                      <p style={styles.option}>
                        <strong>B:</strong> {options.B}
                      </p>
                      <p style={styles.option}>
                        <strong>C:</strong> {options.C}
                      </p>
                      <p style={styles.option}>
                        <strong>D:</strong> {options.D}
                      </p>
                    </div>
                    <p>
                      <strong>Your Answer:</strong> {answer.selectedOption}
                    </p>
                    <p>
                      <strong>Correct Answer:</strong> {answer.correctAnswer}
                    </p>
                    <p
                      style={{
                        ...styles.answerStatus,
                        ...(answer.isCorrect
                          ? styles.correct
                          : styles.incorrect),
                      }}
                    >
                      {answer.isCorrect ? (
                        <FaCheckCircle style={styles.answerStatusIcon} />
                      ) : (
                        <FaTimesCircle style={styles.answerStatusIcon} />
                      )}{" "}
                      {answer.isCorrect ? "Correct" : "Incorrect"}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
      <footer style={styles.footer}>
        <p>© 2024 Your Exam Platform</p>
      </footer>
    </div>
  );
};

export default ExamResultsPage;
