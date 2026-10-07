import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { api, cleanGrade, MAX_SUBJECTS } from "../api.js";
import { useAuth } from "../auth.jsx";
import Notice from "../components/Notice.jsx";
import { fmtAvg } from "../components/StudentRow.jsx";

export default function StudentDashboard() {
  const { student, setStudent, logout } = useAuth();
  const location = useLocation();
  const [error, setError] = useState("");
  const [info, setInfo] = useState(location.state?.welcome ? "Account created. Welcome to UniApp." : "");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const fresh = await api.getStudent(student.id);
      setStudent(fresh);
    } catch (err) {
      if (err.status === 404) logout(); // student was removed by an admin
      else setError(err.message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [student?.id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (!student) return null;
  const subjects = student.subjects || [];
  const full = subjects.length >= MAX_SUBJECTS;
  const overall = cleanGrade(student.grade);

  async function enrol() {
    if (full) {
      // Story 304: enrolment limit.
      setError(`You're already enrolled in ${MAX_SUBJECTS} subjects. Remove one to enrol in another.`);
      return;
    }
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await api.enrol(student.id);
      await refresh();
      setInfo("Enrolled in a new subject.");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(code) {
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await api.removeSubject(student.id, code);
      await refresh();
      setInfo(`Removed subject ${code}.`);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const slots = Array.from({ length: MAX_SUBJECTS }, (_, i) => subjects[i] || null);

  return (
    <>
      <section className="dash-head">
        <div>
          <h1>{student.name}</h1>
          <p className="muted">
            Student ID {student.id} · {student.email}
          </p>
          <div className="actions">
            <button className="btn btn-primary" onClick={enrol} disabled={busy || full}>
              Enrol in a subject
            </button>
            <Link to="/student/password" className="btn">Change password</Link>
          </div>
        </div>
        <div className={`overall ${overall ? `band-${overall}` : "band-none"}`}>
          <span className="overall-grade">{overall || "–"}</span>
          <span className="overall-avg">
            {subjects.length ? `Average ${fmtAvg(student.average)}` : "No subjects yet"}
          </span>
          {subjects.length > 0 && (
            <span className="overall-status">{student.passed ? "Passing" : "Not passing"}</span>
          )}
        </div>
      </section>

      <Notice>{error}</Notice>
      <Notice kind="ok">{info}</Notice>

      <section>
        <div className="section-title">
          <h2>Enrolment</h2>
          <span className="muted">{subjects.length} of {MAX_SUBJECTS} subjects</span>
        </div>
        <div className="slots">
          {slots.map((s, i) =>
            s ? (
              <article key={s.code} className={`slot slot-filled band-${cleanGrade(s.grade)}`}>
                <span className="slot-code">Subject {s.code}</span>
                <span className="slot-grade">{cleanGrade(s.grade)}</span>
                <span className="slot-mark">Mark {s.mark}</span>
                <button className="btn btn-quiet btn-small" onClick={() => remove(s.code)} disabled={busy}>
                  Remove
                </button>
              </article>
            ) : (
              <button key={`empty-${i}`} className="slot slot-empty slot-action" onClick={enrol} disabled={busy}>
                <span className="slot-code">Free slot</span>
                <span className="muted small">Enrol in a subject</span>
              </button>
            )
          )}
        </div>
        {full && <p className="muted small">You've reached the four-subject limit.</p>}
      </section>
    </>
  );
}
