import { GradeChip } from "./GradeMark.jsx";

export const fmtAvg = (n) => (typeof n === "number" ? n.toFixed(2) : "–");

// Compact list used on the grouped and pass/fail admin views.
export function StudentList({ students }) {
  if (!students?.length) return <p className="muted">No students in this group.</p>;
  return (
    <ul className="student-list">
      {students.map((s) => (
        <li key={s.id}>
          <span className="sl-name">{s.name}</span>
          <span className="sl-id">{s.id}</span>
          <span className="sl-avg">{fmtAvg(s.average)}</span>
          <GradeChip grade={s.grade} />
        </li>
      ))}
    </ul>
  );
}
