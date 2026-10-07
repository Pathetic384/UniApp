import { useState } from "react";
import { Link } from "react-router-dom";
import { api, passwordChecks } from "../api.js";
import { useAuth } from "../auth.jsx";
import Notice from "../components/Notice.jsx";

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

export default function ChangePassword() {
  const { student } = useAuth();
  const [currentPwd, setCurrentPwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, setBusy] = useState(false);

  const checks = passwordChecks(pwd);
  const pwdOk = checks.every((c) => c.ok);

  async function onSubmit(e) {
    e.preventDefault();
    setDone("");
    if (!currentPwd) return setError("Please enter your current password.");
    if (!pwdOk) return setError("Your new password doesn't meet the rules below.");
    if (pwd !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await api.changePassword(student.id, currentPwd, pwd);
      setDone("Password changed.");
      setCurrentPwd("");
      setPwd("");
      setConfirm("");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="form-page">
      <Link to="/student" className="textlink small">Back to my enrolment</Link>
      <h1>Change password</h1>
      <form onSubmit={onSubmit} className="form" noValidate>
        <Notice>{error}</Notice>
        <Notice kind="ok">{done}</Notice>
        <label>
          Current password
          <div className="password-wrap">
            <input
              type={showCurrent ? "text" : "password"}
              autoComplete="current-password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowCurrent((v) => !v)}
              aria-label={showCurrent ? "Hide password" : "Show password"}
              title={showCurrent ? "Hide password" : "Show password"}
            >
              {showCurrent ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </label>
        <label>
          New password
          <div className="password-wrap">
            <input
              type={showNew ? "text" : "password"}
              autoComplete="new-password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowNew((v) => !v)}
              aria-label={showNew ? "Hide password" : "Show password"}
              title={showNew ? "Hide password" : "Show password"}
            >
              {showNew ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
          <ul className="rules">
            {checks.map((c) => (
              <li key={c.text} className={pwd ? (c.ok ? "ok" : "bad") : ""}>{c.text}</li>
            ))}
          </ul>
        </label>
        <label>
          Confirm new password
          <div className="password-wrap">
            <input
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
              title={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeIcon /> : <EyeOffIcon />}
            </button>
          </div>
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Changing…" : "Change password"}</button>
      </form>
    </section>
  );
}
