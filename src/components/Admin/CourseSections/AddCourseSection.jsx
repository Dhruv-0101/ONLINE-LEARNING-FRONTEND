import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { addCourseSectionAPI } from "../../../reactQuery/courseSections/courseSectionsAPI";
import AlertMessage from "../../Alert/AlertMessage";
import { useState } from "react";

const AddCourseSections = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mutation = useMutation({
    mutationFn: addCourseSectionAPI,
  });

  const formik = useFormik({
    initialValues: {
      sectionName: "",
      videos: [
        {
          title: "",
          file: null,
        },
      ],
    },
    validationSchema: Yup.object({
      sectionName: Yup.string().required("Section name is required"),
      videos: Yup.array()
        .of(
          Yup.object().shape({
            title: Yup.string().required("Video title is required"),
            file: Yup.mixed()
              .required("Video file is required")
              .test(
                "fileType",
                "Unsupported file format. Please upload a video file.",
                (value) => {
                  if (!value) return false;
                  const supportedFormats = [
                    "video/mp4",
                    "video/mov",
                    "video/avi",
                    "video/mkv",
                  ];
                  return supportedFormats.includes(value.type);
                }
              )
              .test(
                "fileSize",
                "File too large. Maximum size is 500MB.",
                (value) => {
                  if (!value) return false;
                  const maxSize = 500 * 1024 * 1024; // 500MB
                  return value.size <= maxSize;
                }
              ),
          })
        )
        .min(1, "At least one video is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      setIsSubmitting(true);
      const formData = new FormData();
      formData.append("sectionName", values.sectionName);

      values.videos.forEach((video, index) => {
        if (video.file) {
          formData.append("videos", video.file);
          formData.append(`titles[${index}]`, video.title);
        }
      });

      try {
        await mutation.mutateAsync({ courseId, formData });
        resetForm();
        setIsSubmitting(false);
        navigate("/instructor-courses");
      } catch (error) {
        console.error("Error adding section:", error);
        setIsSubmitting(false);
      }
    },
  });

  const handleAddVideoField = () => {
    formik.setFieldValue("videos", [
      ...formik.values.videos,
      { title: "", file: null },
    ]);
  };

  const handleRemoveVideoField = (index) => {
    const videos = [...formik.values.videos];
    videos.splice(index, 1);
    formik.setFieldValue("videos", videos);
  };

  return (
    <div className="flex flex-wrap pb-24 bg-gray-100">
      <div className="w-full p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Add Course Section
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Add a new section to your course. You can add multiple videos to
            this section.
          </p>

          <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
            {isSubmitting && (
              <AlertMessage
                type="loading"
                message="Uploading and saving data..."
              />
            )}
            {mutation.isError && !isSubmitting && (
              <AlertMessage
                type="error"
                message={
                  mutation.error.response?.data?.message ||
                  "An error occurred while creating the section."
                }
              />
            )}
            {mutation.isSuccess && !isSubmitting && (
              <AlertMessage
                type="success"
                message="Course section added successfully."
              />
            )}

            {/* Section Name */}
            <div className="mb-6">
              <label
                htmlFor="sectionName"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Section Name
              </label>
              <input
                type="text"
                id="sectionName"
                {...formik.getFieldProps("sectionName")}
                className={`w-full rounded-lg p-4 border ${
                  formik.touched.sectionName && formik.errors.sectionName
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:outline-none focus:border-indigo-500 transition duration-200`}
                placeholder="Enter section name"
              />
              {formik.touched.sectionName && formik.errors.sectionName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.sectionName}
                </div>
              )}
            </div>

            {/* Video Fields */}
            {formik.values.videos.map((video, index) => (
              <div
                key={index}
                className="mb-6 border p-4 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Video {index + 1}
                  </h2>
                  {formik.values.videos.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVideoField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Video Title */}
                <div className="mb-4">
                  <label
                    htmlFor={`videos[${index}].title`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Video Title
                  </label>
                  <input
                    type="text"
                    id={`videos[${index}].title`}
                    value={video.title}
                    onChange={(e) =>
                      formik.setFieldValue(
                        `videos[${index}].title`,
                        e.target.value
                      )
                    }
                    onBlur={formik.handleBlur}
                    className={`w-full rounded-lg p-4 border ${
                      formik.touched.videos?.[index]?.title &&
                      formik.errors.videos?.[index]?.title
                        ? "border-red-500"
                        : "border-gray-300"
                    } focus:outline-none focus:border-indigo-500 transition duration-200`}
                    placeholder="Enter video title"
                  />
                  {formik.touched.videos?.[index]?.title &&
                    formik.errors.videos?.[index]?.title && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.videos[index].title}
                      </div>
                    )}
                </div>

                {/* Video File */}
                <div>
                  <label
                    htmlFor={`videos[${index}].file`}
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Upload Video
                  </label>
                  <input
                    type="file"
                    id={`videos[${index}].file`}
                    accept="video/*"
                    onChange={(event) =>
                      formik.setFieldValue(
                        `videos[${index}].file`,
                        event.currentTarget.files[0]
                      )
                    }
                    onBlur={formik.handleBlur}
                    className={`w-full p-2 border ${
                      formik.touched.videos?.[index]?.file &&
                      formik.errors.videos?.[index]?.file
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:outline-none focus:border-indigo-500 transition duration-200`}
                  />
                  {formik.touched.videos?.[index]?.file &&
                    formik.errors.videos?.[index]?.file && (
                      <div className="text-red-500 text-sm mt-1">
                        {formik.errors.videos[index].file}
                      </div>
                    )}
                </div>
              </div>
            ))}

            {/* Add Video Button */}
            <div className="mb-6">
              <button
                type="button"
                onClick={handleAddVideoField}
                className="w-full flex items-center justify-center py-2 px-4 border border-dashed border-indigo-500 text-indigo-500 rounded-lg hover:bg-indigo-50 transition duration-200"
              >
                <i className="ri-add-line mr-2"></i> Add Another Video
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || mutation.isLoading}
              className="w-full py-3 px-4 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition duration-200"
            >
              {isSubmitting || mutation.isLoading
                ? "Submitting..."
                : "Add Section"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourseSections;
