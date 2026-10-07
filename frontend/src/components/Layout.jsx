import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Layout() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="wordmark" aria-label="UniApp home">
            <span className="wordmark-slots" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            UniApp
          </NavLink>
          <nav className="mainnav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to={student ? "/student" : "/login"}>My enrolment</NavLink>
            <NavLink to="/admin">Admin</NavLink>
          </nav>
          <div className="session">
            {student ? (
              <>
                <span className="session-name">{student.name}</span>
                <button
                  className="btn btn-quiet"
                  onClick={() => {
                    logout();
                    navigate("/login");
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink to="/login" className="btn btn-quiet">Log in</NavLink>
            )}
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
      <footer className="footer">
        32555 Fundamentals of Software Development · Tutorial 07, Group 5
      </footer>
    </div>
  );
}
