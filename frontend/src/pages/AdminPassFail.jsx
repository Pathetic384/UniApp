import { useEffect, useState } from "react";
import { api } from "../api.js";
import AdminNav from "../components/AdminNav.jsx";
import Notice from "../components/Notice.jsx";
import { StudentList } from "../components/StudentRow.jsx";

export default function AdminPassFail() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .partition()
      .then((d) => {
        const get = (k) => d?.[k] ?? d?.[k.toLowerCase()] ?? [];
        setData({ PASS: get("PASS"), FAIL: get("FAIL") });
      })
      .catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <AdminNav />
      <Notice>{error}</Notice>
      <div className="section-title">
        <h2>Pass and fail</h2>
        <span className="muted">Pass means an average mark of 50 or more</span>
      </div>
      {data && (
        <div className="split">
          <section className="panel pf pf-pass">
            <h3>Pass <span className="count">{data.PASS.length}</span></h3>
            <StudentList students={data.PASS} />
          </section>
          <section className="panel pf pf-fail">
            <h3>Fail <span className="count">{data.FAIL.length}</span></h3>
            <StudentList students={data.FAIL} />
          </section>
        </div>
      )}
    </>
  );
}
