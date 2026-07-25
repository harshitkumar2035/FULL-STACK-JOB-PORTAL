import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="container animate-fade-in" style={{
      padding: "100px 24px",
      textAlign: "center",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div className="glass-panel" style={{ padding: "60px 40px", maxWidth: "500px" }}>
        <h1 style={{ fontSize: "5rem", color: "var(--primary)", lineHeight: "1" }}>404</h1>
        <h2 style={{ fontSize: "1.6rem", margin: "16px 0 8px 0" }}>Page Not Found</h2>
        <p style={{ color: "var(--text-sub)", marginBottom: "28px" }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className="btn btn-primary">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
}

export default NotFound;