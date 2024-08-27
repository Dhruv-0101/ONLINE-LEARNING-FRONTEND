import { useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation } from "@tanstack/react-query";
import * as Yup from "yup";
import { addCourseSectionAPI } from "../../../reactQuery/courseSections/courseSectionsAPI";
import AlertMessage from "../../Alert/AlertMessage"

const validationSchema = Yup.object({
  sectionName: Yup.string().required("Section name is required"),
  videos: Yup.array().of(Yup.mixed().required("A video file is required")),
});

const AddCourseSections = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const mutation = useMutation({
    mutationFn: addCourseSectionAPI,
  });

  const formik = useFormik({
    initialValues: {
      sectionName: "",
      videos: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      console.log("Formik values on submit:", values);

      // Create FormData instance
      const formData = new FormData();
      formData.append("sectionName", values.sectionName);

      // Append video files
      values.videos.forEach((file) => {
        formData.append("videos", file);
      });
      console.log(formData)

      try {
        const data = await mutation.mutateAsync({ courseId, formData });
        console.log("Section added successfully:", data);
        navigate("/instructor-courses");
      } catch (error) {
        console.error("Error adding section:", error);
      }
    },
  });

  return (
    <div className="flex flex-wrap pb-24 bg-gray-100">
      <div className="w-full p-4">
        <div className="bg-white shadow-lg rounded-lg max-w-md mx-auto p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
            Add Course Section
          </h1>
          <p className="text-gray-600 text-center mb-6">
            Add a new section to your course. You can add as many sections as
            you want.
          </p>
          <form onSubmit={formik.handleSubmit}>
            {mutation.isPending && (
              <AlertMessage type="loading" message="Loading..." />
            )}
            {mutation.isError && (
              <AlertMessage
                type="error"
                message={
                  mutation?.error?.response?.data?.message ||
                  mutation?.error?.message
                }
              />
            )}
            {mutation.isSuccess && (
              <AlertMessage
                type="success"
                message="Course section added successfully"
              />
            )}

            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="sectionName"
              >
                Section Name
              </label>
              <input
                className="w-full rounded-lg p-4 border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-orange-200 transition duration-200"
                type="text"
                id="sectionName"
                placeholder="Enter section name"
                {...formik.getFieldProps("sectionName")}
              />
              {formik.touched.sectionName && formik.errors.sectionName && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.sectionName}
                </div>
              )}
            </div>

            <div className="mb-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="videos"
              >
                Upload Videos
              </label>
              <input
                type="file"
                id="videos"
                name="videos"
                multiple
                onChange={(event) => {
                  const files = Array.from(event.target.files);
                  formik.setFieldValue("videos", files);
                }}
                className="w-full rounded-lg p-4 border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-orange-200 transition duration-200"
              />
              {formik.touched.videos && formik.errors.videos && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.videos}
                </div>
              )}
            </div>

            <button
              className="h-12 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg w-full transition duration-200 ease-in-out flex items-center justify-center"
              type="submit"
            >
              <i className="ri-add-circle-line mr-2"></i> Add Course Section
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddCourseSections;
