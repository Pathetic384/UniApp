import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, EMAIL_RULE, passwordChecks } from "../api.js";
import { useAuth } from "../auth.jsx";
import Notice from "../components/Notice.jsx";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { setStudent } = useAuth();
  const navigate = useNavigate();

  const emailOk = EMAIL_RULE.test(email.trim());
  const checks = passwordChecks(password);
  const pwdOk = checks.every((c) => c.ok);

  async function onSubmit(e) {
    e.preventDefault();
    if (!email.trim() && !password) {
      setError("Enter both your email and password to create an account.");
      return;
    }
    if (!email.trim()) {
      setError("Enter your university email to create an account.");
      return;
    }
    if (!emailOk && !pwdOk) {
      setError("Incorrect email format (must be firstname.lastname@university.com) and password rules not met.");
      return;
    }
    if (!emailOk) {
      setError("Incorrect email format. Must be firstname.lastname@university.com");
      return;
    }
    if (!pwdOk) {
      setError("Fix the highlighted rules before creating your account.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const student = await api.register(email.trim(), password);
      if (student?.id) {
        setStudent(student);
        navigate("/student", { state: { welcome: true } });
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <h1>Create a student account</h1>
      <p className="lead">Your name is taken from your email, and a 6-digit student ID is assigned for you.</p>
      <form onSubmit={onSubmit} className="form" noValidate>
        <label>
          University email
          <input type="email" autoComplete="username" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="firstname.lastname@university.com"
            aria-invalid={!emailOk && (error || email) ? "true" : undefined} />
        </label>
        <label>
          Password
          <div className="password-wrap">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Helloworld123"
              aria-invalid={password ? !pwdOk : undefined}
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
        {error && (
          <Notice>
            <div>{error}</div>
            {error.includes("rules") && (
              <ul className="rules" style={{ marginTop: ".5rem" }}>
                {checks.map((c) => (
                  <li key={c.text} className={c.ok ? "ok" : "bad"}>{c.text}</li>
                ))}
              </ul>
            )}
          </Notice>
        )}
        <button className="btn btn-primary" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="muted">
        Already registered? <Link to="/login" className="textlink">Log in</Link>
      </p>
    </section>
  );
}
