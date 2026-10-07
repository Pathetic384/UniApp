import { cleanGrade } from "../api.js";

// Small grade chip, coloured per grade band.
export function GradeChip({ grade }) {
  const g = cleanGrade(grade);
  if (!g) return <span className="chip chip-none">–</span>;
  return <span className={`chip grade-${g}`}>{g}</span>;
}
