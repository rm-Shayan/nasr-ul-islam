// components/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../Context api";
import { Loader } from "../Loader";
import React from "react";


export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Jab tak auth check ho raha ho
  if (loading) return <Loader />;

  // Agar user nahi mila
  if (!user) return <Navigate to="/Auth/login" replace />;

  // User mila toh content dikhado
  return children;
};
