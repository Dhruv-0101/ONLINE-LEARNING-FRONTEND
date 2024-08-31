import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  FaBookOpen,
  FaUser,
  FaUsers,
  FaLayerGroup,
  FaStar,
  FaStarHalfAlt,
} from "react-icons/fa";
import {
  checkAllCourseEnrolled,
  getAllCoursesAPI,
} from "../../reactQuery/courses/coursesAPI";
import { Link } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";

const Courses = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
  });

  const { data: enrolledCourses } = useQuery({
    queryKey: ["courses-check"],
    queryFn: checkAllCourseEnrolled,
  });

  // Show loading
  if (isLoading) {
    return <AlertMessage type="loading" message="Loading courses..." />;
  }

  // Show error
  if (isError) {
    return (
      <AlertMessage
        type="error"
        message={error?.response?.data?.message || error?.message}
      />
    );
  }

  // Helper function to check if the user is enrolled in the course
  const isEnrolled = (courseId) => {
    return enrolledCourses?.some(
      (enrolledCourse) => enrolledCourse._id === courseId
    );
  };

  // Helper function to render star ratings
  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

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

  return (
    <div className="container mx-auto p-8 bg-gray-200">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-extrabold mb-4 text-gray-800">
          Explore Our Courses
        </h2>
        <p className="text-lg text-gray-700">
          Select a course you have enrolled with E-Learning and start keeping
          track of your progress.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {data?.map((course) => (
          <Link
            key={course._id}
            to={`/courses/${course._id}`}
            className="no-underline transform hover:scale-105 transition duration-300"
          >
            <div className="bg-white shadow-xl rounded-xl overflow-hidden flex flex-col h-full">
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-3xl font-bold text-gray-800 truncate">
                    {course?.title}
                  </h3>
                </div>
                <div className="text-center mb-4 flex-grow">
                  <FaBookOpen className="mx-auto text-blue-600 text-7xl mb-6" />
                  <p className="text-gray-700 mb-4 truncate">
                    {course.description}
                  </p>
                </div>
                <div className="text-sm space-y-3">
                  {/* Instructor */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <FaUser className="text-blue-600" />
                      <span>{course?.user?.username}</span>
                    </span>
                    <span className="text-blue-500 font-medium">
                      {course?.difficulty}
                    </span>
                  </div>
                  {/* Total students */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <FaUsers className="text-blue-600" />
                      <span>{course?.students?.length} Students</span>
                    </span>
                    <span className="text-blue-500 font-medium">
                      {new Date(course?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {/* Total sections */}
                  <div className="flex items-center justify-between">
                    <span className="flex items-center space-x-2">
                      <FaLayerGroup className="text-blue-600" />
                      <span>{course?.sections?.length} Sections</span>
                    </span>
                    <span
                      className={`font-medium ${
                        isEnrolled(course._id)
                          ? "text-green-500"
                          : "text-blue-500"
                      }`}
                    >
                      {isEnrolled(course._id) ? "Enrolled" : "Explore Now"}
                    </span>
                  </div>
                </div>
              </div>
              {/* Reviews section */}
              <div className="bg-gray-100 border-t border-gray-300 p-4 flex">
                {/* Reviews Details */}
                <div className="flex-grow">
                  <h4 className="text-lg font-semibold mb-2">Reviews</h4>
                  <div className="flex items-center mb-2">
                    {renderStars(course?.averageRating || 0)}
                    <span className="ml-2 text-gray-600">
                      ({course?.totalReviews || 0} reviews)
                    </span>
                  </div>
                  <div className="text-left text-70px font-bold text-gray-700">
                    Average Rating: {course?.averageRating || "N/A"}
                  </div>
                </div>
                {/* Actions */}
                <div className="ml-4 flex flex-col space-y-3">
                  {/* Price */}
                  <div className="text-lg font-bold text-gray-800">
                    Price: ${course?.price || "N/A"}
                  </div>
                  {/* Leave a review button */}
                  {isEnrolled(course._id) && (
                    <Link
                      to={`/courses/review/${course._id}`}
                      className="inline-block px-5 py-3 bg-blue-500 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                    >
                      Leave a Review
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Courses;
