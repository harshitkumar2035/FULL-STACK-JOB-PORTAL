import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    company: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await register(formData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 180px)", padding: "40px 24px" }}>
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "500px", padding: "36px" }}>
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={{ fontSize: "1.8rem", fontWeight: "800" }}>Create Your Account</h2>
          <p style={{ color: "var(--text-sub)", fontSize: "0.95rem" }}>
            Join thousands of professionals and hiring managers
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Role Switcher */}
          <div className="form-group">
            <label className="form-label">I want to:</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                className={`btn ${formData.role === "jobseeker" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setFormData((prev) => ({ ...prev, role: "jobseeker" }))}
              >
                👨‍💻 Find Jobs
              </button>
              <button
                type="button"
                className={`btn ${formData.role === "recruiter" ? "btn-primary" : "btn-secondary"}`}
                onClick={() => setFormData((prev) => ({ ...prev, role: "recruiter" }))}
              >
                🏢 Hire Talent
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              className="form-input"
              placeholder="e.g. Harshit Kumar"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password (min 6 chars)</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>

          {formData.role === "recruiter" && (
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                name="company"
                className="form-input"
                placeholder="e.g. Tech Corp Inc."
                value={formData.company}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input
              type="tel"
              name="phone"
              className="form-input"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "16px" }}
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account 🚀"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.9rem", color: "var(--text-sub)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
