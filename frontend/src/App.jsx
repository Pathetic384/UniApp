import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./auth.jsx";
import Layout from "./components/Layout.jsx";
import RequireStudent from "./components/RequireStudent.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import AdminStudents from "./pages/AdminStudents.jsx";
import AdminGrades from "./pages/AdminGrades.jsx";
import AdminPassFail from "./pages/AdminPassFail.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  const location = useLocation();
  const { student, logout } = useAuth();

  useEffect(() => {
    if (location.pathname.startsWith("/admin") && student) {
      logout();
    }
  }, [location.pathname, student, logout]);

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<RequireStudent><StudentDashboard /></RequireStudent>} />
        <Route path="/student/password" element={<RequireStudent><ChangePassword /></RequireStudent>} />
        <Route path="/admin" element={<AdminStudents />} />
        <Route path="/admin/grades" element={<AdminGrades />} />
        <Route path="/admin/pass-fail" element={<AdminPassFail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
