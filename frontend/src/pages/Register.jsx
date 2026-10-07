import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, EMAIL_RULE, passwordChecks } from "../api.js";
import { useAuth } from "../auth.jsx";
import Notice from "../components/Notice.jsx";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { setStudent } = useAuth();
  const navigate = useNavigate();

  const emailOk = EMAIL_RULE.test(email.trim());
  const checks = passwordChecks(password);
  const pwdOk = checks.every((c) => c.ok);

  async function onSubmit(e) {
    e.preventDefault();
    if (!emailOk || !pwdOk) {
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
        <Notice>{error}</Notice>
        <label>
          University email
          <input type="email" autoComplete="username" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="john.smith@university.com"
            aria-invalid={email ? !emailOk : undefined} />
          <span className={`rule ${email ? (emailOk ? "ok" : "bad") : ""}`}>
            Format: firstname.lastname@university.com
          </span>
        </label>
        <label>
          Password
          <input type="password" autoComplete="new-password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Helloworld123"
            aria-invalid={password ? !pwdOk : undefined} />
          <ul className="rules">
            {checks.map((c) => (
              <li key={c.text} className={password ? (c.ok ? "ok" : "bad") : ""}>{c.text}</li>
            ))}
          </ul>
        </label>
        <button className="btn btn-primary" disabled={busy}>{busy ? "Creating account…" : "Create account"}</button>
      </form>
      <p className="muted">
        Already registered? <Link to="/login" className="textlink">Log in</Link>
      </p>
    </section>
  );
}
