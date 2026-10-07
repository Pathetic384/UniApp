import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../api.js";
import { useAuth } from "../auth.jsx";
import Notice from "../components/Notice.jsx";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            onChange={(e) => setEmail(e.target.value)} placeholder="john.smith@university.com" />
        </label>
        <label>
          Password
          <input type="password" autoComplete="current-password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Logging in…" : "Log in"}</button>
      </form>
      <p className="muted">
        New student? <Link to="/register" className="textlink">Create an account</Link>
      </p>
    </section>
  );
}
