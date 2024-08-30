import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import {
  FaBookOpen,
  FaUser,
  FaUsers,
  FaLayerGroup,
  FaPlay,
  FaTrophy,
  FaChartLine,
} from "react-icons/fa";
import { FiEdit2, FiTrash2 } from "react-icons/fi";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getSingleCourseAPI,
  checkInrolled,
} from "../../reactQuery/courses/coursesAPI";
import AlertMessage from "../Alert/AlertMessage";
import { useSelector } from "react-redux";
import VideoModal from "../../utils/modal/VideoModal"; // Import the VideoModal component

const CourseDetail = ({ course }) => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  // Query to fetch single course
  const {
    data: courseData,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
  });

  const {
    mutate: checkEnrollment,
    data: enrollmentData,
    isLoading: isChecking,
    isError,
  } = useMutation({
    mutationFn: checkInrolled,
  });

  // Handle enrollment check on component mount
  useEffect(() => {
    if (courseId) {
      checkEnrollment({ courseId });
    }
  }, [courseId, checkEnrollment]);

  // Start course mutation handler
  const handleStartCourse = () => {
    navigate(`/checkout/${courseId}`);
  };

  // Get the auth user
  const userProfile = useSelector((state) => state.auth.userProfile);

  // State for managing video modal
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Function to open video modal
  const handleOpenModal = (video) => {
    setSelectedVideo({
      title: video.title,
      url: video.url, // Assuming video.url contains the video URL
    });
    setIsModalOpen(true);
  };

  // Function to close video modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  // Function to navigate to the comments page for a specific video
  const handleViewComments = (videoId) => {
    navigate(`/video/comments/${videoId}`);
  };

  const isEnrolled = enrollmentData?.isEnrolled;

  return (
    <>
      <div className="container mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
        <h1 className="text-6xl font-black text-gray-900 mb-8">
          {courseData?.title}
        </h1>
        <p className="text-gray-800 text-lg mb-8">{courseData?.description}</p>

        <div className="mb-10">
          <h2 className="text-4xl font-semibold text-gray-900 mb-5">
            Instructor & Course Info
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Instructor and course details */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Instructor
              </h3>
              <div className="flex items-center text-gray-800">
                <FaUser className="text-blue-500 mr-3 text-xl" />
                <span className="text-lg">{courseData?.user?.username}</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                Course Stats
              </h3>
              <div className="space-y-3">
                {/* Total students */}
                <p className="flex items-center">
                  <FaUsers className="text-blue-500 mr-2" />
                  <span>{courseData?.students?.length} Students</span>
                </p>
                {/* Total sections */}
                <p className="flex items-center">
                  <FaLayerGroup className="text-blue-500 mr-2" />
                  <span>{courseData?.sections?.length} Sections</span>
                </p>
                {/* Difficulty level */}
                <p className="flex items-center">
                  <span className="font-medium text-blue-500">
                    {courseData?.difficulty}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {isEnrolled ? (
            <Link
              to={`/start-section/${courseId}`}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              <FaPlay className="mr-2" /> Keep Learning
            </Link>
          ) : (
            <button
              onClick={handleStartCourse}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              <FaPlay className="mr-2" /> Start Tracking Your Progress
            </button>
          )}

          {isEnrolled && (
            <Link
              to={`/start-section/${courseId}`}
              className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              <FaBookOpen className="mr-2" /> Start Course Section
            </Link>
          )}

          <Link
            to={`/progress-update/${courseId}`}
            className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            <FaChartLine className="mr-2" /> Update Progress
          </Link>

          <Link
            to={`/students-position/${courseId}`}
            className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
          >
            <FaTrophy className="mr-2" /> Students Ranking
          </Link>
          {isEnrolled && courseData?.communityLink && (
            <a
              href={courseData.communityLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Community
            </a>
          )}
        </div>
      </div>

      {/* Check if it has sections */}
      {courseData?.sections?.length > 0 ? (
        <div className="mt-6 mb-6">
          <h2 className="text-3xl text-center font-extrabold text-gray-800 mb-4">
            Course Sections ({courseData?.sections?.length})
          </h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {courseData?.sections?.map((section) => (
              <div
                key={section._id}
                className="bg-white rounded-lg shadow-md p-4"
              >
                <div className="flex justify-between items-center">
                  <p className="text-xl font-semibold text-gray-800">
                    {section.sectionName} ({section.videos.length})
                  </p>
                  <div className="flex space-x-2">
                    {/* <Link to={`/update-course-section/${section._id}`}>
                      <button className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200">
                        <FiEdit2 size={18} />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(section._id)}
                      className="flex items-center justify-center p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-200"
                    >
                      <FiTrash2 size={18} />
                    </button> */}
                  </div>
                </div>

                {/* Video section */}
                {section.videos && section.videos.length > 0 && (
                  <div className="mt-4">
                    <div className="space-y-2">
                      {section.videos.map((video) => (
                        <div
                          key={video.public_id}
                          className="flex items-center justify-between p-2 border border-gray-300 rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <FaPlay className="text-blue-500" />
                            {isEnrolled ? (
                              <span
                                className="text-blue-600 hover:underline cursor-pointer"
                                onClick={() => handleOpenModal(video)}
                              >
                                {video.title}
                              </span>
                            ) : (
                              <span className="text-gray-600">
                                {video.title}
                              </span>
                            )}
                          </div>
                          {/* Button to explore comments */}
                          {isEnrolled && (
                            <button
                              onClick={() => handleViewComments(video._id)}
                              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-1 px-3 rounded"
                            >
                              View Comments
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
            No Sections Available
          </h2>
          <p className="text-gray-700">
            This course doesn't have any sections yet. Please check back later.
          </p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          video={selectedVideo}
        />
      )}
    </>
  );
};

export default CourseDetail;
