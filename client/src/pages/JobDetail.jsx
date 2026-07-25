import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ApplyModal from "../components/ApplyModal";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    try {
      const { data } = await api.get(`/jobs/${id}`);
      setJob(data);

      if (user && data.applications) {
        const applied = data.applications.some(
          (app) => app.applicant?._id === user._id || app.applicant === user._id
        );
        setHasApplied(applied);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    if (user.role !== "jobseeker") {
      alert("Only job seekers can apply for jobs.");
      return;
    }
    setShowApplyModal(true);
  };

  if (loading) return <div className="spinner"></div>;
  if (error || !job) return (
    <div className="container" style={{ padding: "60px 0", textAlign: "center" }}>
      <h2>Job Not Found</h2>
      <p style={{ color: "var(--text-sub)", marginBottom: "20px" }}>{error}</p>
      <Link to="/jobs" className="btn btn-primary">Back to Jobs</Link>
    </div>
  );

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Competitive Salary";
    const minStr = salary.min ? `₹${(salary.min / 100000).toFixed(1)} Lakhs` : "";
    const maxStr = salary.max ? `₹${(salary.max / 100000).toFixed(1)} Lakhs` : "";
    if (minStr && maxStr) return `${minStr} - ${maxStr} per annum`;
    return minStr ? `Starting from ${minStr}` : `Up to ${maxStr}`;
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 24px" }}>
      <Link to="/jobs" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--primary)", marginBottom: "24px", fontSize: "0.9rem", fontWeight: "600" }}>
        ← Back to all jobs
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "32px" }}>
        {/* Main Job Content */}
        <div>
          <div className="glass-panel" style={{ padding: "36px", marginBottom: "32px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <span style={{ fontSize: "1rem", fontWeight: "700", color: "var(--primary)" }}>{job.company}</span>
                <h1 style={{ fontSize: "2.2rem", fontWeight: "800", margin: "6px 0 12px 0" }}>{job.title}</h1>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.9rem", color: "var(--text-sub)" }}>
                  <span>📍 {job.location}</span>
                  <span>💼 {job.type}</span>
                  <span>🏢 {job.locationType}</span>
                  <span>💰 {formatSalary(job.salary)}</span>
                </div>
              </div>

              <div>
                {hasApplied ? (
                  <button className="btn btn-secondary" disabled>
                    ✓ Applied Already
                  </button>
                ) : (
                  <button onClick={handleApplyClick} className="btn btn-primary btn-lg">
                    Apply Now 🚀
                  </button>
                )}
              </div>
            </div>

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <div style={{ borderTop: "1px solid var(--border-glass)", paddingTop: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {job.skills.map((skill, i) => (
                  <span key={i} className="badge badge-tag" style={{ fontSize: "0.85rem", padding: "6px 14px" }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="glass-panel" style={{ padding: "36px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "16px" }}>About the Role</h3>
            <p style={{ color: "var(--text-sub)", lineHeight: "1.7", whiteSpace: "pre-line", marginBottom: "28px" }}>
              {job.description}
            </p>

            {/* Key Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "14px" }}>Key Responsibilities</h3>
                <ul style={{ paddingLeft: "20px", color: "var(--text-sub)", lineHeight: "1.8" }}>
                  {job.responsibilities.map((res, i) => (
                    <li key={i}>{res}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "14px" }}>Requirements & Qualifications</h3>
                <ul style={{ paddingLeft: "20px", color: "var(--text-sub)", lineHeight: "1.8" }}>
                  {job.requirements.map((req, i) => (
                    <li key={i}>{req}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Summary */}
        <div>
          <div className="glass-panel" style={{ padding: "28px", position: "sticky", top: "100px" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: "700", marginBottom: "20px" }}>Job Summary</h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", fontSize: "0.95rem" }}>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block" }}>Company</span>
                <strong>{job.company}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block" }}>Location</span>
                <strong>{job.location} ({job.locationType})</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block" }}>Employment Type</span>
                <strong style={{ textTransform: "capitalize" }}>{job.type}</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block" }}>Experience Required</span>
                <strong>{job.experience?.min || 0} - {job.experience?.max || 5} Years</strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.85rem", display: "block" }}>Posted Date</span>
                <strong>{new Date(job.createdAt).toLocaleDateString()}</strong>
              </div>
            </div>

            <div style={{ marginTop: "28px" }}>
              {hasApplied ? (
                <button className="btn btn-secondary" style={{ width: "100%" }} disabled>
                  ✓ Applied Already
                </button>
              ) : (
                <button onClick={handleApplyClick} className="btn btn-primary" style={{ width: "100%" }}>
                  Apply Now 🚀
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyModal
          job={job}
          onClose={() => setShowApplyModal(false)}
          onSuccess={() => {
            setShowApplyModal(false);
            setHasApplied(true);
            alert("Application submitted successfully!");
          }}
        />
      )}
    </div>
  );
}

export default JobDetail;
