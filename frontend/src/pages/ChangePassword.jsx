import { useState } from "react";
import { Link } from "react-router-dom";
import { api, passwordChecks } from "../api.js";
import { useAuth } from "../auth.jsx";
import Notice from "../components/Notice.jsx";

export default function ChangePassword() {
  const { student } = useAuth();
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState("");
  const [busy, setBusy] = useState(false);

  const checks = passwordChecks(pwd);
  const pwdOk = checks.every((c) => c.ok);

  async function onSubmit(e) {
    e.preventDefault();
    setDone("");
    if (!pwdOk) return setError("Your new password doesn't meet the rules below.");
    if (pwd !== confirm) return setError("The two passwords don't match.");
    setBusy(true);
    setError("");
    try {
      await api.changePassword(student.id, pwd);
      setDone("Password changed.");
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
          New password
          <input type="password" autoComplete="new-password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
          <ul className="rules">
            {checks.map((c) => (
              <li key={c.text} className={pwd ? (c.ok ? "ok" : "bad") : ""}>{c.text}</li>
            ))}
          </ul>
        </label>
        <label>
          Confirm new password
          <input type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Changing…" : "Change password"}</button>
      </form>
    </section>
  );
}
