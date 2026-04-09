import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While checking auth (on refresh)
  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-neutral-400">
        Loading...
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // Logged in → allow access
  return children;
}
