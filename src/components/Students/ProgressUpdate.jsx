import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { FaBookOpen } from "react-icons/fa";
import { getUserProfileAPI } from "../../reactQuery/user/usersAPI";
import { updateProgressAPI } from "../../reactQuery/courseSections/courseSectionsAPI";
import { useParams } from "react-router-dom";
import AlertMessage from "../Alert/AlertMessage";

const ProgressUpdate = () => {
  const { courseId } = useParams(); // Get courseId from URL parameters
  const {
    data,
    error,
    isLoading,
    refetch: profileRefetch,
  } = useQuery({
    queryKey: ["course-sections"],
    queryFn: () => getUserProfileAPI(courseId),
  });
  console.log(data);

  const updateProgressMutation = useMutation({
    mutationKey: ["update-course-sections"],
    mutationFn: updateProgressAPI,
  });

  // Get ongoing course sections
  const ongoingSections = data?.courseProgress?.sections;

  // Get ongoing course
  const ongoingCourse = data?.courseProgress?.courseId;

  // Get the course details
  const courseDetails = data?.myCourse?.courseId;

  const [sections, setSections] = useState([]);

  useEffect(() => {
    if (data && data.profile) {
      // Find the course with the given courseId and set its sections
      const course = data.profile.progress.find(
        (p) => p.courseId._id === courseId
      );
      if (course) {
        setSections(course.sections);
      }
    }
  }, [data, courseId]);

  const handleProgressChange = async (sectionId, newStatus) => {
    setSections(
      sections.map((section) =>
        section.sectionId === sectionId
          ? { ...section, status: newStatus }
          : section
      )
    );

    const updateData = {
      sectionId: sectionId?._id,
      newStatus,
      courseId,
    };
    updateProgressMutation
      .mutateAsync(updateData)
      .then(() => {
        profileRefetch();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading sections!</div>;

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">
        Update Your Section Progress for
      </h2>

      {/* Alert messages */}
      {updateProgressMutation.isPending && (
        <AlertMessage type="loading" message="Updating progress..." />
      )}
      {updateProgressMutation.isError && (
        <AlertMessage
          type="error"
          message={updateProgressMutation.error?.response?.data?.message}
        />
      )}
      {updateProgressMutation.isSuccess && (
        <AlertMessage
          type="success"
          message={updateProgressMutation.data.message}
        />
      )}

      <h1 className="text-5xl font-bold text-indigo-600 mb-6">
        {ongoingCourse?.title}
      </h1>

      {ongoingSections?.map((section) => (
        <div
          key={section.sectionId?._id}
          className="bg-gray-100 p-4 rounded-lg mb-6"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-4">
            <span className="flex items-center text-lg font-medium text-gray-800 mb-3 md:mb-0">
              <FaBookOpen className="text-indigo-500 mr-3" />
              {section.sectionId?.sectionName}
            </span>
            <select
              className="border border-gray-300 rounded px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={section.status}
              onChange={(e) =>
                handleProgressChange(section.sectionId, e.target.value)
              }
            >
              <option value="">Select Status</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Paused">Paused</option>
              <option value="Away">Away</option>
            </select>
          </div>

          {/* Video Links */}
          {section.sectionId?.videos?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Videos
              </h3>
              <ul className="list-disc pl-5">
                {section.sectionId.videos.map((video, index) => (
                  <li key={video._id} className="mb-2">
                    <a
                      href={video.url}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {index + 1}. {video.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressUpdate;
