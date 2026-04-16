import { Navigate, useLocation } from "react-router-dom";
import AuthCheckingComponent from "../Alert/AuthCheckingComponent";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { checkUserAuthStatusAPI } from "../../reactQuery/user/usersAPI";

import { useEffect } from "react";
import { checkUserAuthStatus } from "../../redux/slices/authSlice";

const AuthRoute = ({ children }) => {
  const dispatch = useDispatch();

  const { isAuthenticated, loading: reduxLoading } = useSelector((state) => state.auth);
  
  //use location
  const location = useLocation();
  //dispatch

  //react query
  const { data, isLoading: queryLoading } = useQuery({
    queryKey: ["userAuth"],
    queryFn: checkUserAuthStatusAPI,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
    enabled: !isAuthenticated, // Only run if not already authenticated
  });

  if (reduxLoading || (queryLoading && !isAuthenticated)) {
    return <AuthCheckingComponent />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
};

export default AuthRoute;
