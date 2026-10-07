// Thin client for the FastAPI backend (backend/api/main.py).
// In development, "/api" is proxied to http://127.0.0.1:8000 by vite.config.js.
const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the backend. Start the FastAPI server on port 8000 and try again.");
  }

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    // ApiError handler and FastAPI validation errors both use "detail".
    let msg = data?.detail ?? data?.message ?? `Request failed (${res.status})`;
    if (Array.isArray(msg)) msg = msg.map((d) => d.msg).join("; ");
    const err = new Error(String(msg));
    err.status = res.status;
    throw err;
  }
  return data;
}

// Some endpoints may wrap the student, e.g. { student: {...} }.
const unwrap = (d) => d?.student ?? d;

export const api = {
  // Student
  register: (email, password) =>
    request("/register", { method: "POST", body: { email, password } }).then(unwrap),
  login: (email, password) =>
    request("/login", { method: "POST", body: { email, password } }).then(unwrap),
  getStudent: (sid) => request(`/students/${sid}`).then(unwrap),
  listSubjects: (sid) => request(`/students/${sid}/subjects`),
  enrol: (sid) => request(`/students/${sid}/subjects`, { method: "POST" }),
  removeSubject: (sid, code) =>
    request(`/students/${sid}/subjects/${encodeURIComponent(code)}`, { method: "DELETE" }),
  changePassword: (sid, current_password, new_password) =>
    request(`/students/${sid}/password`, { method: "PUT", body: { current_password, new_password } }),

  // Admin
  listStudents: () => request("/admin/students"),
  groupByGrade: () => request("/admin/students/grouped"),
  partition: () => request("/admin/students/partition"),
  removeStudent: (sid) => request(`/admin/students/${sid}`, { method: "DELETE" }),
  clearAll: () => request("/admin/students", { method: "DELETE" }),
};

// Grade values may arrive as "HD" or "Grade.HD" depending on serialisation.
export const cleanGrade = (g) => (g == null ? "" : String(g).replace(/^Grade\./, "").toUpperCase());

export const GRADES = [
  { code: "HD", label: "High Distinction", range: "85–100" },
  { code: "D", label: "Distinction", range: "75–84" },
  { code: "C", label: "Credit", range: "65–74" },
  { code: "P", label: "Pass", range: "50–64" },
  { code: "Z", label: "Fail", range: "below 50" },
];

export const MAX_SUBJECTS = 4;

// Mirrors Student.validate_email / validate_password (business rules section 6).
export const EMAIL_RULE = /^[A-Za-z]+\.[A-Za-z]+@university\.com$/;
export const passwordChecks = (pwd) => [
  { ok: /^[A-Z]/.test(pwd), text: "Starts with an uppercase letter" },
  { ok: (pwd.match(/[A-Za-z]/g) || []).length >= 5, text: "At least 5 letters" },
  { ok: /[0-9]{3,}$/.test(pwd), text: "Ends with at least 3 digits" },
];
