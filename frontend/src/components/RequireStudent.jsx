import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function RequireStudent({ children }) {
  const { student } = useAuth();
  const location = useLocation();
  if (!student) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}
