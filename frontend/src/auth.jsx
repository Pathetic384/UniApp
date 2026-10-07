import { createContext, useContext, useState, useCallback } from "react";

// Keeps the logged-in student for this browser tab.
const AuthContext = createContext(null);
const KEY = "uniapp.student";

export function AuthProvider({ children }) {
  const [student, setStudentState] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem(KEY)) || null;
    } catch {
      return null;
    }
  });

  const setStudent = useCallback((s) => {
    setStudentState(s);
    try {
      if (s) sessionStorage.setItem(KEY, JSON.stringify(s));
      else sessionStorage.removeItem(KEY);
    } catch {
      /* storage unavailable: keep in memory only */
    }
  }, []);

  const logout = useCallback(() => setStudent(null), [setStudent]);

  return (
    <AuthContext.Provider value={{ student, setStudent, logout }}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
