import axios from "axios";
import { BASE_URL } from "../../utils/utils";

//add course
export const addCourseAPI = async (data) => {
  const response = await axios.post(`${BASE_URL}/courses`, data, {
    withCredentials: true,
  });
  return response?.data;
};

//get all course sections
export const getAllCoursesAPI = async () => {
  const response = await axios.get(`${BASE_URL}/courses`, {
    withCredentials: true,
  });
  return response?.data;
};

//Apply for course
export const startCourseAPI = async (data) => {
  console.log("data", data);
  const response = await axios.post(`${BASE_URL}/progress/apply`, data, {
    withCredentials: true,
  });
  return response?.data;
};

//get single course
export const getSingleCourseAPI = async (id) => {
  const response = await axios.get(`${BASE_URL}/courses/${id}`, {
    withCredentials: true,
  });
  return response?.data;
};

//update course
export const updateCourseAPI = async (data) => {
  const response = await axios.put(
    `${BASE_URL}/courses/${data?.courseId}`,
    data,
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

//delete course
export const deleteCourseAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/courses/${id}`, {
    withCredentials: true,
  });
  return response?.data;
};

//check already enrolled
export const checkInrolled = async (data) => {
  console.log(data);
  const response = await axios.post(`${BASE_URL}/courses/checkinrolled`, data, {
    withCredentials: true,
  });
  return response?.data;
};

export const checkAllCourseEnrolled = async () => {
  const response = await axios.post(
    `${BASE_URL}/courses/checkallcourseinrolled`,
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

export const submitReview = async (courseId, reviewData) => {
  const response = await axios.post(
    `${BASE_URL}/courses/createreview/${courseId}`,
    {
      message: reviewData.reviewText,
      rating: reviewData.rating,
    },
    {
      withCredentials: true,
    }
  );
  return response.data;
};
// Add note to a video inside a course section
export const addVideoNoteAPI = async (sectionId, videoId, noteData) => {
  console.log(
    "section Id: ",
    sectionId,
    "video Id: ",
    videoId,
    "noteData: ",
    noteData
  );
  // noteData = { timestamp: Number, text: String }
  const response = await axios.post(
    `${BASE_URL}/courses/sections/${sectionId}/videos/${videoId}/notes`,
    noteData,
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
// Fetch notes for a video in a course section for current user
export const getVideoNotesAPI = async (sectionId, videoId) => {
  console.log("section Id: ", sectionId, "video Id: ", videoId);
  const response = await axios.get(
    `${BASE_URL}/courses/section/${sectionId}/video/${videoId}`,
    {
      withCredentials: true,
    }
  );
  return response?.data;
};
// Fetch all reviews for a specific course
export const getCourseReviewsAPI = async (courseId) => {
  const response = await axios.get(`${BASE_URL}/courses/course/${courseId}`, {
    withCredentials: true,
  });
  return response?.data;
};
