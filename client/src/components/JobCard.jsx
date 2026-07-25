import { Link } from "react-router-dom";

function JobCard({ job }) {
  if (!job) return null;

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Competitive Salary";
    const minStr = salary.min ? `₹${(salary.min / 100000).toFixed(1)}L` : "";
    const maxStr = salary.max ? `₹${(salary.max / 100000).toFixed(1)}L` : "";
    if (minStr && maxStr) return `${minStr} - ${maxStr}/yr`;
    return minStr ? `From ${minStr}` : `Up to ${maxStr}`;
  };

  const getLocationBadgeClass = (type) => {
    if (type === "remote") return "badge-hired";
    if (type === "hybrid") return "badge-shortlisted";
    return "badge-pending";
  };

  return (
    <div className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "12px" }}>
          <div>
            <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--primary)" }}>{job.company || "Company"}</span>
            <h3 style={{ fontSize: "1.15rem", fontWeight: "700", margin: "4px 0", color: "var(--text-main)" }}>
              <Link to={`/jobs/${job._id}`}>{job.title}</Link>
            </h3>
          </div>
          <span className={`badge ${getLocationBadgeClass(job.locationType)}`}>
            {job.locationType || "on-site"}
          </span>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "0.85rem", color: "var(--text-sub)", marginBottom: "16px" }}>
          <span>📍 {job.location}</span>
          <span>💼 {job.type}</span>
          <span>💰 {formatSalary(job.salary)}</span>
          {job.experience?.min !== undefined && <span>⏳ {job.experience.min}+ yrs exp</span>}
        </div>

        <p style={{
          fontSize: "0.9rem",
          color: "var(--text-sub)",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          marginBottom: "16px",
          lineHeight: "1.5"
        }}>
          {job.description}
        </p>

        {job.skills && job.skills.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "20px" }}>
            {job.skills.slice(0, 4).map((skill, index) => (
              <span key={index} className="badge badge-tag">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="badge badge-tag">+{job.skills.length - 4}</span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid var(--border-glass)", paddingTop: "14px", marginTop: "auto" }}>
        <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
          Posted {new Date(job.createdAt).toLocaleDateString()}
        </span>
        <Link to={`/jobs/${job._id}`} className="btn btn-outline btn-sm">
          View Details →
        </Link>
      </div>
    </div>
  );
}

export default JobCard;