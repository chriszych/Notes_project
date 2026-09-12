import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/userContext";

function ProtectedRoute({ children }) {
  const { user, loadingUser } = useContext(UserContext);

  if (loadingUser) {
    return (
      <div>
        <p>Sprawdzanie autoryzacji...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;