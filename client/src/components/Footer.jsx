import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer style={{
      background: "var(--bg-surface)",
      borderTop: "1px solid var(--border-glass)",
      padding: "60px 0 30px 0",
      marginTop: "auto",
      boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.02)"
    }}>
      <div className="container">
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "40px",
          marginBottom: "40px"
        }}>
          <div>
            <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "1.4rem", fontWeight: "800", marginBottom: "16px" }}>
              <span style={{
                width: "32px", height: "32px", background: "linear-gradient(135deg, var(--primary), var(--accent))", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1rem", color: "#ffffff"
              }}>⚡</span>
              <span>Job<span style={{ color: "var(--primary)" }}>Sphere</span></span>
            </Link>
            <p style={{ color: "var(--text-sub)", fontSize: "0.9rem", lineHeight: "1.6" }}>
              Connecting world-class talent with high-growth companies. Explore tech, design, marketing, and remote opportunities worldwide.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginBottom: "16px" }}>For Jobseekers</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "var(--text-sub)" }}>
              <li><Link to="/jobs">Browse All Jobs</Link></li>
              <li><Link to="/jobs?type=remote">Remote Jobs</Link></li>
              <li><Link to="/dashboard">Application Tracker</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginBottom: "16px" }}>For Employers</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.9rem", color: "var(--text-sub)" }}>
              <li><Link to="/post-job">Post a Job</Link></li>
              <li><Link to="/applications">Recruiter Dashboard</Link></li>
              <li><Link to="/register">Create Employer Account</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: "1rem", color: "var(--text-main)", marginBottom: "16px" }}>Platform</h4>
            <p style={{ color: "var(--text-sub)", fontSize: "0.9rem", marginBottom: "12px" }}>
              Built with MERN Stack (MongoDB, Express, React, Node.js).
            </p>
            <span className="badge badge-shortlisted">100% Verified Portal</span>
          </div>
        </div>

        <div style={{
          borderTop: "1px solid var(--border-glass)",
          paddingTop: "24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "0.85rem",
          color: "var(--text-muted)"
        }}>
          <div>© {new Date().getFullYear()} JobSphere Inc. All rights reserved.</div>
          <div>Designed with Modern Light Aesthetics</div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;