import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loading from "../components/Loading"

export default function PrivateRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loading />;

  // Check if user is logged in and has the required role
  if (!user) return <Navigate to="/login" />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/unauthorized" />;

  return children;
}