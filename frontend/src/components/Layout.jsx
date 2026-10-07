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
          </nav>
          <div className="session">
            {student ? (
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
