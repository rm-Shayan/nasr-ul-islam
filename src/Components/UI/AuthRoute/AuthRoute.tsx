import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../Context api";
import React from "react";
import { Loader } from "../Loader";

interface AuthRouteProps {
  children: React.ReactNode;
}

export const AuthRoute: React.FC<AuthRouteProps> = ({ children }) => {
  const { user, loading, pendingLogout } = useAuth();
  const location = useLocation();

  if (loading || pendingLogout) {
    return <Loader/>; // or your <Loader />
  }

  if (user) {
    // If user is logged in, redirect to dashboard
    return <Navigate to="/dashboard" state={{ from: location }} replace />;
  }

  // Otherwise render the login/signup component
  return <>{children}</>;
};
