// // components/CreateExam.js

// import React, { useState } from "react";
// import { createExamAPI } from "../../reactQuery/courseSections/courseSectionsAPI";
// // import AlertMessage from "./AlertMessage"; // Assuming you have an AlertMessage component

// const CreateExam = () => {
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [sectionId, setSectionId] = useState("");
//   const [score, setScore] = useState(0);
//   const [students, setStudents] = useState([]);
//   const [questions, setQuestions] = useState([
//     {
//       question: "",
//       optionA: "",
//       optionB: "",
//       optionC: "",
//       optionD: "",
//       correctAnswer: "",
//       isCorrect: false,
//     },
//   ]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleQuestionChange = (index, event) => {
//     const { name, value } = event.target;
//     const newQuestions = [...questions];
//     newQuestions[index][name] = value;
//     setQuestions(newQuestions);
//   };

//   const handleAddQuestion = () => {
//     setQuestions([
//       ...questions,
//       {
//         question: "",
//         optionA: "",
//         optionB: "",
//         optionC: "",
//         optionD: "",
//         correctAnswer: "",
//         isCorrect: false,
//       },
//     ]);
//   };

//   const handleRemoveQuestion = (index) => {
//     const newQuestions = questions.filter((_, i) => i !== index);
//     setQuestions(newQuestions);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setSuccess(null);

//     const examData = {
//       name,
//       description,
//       sectionId,
//       score,
//       students,
//       questions,
//     };

//     try {
//       const result = await createExamAPI(examData);
//       setSuccess("Exam created successfully");
//       setName("");
//       setDescription("");
//       setSectionId("");
//       setScore(0);
//       setStudents([]);
//       setQuestions([
//         {
//           question: "",
//           optionA: "",
//           optionB: "",
//           optionC: "",
//           optionD: "",
//           correctAnswer: "",
//           isCorrect: false,
//         },
//       ]);
//     } catch (error) {
//       setError("Failed to create exam");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto p-4">
//       {loading && <AlertMessage type="loading" message="Creating exam..." />}
//       {error && <AlertMessage type="error" message={error} />}
//       {success && <AlertMessage type="success" message={success} />}

//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-lg shadow-md"
//       >
//         <h2 className="text-2xl font-bold mb-4">Create Exam</h2>
//         <div className="mb-4">
//           <label htmlFor="name" className="block text-gray-700">
//             Exam Name
//           </label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="description" className="block text-gray-700">
//             Description
//           </label>
//           <textarea
//             id="description"
//             name="description"
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             rows="4"
//             required
//           ></textarea>
//         </div>
//         <div className="mb-4">
//           <label htmlFor="sectionId" className="block text-gray-700">
//             Section ID
//           </label>
//           <input
//             type="text"
//             id="sectionId"
//             name="sectionId"
//             value={sectionId}
//             onChange={(e) => setSectionId(e.target.value)}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="score" className="block text-gray-700">
//             Score
//           </label>
//           <input
//             type="number"
//             id="score"
//             name="score"
//             value={score}
//             onChange={(e) => setScore(Number(e.target.value))}
//             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//             required
//           />
//         </div>
//         {questions.map((question, index) => (
//           <div key={index} className="mb-4 border p-4 rounded-md">
//             <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
//             <div className="mb-2">
//               <label
//                 htmlFor={`question-${index}`}
//                 className="block text-gray-700"
//               >
//                 Question
//               </label>
//               <input
//                 type="text"
//                 id={`question-${index}`}
//                 name="question"
//                 value={question.question}
//                 onChange={(e) => handleQuestionChange(index, e)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                 required
//               />
//             </div>
//             <div className="mb-2">
//               <label className="block text-gray-700">Options</label>
//               <input
//                 type="text"
//                 name="optionA"
//                 value={question.optionA}
//                 onChange={(e) => handleQuestionChange(index, e)}
//                 placeholder="Option A"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="optionB"
//                 value={question.optionB}
//                 onChange={(e) => handleQuestionChange(index, e)}
//                 placeholder="Option B"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="optionC"
//                 value={question.optionC}
//                 onChange={(e) => handleQuestionChange(index, e)}
//                 placeholder="Option C"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
//                 required
//               />
//               <input
//                 type="text"
//                 name="optionD"
//                 value={question.optionD}
//                 onChange={(e) => handleQuestionChange(index, e)}
//                 placeholder="Option D"
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
//                 required
//               />
//             </div>
//             <div className="mb-2">
//               <label
//                 htmlFor={`correctAnswer-${index}`}
//                 className="block text-gray-700"
//               >
//                 Correct Answer
//               </label>
//               <select
//                 id={`correctAnswer-${index}`}
//                 name="correctAnswer"
//                 value={question.correctAnswer}
//                 onChange={(e) => handleQuestionChange(index, e)}
//                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
//                 required
//               >
//                 <option value="" disabled>
//                   Select correct answer
//                 </option>
//                 <option value="optionA">Option A</option>
//                 <option value="optionB">Option B</option>
//                 <option value="optionC">Option C</option>
//                 <option value="optionD">Option D</option>
//               </select>
//             </div>
//             <button
//               type="button"
//               onClick={() => handleRemoveQuestion(index)}
//               className="text-red-500 hover:underline"
//             >
//               Remove Question
//             </button>
//           </div>
//         ))}
//         <button
//           type="button"
//           onClick={handleAddQuestion}
//           className="text-blue-500 hover:underline"
//         >
//           Add Another Question
//         </button>
//         <div className="mt-6">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded-md"
//           >
//             Create Exam
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default CreateExam;

