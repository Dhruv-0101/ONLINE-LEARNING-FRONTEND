import { BrowserRouter, Route, Routes } from "react-router-dom";
import StudentRankList from "./components/Students/StudentsRanking";
import Register from "./components/User/Register";
import Login from "./components/User/Login";
import StudentDashboard from "./components/User/StudentDashboard";
import Homepage from "./components/Home/HomePage";
import Courses from "./components/Courses/Courses";
import CourseDetail from "./components/Courses/CourseDetails";
import ProgressUpdate from "./components/Students/ProgressUpdate";
import StartSection from "./components/Students/StartSection";
import PublicNavbar from "./components/Navbar/PublicNavbar";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import PrivateNavbar from "./components/Navbar/PrivateNavbar";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkUserAuthStatus } from "./redux/slices/authSlice";
import AddCourse from "./components/Admin/Courses/AddCourse";
import AddCourseSections from "./components/Admin/CourseSections/AddCourseSection";
import AdminCourses from "./components/Admin/Courses/AdminCourses";
import AdminCourseDetails from "./components/Admin/Courses/AdminCourseDetails";
import UpdateCourse from "./components/Admin/Courses/UpdateCourse";
import AdminCourseSections from "./components/Admin/CourseSections/AdminCourseSections";
import UpdateCourseSection from "./components/Admin/CourseSections/UpdateCourseSection";
import CourseSections from "./components/Admin/Courses/CourseSections";
import InstructorNavbar from "./components/Navbar/InstructorNavbar";
import InstructorRoutes from "./components/AuthRoute/InstructorRoutes";

import InstructorRegister from "./components/Admin/adminregister/InstructorRegister";
import RoleSelectionPage from "./components/Home/RoleSelectionPage";
import LoginInstructor from "./components/User/LoginInstructor";
import PaymentSuccess from "./components/payment/paymentSuccess";
import CheckoutForm from "./components/payment/checkout";
import CommentsPage from "./components/comments/comment";
import ReviewForm from "./components/review/ReviewForm";
import CreateExam from "./components/exam/CreateExam";
import ExamDetails from "./components/exam/GiveExam";
import ExamResultsPage from "./components/exam/ExamResult";
import CourseReviewPage from "./components/Courses/CourseReviewPage";
import LoginWithPasskey from "./components/User/LoginWithPassKey";

export default function App() {
  const dispatch = useDispatch();

  const { isAuthenticated, userProfile } = useSelector((state) => state.auth);
  const isInstructor = userProfile?.role === "instructor";
  const isStudent = userProfile?.role === "student";
  useEffect(() => {
    dispatch(checkUserAuthStatus());
    if (userProfile) {
      console.log("Current Session Role:", userProfile.role);
    }
  }, [isAuthenticated, userProfile?.role]);
  // Determine which navbar to render
  let NavbarComponent = PublicNavbar;
  
  if (isAuthenticated && userProfile) {
    const role = userProfile.role?.toLowerCase().trim();
    if (role === "instructor") {
      NavbarComponent = InstructorNavbar;
    } else if (role === "student" || role === "admin") {
      NavbarComponent = PrivateNavbar;
    }
  }
  return (
    <BrowserRouter>
      <NavbarComponent />
      <Routes>
        <Route element={<RoleSelectionPage />} path="/" />
        <Route element={<LoginWithPasskey />} path="/login-with-passkey" />

        {/* instructor links */}
        <Route
          element={
            <InstructorRoutes>
              <AddCourse />
            </InstructorRoutes>
          }
          path="/instructor-add-course"
        />
        <Route
          element={
            <InstructorRoutes>
              <AdminCourses />
            </InstructorRoutes>
          }
          path="/instructor-courses"
        />
        {/* admin course details */}
        <Route
          element={
            <InstructorRoutes>
              <AdminCourseDetails />
            </InstructorRoutes>
          }
          path="/instructor-courses/:courseId"
        />
        {/* update course */}
        <Route
          element={
            <InstructorRoutes>
              <UpdateCourse />
            </InstructorRoutes>
          }
          path="/instructor-update-course/:courseId"
        />
        <Route
          element={
            <InstructorRoutes>
              <AddCourseSections />
            </InstructorRoutes>
          }
          path="/instructor-add-course-sections/:courseId"
        />

        {/* admin course details */}
        <Route
          element={
            <InstructorRoutes>
              <CourseSections />
            </InstructorRoutes>
          }
          path="/instructor-course-sections/:courseId"
        />

        {/* admin course sections */}
        <Route
          element={
            <AuthRoute>
              <AdminCourseSections />
            </AuthRoute>
          }
          path="/instructor-course-sections"
        />
        {/* update course section */}
        <Route
          element={
            <AuthRoute>
              <UpdateCourseSection />
            </AuthRoute>
          }
          path="/update-course-section/:sectionId"
        />
        <Route
          element={
            <AuthRoute>
              <CommentsPage />
            </AuthRoute>
          }
          path="/video/comments/:videoId"
        />
        <Route
          element={
            <AuthRoute>
              <ReviewForm />
            </AuthRoute>
          }
          path="/courses/review/:courseId"
        />

        <Route element={<Homepage />} path="/home" />
        <Route
          element={<StudentRankList />}
          path="/students-position/:courseId"
        />
        <Route element={<Courses />} path="/courses" />
        <Route element={<CourseDetail />} path="/courses/:courseId" />
        <Route
          element={
            <AuthRoute>
              <StartSection />
            </AuthRoute>
          }
          path="/start-section/:courseId"
        />
        <Route
          path="/courses/get-review/:courseId"
          element={
            <AuthRoute>
              <CourseReviewPage />{" "}
            </AuthRoute>
          }
        />

        <Route element={<Register />} path="/register" />
        <Route element={<InstructorRegister />} path="/InstructorRegister" />

        <Route element={<Login />} path="/login" />
        <Route element={<LoginInstructor />} path="/LoginInstructor" />

        <Route
          element={
            <AuthRoute>
              <StudentDashboard />
            </AuthRoute>
          }
          path="/student-dashboard"
        />
        <Route
          element={
            <AuthRoute>
              <CreateExam />
            </AuthRoute>
          }
          path="/create-exam/:sectionId"
        />
        <Route
          element={
            <AuthRoute>
              <ExamResultsPage />
            </AuthRoute>
          }
          path="/exam-results/:sectionId"
        />
        <Route
          element={
            <AuthRoute>
              <ExamDetails />
            </AuthRoute>
          }
          path="/give-exam/:sectionId"
        />
        <Route
          element={
            <AuthRoute>
              <PaymentSuccess />
            </AuthRoute>
          }
          path="/success"
        />
        <Route element={<CheckoutForm />} path="/checkout/:courseId" />

        <Route
          element={
            <AuthRoute>
              <ProgressUpdate />
            </AuthRoute>
          }
          path="/progress-update/:courseId"
        />

        {/* register */}
      </Routes>
    </BrowserRouter>
  );
}
