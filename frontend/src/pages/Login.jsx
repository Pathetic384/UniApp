import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import Notice from "../components/Notice.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { setStudent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  async function onSubmit(e) {
    e.preventDefault();
    // Story 104: tell the user when a login field is empty.
    if (!email.trim() || !password) {
      setError("Enter both your email and password to log in.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const student = await api.login(email.trim(), password);
      setStudent(student);
      navigate(location.state?.from || "/student", { replace: true });
    } catch (err) {
      // Story 103: credentials don't match.
      setError(err.status === 401 ? "That email and password don't match a registered student." : err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <h1>Log in</h1>
      <p className="lead">Use the email and password you registered with.</p>
      <form onSubmit={onSubmit} className="form" noValidate>
        <Notice>{error}</Notice>
        <label>
          Email
          <input type="email" autoComplete="username" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="firstname.lastname@university.com" />
        </label>
        <label>
          Password
          <div className="password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                  <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                  <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                  <line x1="2" y1="2" x2="22" y2="22" />
                </svg>
              )}
            </button>
          </div>
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <p className="muted">
        New student? <Link to="/register" className="textlink">Create an account</Link>
      </p>
    </section>
  );
}
