import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth, UserRole } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
  allowedRoles?: UserRole[]; // Optional: allow multiple roles (super-admin can access all)
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  allowedRoles,
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    // Redirect to login with return path
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Super-admin can access all routes (but we still need to check if accessing super-admin route)
  if (requiredRole === "super-admin" && user.role !== "super-admin") {
    // Non super-admin trying to access super-admin routes
    const dashboardPath = `/${user.role === "super-admin" ? "super-admin" : user.role}`;
    return <Navigate to={dashboardPath} replace />;
  }

  // Check if user's role matches required role or is in allowedRoles
  const rolesToCheck = allowedRoles || [requiredRole];
  if (!rolesToCheck.includes(user.role)) {
    // User doesn't have access, redirect to their own dashboard
    const dashboardPath = `/${user.role === "super-admin" ? "super-admin" : user.role}`;
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};
