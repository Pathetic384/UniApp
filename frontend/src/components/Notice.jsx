export default function Notice({ kind = "error", children }) {
  if (!children) return null;
  return (
    <div className={`notice notice-${kind}`} role={kind === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}
