import axios from "axios";
import { BASE_URL } from "../../utils/utils";

//add course
export const addCourseSectionAPI = async ({ courseId, formData }) => {
  console.log(courseId, formData);
  try {
    const response = await axios.post(
      `${BASE_URL}/course-sections/${courseId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error adding course section:", error);
    throw error;
  }
};
//get all course sections
export const getAllCourseSectionsAPI = async () => {
  const response = await axios.get(`${BASE_URL}/course-sections`, {
    withCredentials: true,
  });
  return response?.data;
};

//update progress
export const updateProgressAPI = async (data) => {
  console.log("data", data);
  const response = await axios.put(`${BASE_URL}/progress/update`, data, {
    withCredentials: true,
  });
  return response?.data;
};

//start section
export const startSectionAPI = async (data) => {
  console.log("data", data);
  const response = await axios.put(`${BASE_URL}/progress/start-section`, data, {
    withCredentials: true,
  });
  return response?.data;
};

//update section
export const updateSectionAPI = async (data) => {
  const response = await axios.put(
    `${BASE_URL}/course-sections/${data?.sectionId}`,
    {
      sectionName: data?.sectionName,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//delete section
export const deleteSectionAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/course-sections/${id}`, {
    withCredentials: true,
  });
  return response?.data;
};

//get single section
export const getSingleSectionAPI = async (id) => {
  const response = await axios.get(`${BASE_URL}/course-sections/${id}`, {
    withCredentials: true,
  });
  return response?.data;
};

export const postCommentAPI = async (videoId, commentText) => {
  const response = await axios.post(
    `${BASE_URL}/course-sections/videos/comments`,
    {
      videoId,
      commentText,
    },
    { withCredentials: true }
  );
  return response.data;
};

export const getCommentsAPI = async (videoId) => {
  const response = await axios.post(
    `${BASE_URL}/course-sections/videos/getcomments/${videoId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return response.data;
};

export const replyToCommentAPI = async (commentId, replyText) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/course-sections/videos/comments/reply/${commentId}`,
      { replyText },
      { withCredentials: true } // Include credentials (e.g., cookies) if needed
    );
    return response.data;
  } catch (error) {
    console.error("Error replying to comment:", error);
    throw error; // Rethrow error to be handled by the calling function
  }
};

export const createExamAPI = async (examData) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/course-sections/create-exam/give-exam`,
      examData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating exam:", error);
    throw error;
  }
};

// Example API function
// export const getExamDetailsAPI = async (sectionId) => {
//   const response = await axios.get(
//     `/course-sections/get-exam/${sectionId}`,
//     {},
//     {
//       withCredentials: true,
//     }
//   );
//   return response.data;
// };

export const getExamDetailsAPI = async (sectionId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/course-sections/get-exam/${sectionId}`,
      {
        withCredentials: true, // Include credentials if necessary
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching exam details:", error);
    throw error; // Ensure this throws the error so it can be caught in the component
  }
};

export const submitExamAPI = async (sectionId, answers) => {
  try {
    // Make a POST request to submit exam answers
    const response = await axios.post(
      `${BASE_URL}/course-sections/submit-exam`,
      { sectionId, answers },
      { withCredentials: true } //   Include credentials if necessary
    );

    // Return response data
    return response.data;
  } catch (error) {
    // Handle and throw errors properly
    const errorMessage =
      error.response?.data?.message ||
      "An error occurred while submitting the exam";
    throw new Error(errorMessage);
  }
};

export const fetchExamsResult = async (sectionId) => {
  console.log(sectionId)
  try {
    const response = await axios.get(
      `${BASE_URL}/course-sections/reveal-exam/${sectionId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch exams");
  }
};

