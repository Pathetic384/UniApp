import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="form-page">
      <h1>This page doesn't exist</h1>
      <p className="lead">Check the address, or head back to the start.</p>
      <Link to="/" className="btn btn-primary">Go to home</Link>
    </section>
  );
}
