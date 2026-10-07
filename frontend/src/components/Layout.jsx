import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth.jsx";

export default function Layout() {
  const { student, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="wordmark" aria-label="UniApp home">
            <span className="wordmark-slots" aria-hidden="true">
              <i /><i /><i /><i />
            </span>
            UniApp
          </div>
          <nav className="mainnav">
          </nav>
          <div className="session">
            {isAdmin ? null : student ? (
              <>
                <NavLink to="/student" className="btn btn-quiet">{student.name}</NavLink>
                <button
                  className="btn btn-quiet"
                  onClick={() => {
                    logout();
                    navigate("/");
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className="btn btn-quiet">Log in</NavLink>
                <NavLink to="/register" className="btn btn-primary">Sign up</NavLink>
              </>
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
