import { Link } from "react-router-dom";
import { GRADES } from "../api.js";
import { useAuth } from "../auth.jsx";
import studyGroup from "../assets/study-group.jpg";
import studentLibrary from "../assets/student-library.jpg";
import tutorHelp from "../assets/adminlor.avif";
import "./Home.css";

const DEMO = [
  { code: "042", mark: 88, grade: "HD" },
  { code: "317", mark: 71, grade: "C" },
  { code: "905", mark: 56, grade: "P" },
  null,
];

export default function Home() {
  const { student } = useAuth();
  const studentLink = student ? "/student" : "/login";

  return (
    <div className="home">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero-copy">
          <h1>Your subjects, marks and grades in one place.</h1>
          <p className="lead">
            Register with your university email, enrol in up to four subjects, and see the
            mark and grade for each one as soon as you add it.
          </p>
        </div>

        <figure className="home-hero-media">
          <img src={studyGroup} alt="Four students working together around laptops and textbooks" />
        </figure>
      </section>

      {/* Students */}
      <section className="home-row">
        <img className="home-row-img" src={studentLibrary} alt="A student writing notes at a library desk" />
        <div className="home-row-copy">
          <h2>For students</h2>
          <ol className="home-steps">
            <li>
              <strong>Register</strong>
              <span>Use your <code>firstname.lastname@university.com</code> email. Your 6-digit student ID is created for you.</span>
            </li>
            <li>
              <strong>Enrol</strong>
              <span>Add up to four subjects. Each gets a subject code, a mark and a grade.</span>
            </li>
            <li>
              <strong>Keep track</strong>
              <span>See your average and whether you're passing. Remove subjects or change your password.</span>
            </li>
          </ol>
        </div>
      </section>

      {/* Admins */}
      <section className="home-row home-row-flip">
        <img className="home-row-img" src={tutorHelp} alt="A tutor helping two students at a laptop" />
        <div className="home-row-copy">
          <h2>For admins</h2>
          <p className="muted">
            See every registered student with their average and grade, then sort them the way you need.
          </p>
          <ul className="home-features">
            <li>Group students by grade, from HD to Z</li>
            <li>Split students into pass and fail</li>
            <li>Remove one student, or clear the whole database</li>
          </ul>
        </div>
      </section>

      {/* Grade scale */}
      <section className="scale">
        <h2>How marks become grades</h2>
        <ol className="scale-bar">
          {[...GRADES].reverse().map((g) => (
            <li key={g.code} className={`band-${g.code}`}>
              <strong>{g.code}</strong>
              <span>{g.label}</span>
              <span className="muted">{g.range}</span>
            </li>
          ))}
        </ol>
        <p className="muted small">
          A student passes when their average mark across enrolled subjects is 50 or more.
        </p>
      </section>
    </div>
  );
}
