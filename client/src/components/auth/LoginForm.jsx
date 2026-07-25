import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./LoginForm.css";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-box glass-panel animate-fade-in">
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Welcome Back</h2>
        <p style={{ color: "var(--text-sub)", fontSize: "0.95rem" }}>
          Log in to manage applications or post jobs
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: "100%", marginTop: "12px" }}
          disabled={loading}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Demo Credentials Quick-Fill */}
      <div style={{ marginTop: "24px", paddingTop: "20px", borderTop: "1px solid var(--border-glass)", fontSize: "0.85rem" }}>
        <p style={{ color: "var(--text-muted)", marginBottom: "8px", fontWeight: "600" }}>Quick Demo Logins:</p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => { setEmail("jobseeker@example.com"); setPassword("123456"); }}
          >
            👤 Demo Jobseeker
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => { setEmail("recruiter@techcorp.com"); setPassword("123456"); }}
          >
            🏢 Demo Recruiter
          </button>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "var(--text-sub)" }}>
        Don't have an account?{" "}
        <Link to="/register" style={{ color: "var(--primary)", fontWeight: "600" }}>
          Sign up here
        </Link>
      </div>
    </div>
  );
}

export default LoginForm;