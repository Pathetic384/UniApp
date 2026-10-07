import { useEffect, useState } from "react";
import { api } from "../api.js";
import AdminNav from "../components/AdminNav.jsx";
import Notice from "../components/Notice.jsx";
import { GradeChip } from "../components/GradeMark.jsx";
import { fmtAvg } from "../components/StudentRow.jsx";

export default function AdminStudents() {
  const [students, setStudents] = useState(null);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [pendingRemove, setPendingRemove] = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);

  async function load() {
    try {
      setStudents(await api.listStudents());
      setError("");
    } catch (err) {
      setError(err.message);
      setStudents([]);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function remove(sid) {
    try {
      await api.removeStudent(sid);
      setInfo(`Removed student ${sid}.`);
      setPendingRemove(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function clearAll() {
    try {
      await api.clearAll();
      setInfo("Cleared all student records.");
      setConfirmClear(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
      <AdminNav />
      <Notice>{error}</Notice>
      <Notice kind="ok">{info}</Notice>

      <div className="section-title">
        <h2>All students</h2>
        <span className="muted">{students ? `${students.length} registered` : "Loading…"}</span>
      </div>

      {students && students.length === 0 && !error && (
        <p className="empty">No students are registered yet. New students appear here once they create an account.</p>
      )}

      {students && students.length > 0 && (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th className="num">Subjects</th>
                <th className="num">Average</th>
                <th>Grade</th>
                <th>Status</th>
                <th><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id}>
                  <td className="mono">{s.id}</td>
                  <td>{s.name}</td>
                  <td className="muted">{s.email}</td>
                  <td className="num">{s.subjects?.length ?? 0}</td>
                  <td className="num">{fmtAvg(s.average)}</td>
                  <td><GradeChip grade={s.grade} /></td>
                  <td>{s.subjects?.length ? (s.passed ? "Pass" : "Fail") : "–"}</td>
                  <td className="row-actions">
                    {pendingRemove === s.id ? (
                      <>
                        <button className="btn btn-danger btn-small" onClick={() => remove(s.id)}>Remove</button>
                        <button className="btn btn-quiet btn-small" onClick={() => setPendingRemove(null)}>Cancel</button>
                      </>
                    ) : (
                      <button className="btn btn-quiet btn-small" onClick={() => setPendingRemove(s.id)}>Remove</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <section className="danger-zone">
        <h2>Clear database</h2>
        <p className="muted">Deletes every student and enrolment in students.data. This can't be undone.</p>
        {confirmClear ? (
          <div className="actions">
            <button className="btn btn-danger" onClick={clearAll}>Clear all students</button>
            <button className="btn" onClick={() => setConfirmClear(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn" onClick={() => setConfirmClear(true)} disabled={!students?.length}>
            Clear database
          </button>
        )}
      </section>
    </>
  );
}
