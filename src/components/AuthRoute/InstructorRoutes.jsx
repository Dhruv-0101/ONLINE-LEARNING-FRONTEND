import { Navigate, useLocation } from "react-router-dom";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { checkUserAuthStatusAPI } from "../../reactQuery/user/usersAPI";

import { useEffect } from "react";
import { checkUserAuthStatus } from "../../redux/slices/authSlice";

const InstructorRoutes = ({ children }) => {
  const { isAuthenticated, userProfile, loading: reduxLoading } = useSelector((state) => state.auth);
  const location = useLocation();

  const { isLoading: queryLoading } = useQuery({
    queryKey: ["userAuth"],
    queryFn: checkUserAuthStatusAPI,
    staleTime: 1000 * 60 * 5,
    enabled: !isAuthenticated,
  });

  if (reduxLoading || (queryLoading && !isAuthenticated)) {
    return <AuthCheckingComponent />;
  }

  if (!isAuthenticated || userProfile?.role !== "instructor") {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default InstructorRoutes;
