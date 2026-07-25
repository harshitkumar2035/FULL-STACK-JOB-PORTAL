import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

function Applications() {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

  useEffect(() => {
    fetchApplications();
  }, [user]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const endpoint = isRecruiter ? "/applications/job-applications" : "/applications/my-applications";
      const { data } = await api.get(endpoint);
      setApplications(data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      fetchApplications();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update application status");
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "8px" }}>
          {isRecruiter ? "Candidate Applications" : "My Submitted Applications"}
        </h1>
        <p style={{ color: "var(--text-sub)" }}>
          {isRecruiter
            ? "Review candidate profiles, download resumes, and update recruitment status."
            : "Monitor your job applications and recruiter feedback."}
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px" }}>
        {["all", "pending", "shortlisted", "hired", "rejected"].map((tab) => (
          <button
            key={tab}
            className={`btn btn-sm ${activeTab === tab ? "btn-primary" : "btn-secondary"}`}
            onClick={() => setActiveTab(tab)}
            style={{ textTransform: "capitalize" }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: "28px" }}>
        {filteredApplications.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📁</div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "6px" }}>No Applications Found</h3>
            <p style={{ color: "var(--text-sub)" }}>No applications match the selected status filter.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title & Company</th>
                  <th>{isRecruiter ? "Applicant Details" : "Job Location"}</th>
                  <th>Applied On</th>
                  <th>Resume</th>
                  <th>Status</th>
                  {isRecruiter && <th>Recruiter Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <Link to={`/jobs/${app.job?._id}`} style={{ fontWeight: "700", color: "var(--text-main)" }}>
                        {app.job?.title || "Job Title"}
                      </Link>
                      <div style={{ fontSize: "0.85rem", color: "var(--primary)" }}>{app.job?.company}</div>
                    </td>
                    <td>
                      {isRecruiter ? (
                        <div>
                          <strong>{app.applicant?.name}</strong>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-sub)" }}>{app.applicant?.email}</div>
                          {app.applicant?.profile?.phone && (
                            <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>📞 {app.applicant?.profile?.phone}</div>
                          )}
                        </div>
                      ) : (
                        <div>{app.job?.location} • {app.job?.type}</div>
                      )}
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      {app.resume ? (
                        <a
                          href={app.resume.startsWith("http") ? app.resume : `http://localhost:5000${app.resume}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary btn-sm"
                        >
                          📄 View Resume
                        </a>
                      ) : (
                        <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>No file</span>
                      )}
                    </td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    {isRecruiter && (
                      <td>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "shortlisted")}
                            className="btn btn-outline btn-sm"
                            disabled={app.status === "shortlisted"}
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "hired")}
                            className="btn btn-primary btn-sm"
                            disabled={app.status === "hired"}
                          >
                            Hire
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "rejected")}
                            className="btn btn-danger btn-sm"
                            disabled={app.status === "rejected"}
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Applications;