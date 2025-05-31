// CourseDetail.jsx
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
  FaBell,
  FaCheckCircle,
} from "react-icons/fa";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  getSingleCourseAPI,
  checkInrolled,
} from "../../reactQuery/courses/coursesAPI";
import {
  getUserNotificationsAPI,
  markNotificationAsReadAPI,
} from "../../reactQuery/user/usersAPI";
import { useSelector } from "react-redux";
import VideoModal from "../../utils/modal/VideoModal";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const userProfile = useSelector((state) => state.auth.userProfile);

  const { data: courseData } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getSingleCourseAPI(courseId),
  });

  const { mutate: checkEnrollment, data: enrollmentData } = useMutation({
    mutationFn: checkInrolled,
  });

  const isEnrolled = enrollmentData?.isEnrolled;

  useEffect(() => {
    if (courseId) {
      checkEnrollment({ courseId });
    }
  }, [courseId, checkEnrollment]);

  const handleStartCourse = () => navigate(`/checkout/${courseId}`);
  const handleGiveExam = (sectionId) => navigate(`/give-exam/${sectionId}`);

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = (video) => {
    setSelectedVideo({ title: video.title, url: video.url });
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };
  const handleViewComments = (videoId) =>
    navigate(`/video/comments/${videoId}`);

  // Notification logic
  const [notifications, setNotifications] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [showNotifModal, setShowNotifModal] = useState(false);

  const fetchNotifications = async () => {
    const data = await getUserNotificationsAPI({ userId: userProfile._id });
    setNotifications(data);
  };

  useEffect(() => {
    if (userProfile?._id) {
      fetchNotifications();
    }
  }, [userProfile]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const latestNotification = notifications.length > 0 ? notifications[0] : null; // 👈 NEW

  const handleMarkAsRead = async (notifId) => {
    await markNotificationAsReadAPI({ notificationId: notifId });
    fetchNotifications();
  };

  return (
    <>
      <div className="container mx-auto p-8 bg-gray-50 rounded-xl shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-6xl font-black text-gray-900">
            {courseData?.title}
          </h1>
          <div className="relative">
            <button
              onClick={() => setShowNotifModal(!showNotifModal)}
              className="text-gray-700 relative"
            >
              <FaBell className="text-3xl" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-600 text-white rounded-full text-xs px-1">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Modal */}
            {showNotifModal && (
              <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-white shadow-lg rounded-lg p-4 z-50">
                <h3 className="text-lg font-semibold mb-2">Notifications</h3>
                {notifications.slice(0, visibleCount).map((n) => (
                  <div
                    key={n._id}
                    className="flex justify-between items-start border-b py-2"
                  >
                    <div>
                      <p
                        className={
                          n.isRead
                            ? "text-gray-600"
                            : "font-semibold text-black"
                        }
                      >
                        {n.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(n.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="ml-2 mt-1">
                      {!n.isRead ? (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          className="text-sm text-blue-500 hover:underline"
                        >
                          Mark as read
                        </button>
                      ) : (
                        <FaCheckCircle className="text-green-500 mt-1" />
                      )}
                    </div>
                  </div>
                ))}
                {visibleCount < notifications.length && (
                  <button
                    onClick={() => setVisibleCount(visibleCount + 5)}
                    className="mt-2 w-full bg-blue-500 hover:bg-blue-700 text-white py-1 px-3 rounded"
                  >
                    Load More
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {latestNotification && (
          <div className="marquee-wrapper bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded mt-2">
            <div className="marquee-content font-medium flex items-center">
              📢 {latestNotification.message} —{" "}
              {new Date(latestNotification.createdAt).toLocaleString()}
            </div>
          </div>
        )}

        <p className="text-gray-800 text-lg mb-8 mt-4">
          {courseData?.description}
        </p>

        <div className="mb-10">
          <h2 className="text-4xl font-semibold text-gray-900 mb-5">
            Instructor & Course Info
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
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
                <p className="flex items-center">
                  <FaUsers className="text-blue-500 mr-2" />
                  <span>{courseData?.students?.length} Students</span>
                </p>
                <p className="flex items-center">
                  <FaLayerGroup className="text-blue-500 mr-2" />
                  <span>{courseData?.sections?.length} Sections</span>
                </p>
                <p className="flex items-center">
                  <span className="font-medium text-blue-500">
                    {courseData?.difficulty}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {isEnrolled ? (
            <Link
              to={`/start-section/${courseId}`}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
            >
              <FaPlay className="mr-2" /> Keep Learning
            </Link>
          ) : (
            <button
              onClick={handleStartCourse}
              className="flex items-center justify-center bg-blue-600 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded"
            >
              <FaPlay className="mr-2" /> Start Tracking Your Progress
            </button>
          )}

          {isEnrolled && (
            <Link
              to={`/start-section/${courseId}`}
              className="flex items-center justify-center bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
            >
              <FaBookOpen className="mr-2" /> Start Course Section
            </Link>
          )}

          <Link
            to={`/progress-update/${courseId}`}
            className="flex items-center justify-center bg-yellow-500 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded"
          >
            <FaChartLine className="mr-2" /> Update Progress
          </Link>

          <Link
            to={`/students-position/${courseId}`}
            className="flex items-center justify-center bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            <FaTrophy className="mr-2" /> Students Ranking
          </Link>

          {isEnrolled && courseData?.communityLink && (
            <a
              href={courseData.communityLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-purple-500 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
            >
              Community
            </a>
          )}
        </div>
      </div>

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
                  <button
                    onClick={() => handleGiveExam(section._id)}
                    className="bg-red-600 hover:bg-red-800 text-white font-semibold py-2 px-4 rounded"
                  >
                    Give Exam
                  </button>
                </div>

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