import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { createExamAPI } from "../../reactQuery/courseSections/courseSectionsAPI";

const CreateExam = () => {
  const { sectionId } = useParams(); // Get sectionId from URL parameters
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [score, setScore] = useState();
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
      sectionId, // Use sectionId from URL params
      score,
      students,
      questions,
    };

    try {
      const result = await createExamAPI(examData);
      setSuccess("Exam created successfully");
      setName("");
      setDescription("");
      setScore(0);
      setStudents([]);
      setQuestions([
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
    } catch (error) {
      setError("Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* {loading && <AlertMessage type="loading" message="Creating exam..." />}
      {error && <AlertMessage type="error" message={error} />}
      {success && <AlertMessage type="success" message={success} />} */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Create Exam</h2>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700">
            Exam Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            rows="4"
            required
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="score" className="block text-gray-700">
            Score
          </label>
          <input
            type="number"
            id="score"
            name="score"
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>
        {questions.map((question, index) => (
          <div key={index} className="mb-4 border p-4 rounded-md">
            <h3 className="text-lg font-semibold mb-2">Question {index + 1}</h3>
            <div className="mb-2">
              <label
                htmlFor={`question-${index}`}
                className="block text-gray-700"
              >
                Question
              </label>
              <input
                type="text"
                id={`question-${index}`}
                name="question"
                value={question.question}
                onChange={(e) => handleQuestionChange(index, e)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              />
            </div>
            <div className="mb-2">
              <label className="block text-gray-700">Options</label>
              <input
                type="text"
                name="optionA"
                value={question.optionA}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder="Option A"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
                required
              />
              <input
                type="text"
                name="optionB"
                value={question.optionB}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder="Option B"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
                required
              />
              <input
                type="text"
                name="optionC"
                value={question.optionC}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder="Option C"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
                required
              />
              <input
                type="text"
                name="optionD"
                value={question.optionD}
                onChange={(e) => handleQuestionChange(index, e)}
                placeholder="Option D"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm mb-2"
                required
              />
            </div>
            <div className="mb-2">
              <label
                htmlFor={`correctAnswer-${index}`}
                className="block text-gray-700"
              >
                Correct Answer
              </label>
              <select
                id={`correctAnswer-${index}`}
                name="correctAnswer"
                value={question.correctAnswer}
                onChange={(e) => handleQuestionChange(index, e)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                required
              >
                <option value="" disabled>
                  Select correct answer
                </option>
                <option value="optionA">Option A</option>
                <option value="optionB">Option B</option>
                <option value="optionC">Option C</option>
                <option value="optionD">Option D</option>
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveQuestion(index)}
              className="text-red-500 hover:underline"
            >
              Remove Question
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddQuestion}
          className="text-blue-500 hover:underline"
        >
          Add Another Question
        </button>
        <div className="mt-6">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Create Exam
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExam;
