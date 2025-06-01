import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import {
  FaBookOpen,
  FaUser,
  FaUsers,
  FaLayerGroup,
  FaStar,
  FaStarHalfAlt,
  FaFilter,
} from "react-icons/fa";
import {
  checkAllCourseEnrolled,
  getAllCoursesAPI,
} from "../../reactQuery/courses/coursesAPI";
import { Link } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";
import Slider from "rc-slider"; // You can use any slider component
import "rc-slider/assets/index.css"; // Import slider styles

const Courses = () => {
  const { data, error, isLoading, isError } = useQuery({
    queryKey: ["courses"],
    queryFn: getAllCoursesAPI,
  });

  const { data: enrolledCourses } = useQuery({
    queryKey: ["courses-check"],
    queryFn: checkAllCourseEnrolled,
  });

  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false); // State to toggle filter options
  const [selectedPrice, setSelectedPrice] = useState([0, 100]); // Slider for price range
  const [selectedRating, setSelectedRating] = useState(0); // For rating filter
  const [selectedDate, setSelectedDate] = useState("latest"); // For date filter

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

  // Apply filters to the courses
  const filteredCourses = data
    ?.filter((course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(
      (course) =>
        course.price >= selectedPrice[0] && course.price <= selectedPrice[1]
    )
    .filter((course) => course.averageRating >= selectedRating)
    .sort((a, b) => {
      if (selectedDate === "latest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return new Date(a.createdAt) - new Date(b.createdAt);
    });

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

      {/* Search Bar with Filter Button */}
      <div className="mb-6 flex justify-center items-center relative">
        <input
          type="text"
          placeholder="Search for a course..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-blue-500 w-full md:w-1/2"
        />
        {/* Filter Button */}
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="absolute right-0 top-0 mt-2 mr-2 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
        >
          <FaFilter size={20} />
        </button>

        {/* Filter Modal */}
        {showFilter && (
          <div className="absolute right-0 mt-12 w-80 p-5 bg-white shadow-lg rounded-lg z-10">
            <h4 className="text-lg font-bold mb-2">Filters</h4>
            {/* Price Filter */}
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Price Range</label>
              <Slider
                range
                min={0}
                max={100}
                defaultValue={selectedPrice}
                onChange={(value) => setSelectedPrice(value)}
                trackStyle={{ backgroundColor: "#4299e1" }}
                handleStyle={[
                  { borderColor: "#4299e1" },
                  { borderColor: "#4299e1" },
                ]}
                railStyle={{ backgroundColor: "#CBD5E0" }}
              />
              <div className="flex justify-between mt-2">
                <span>${selectedPrice[0]}</span>
                <span>${selectedPrice[1]}</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Rating</label>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(parseFloat(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-blue-500"
              >
                <option value={0}>All ratings</option>
                <option value={1}>1 star & above</option>
                <option value={2}>2 stars & above</option>
                <option value={3}>3 stars & above</option>
                <option value={4}>4 stars & above</option>
                <option value={5}>5 stars</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="mb-4">
              <label className="block mb-2 text-gray-600">Date Created</label>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:border-blue-500"
              >
                <option value="latest">Latest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>

            {/* Apply Filter Button */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowFilter(false)}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
              >
                Apply Filter
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredCourses?.map((course) => (
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
                  <Link
                    to={`/courses/get-review/${course._id}`}
                    className="text-lg font-semibold mb-2 text-blue-600 hover:underline"
                  >
                    Reviews
                  </Link>
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
