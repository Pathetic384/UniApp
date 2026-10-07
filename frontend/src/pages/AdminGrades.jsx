import { useEffect, useState } from "react";
import { api, cleanGrade, GRADES } from "../api.js";
import AdminNav from "../components/AdminNav.jsx";
import Notice from "../components/Notice.jsx";
import { StudentList } from "../components/StudentRow.jsx";

// Accepts either { HD: [...], D: [...] } or [{ grade, students }].
function normalise(data) {
  const out = {};
  if (Array.isArray(data)) {
    data.forEach((g) => (out[cleanGrade(g.grade)] = g.students || []));
  } else if (data && typeof data === "object") {
    Object.entries(data).forEach(([k, v]) => (out[cleanGrade(k)] = v || []));
  }
  return out;
}

export default function AdminGrades() {
  const [groups, setGroups] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.groupByGrade().then((d) => setGroups(normalise(d))).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <AdminNav />
      <Notice>{error}</Notice>
      <div className="section-title">
        <h2>Students by grade</h2>
        <span className="muted">Based on each student's average mark</span>
      </div>
      {groups && (
        <div className="grade-groups">
          {GRADES.map((g) => {
            const list = groups[g.code] || [];
            return (
              <section key={g.code} className={`grade-group band-${g.code}`}>
                <header>
                  <span className="gg-letter">{g.code}</span>
                  <div>
                    <h3>{g.label}</h3>
                    <span className="muted small">Average {g.range} · {list.length} {list.length === 1 ? "student" : "students"}</span>
                  </div>
                </header>
                <StudentList students={list} />
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
