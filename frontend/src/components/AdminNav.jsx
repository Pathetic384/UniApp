import { NavLink } from "react-router-dom";

export default function AdminNav() {
  return (
    <div className="admin-head">
      <h1>Admin</h1>
      <nav className="subnav" aria-label="Admin views">
        <NavLink to="/admin" end>All students</NavLink>
        <NavLink to="/admin/grades">By grade</NavLink>
        <NavLink to="/admin/pass-fail">Pass and fail</NavLink>
      </nav>
    </div>
  );
}
