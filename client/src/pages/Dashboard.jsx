import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatusBadge from "../components/StatusBadge";

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      if (user?.role === "recruiter" || user?.role === "admin") {
        const { data } = await api.get("/dashboard/recruiter");
        setStats(data);
        setRecentApps(data.recentApplications || []);
      } else {
        const { data } = await api.get("/dashboard/jobseeker");
        setStats(data);
        setRecentApps(data.recentApplications || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      await api.put(`/applications/${appId}/status`, { status: newStatus });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  if (loading) return <div className="spinner"></div>;

  const isRecruiter = user?.role === "recruiter" || user?.role === "admin";

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 24px" }}>
      {/* Welcome Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", marginBottom: "32px" }}>
        <div>
          <span className="badge badge-shortlisted" style={{ marginBottom: "8px", textTransform: "uppercase" }}>
            {user?.role} Portal
          </span>
          <h1 style={{ fontSize: "2.2rem", fontWeight: "800" }}>
            Welcome back, <span className="gradient-text">{user?.name}</span> 👋
          </h1>
          <p style={{ color: "var(--text-sub)" }}>
            {isRecruiter
              ? "Manage your active job postings and candidate applications."
              : "Track your job applications and recruitment status in real time."}
          </p>
        </div>

        {isRecruiter && (
          <Link to="/post-job" className="btn btn-primary">
            + Post a New Job
          </Link>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Metrics Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "20px",
        marginBottom: "40px"
      }}>
        {isRecruiter ? (
          <>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Active Jobs</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--primary)", margin: "6px 0 0 0" }}>{stats?.activeJobs || 0}</h2>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Total Applications</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--text-main)", margin: "6px 0 0 0" }}>{stats?.totalApplications || 0}</h2>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Shortlisted Candidates</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--emerald)", margin: "6px 0 0 0" }}>{stats?.shortlisted || 0}</h2>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Hired Candidates</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--accent)", margin: "6px 0 0 0" }}>{stats?.hired || 0}</h2>
            </div>
          </>
        ) : (
          <>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Total Applied Jobs</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--primary)", margin: "6px 0 0 0" }}>{stats?.totalApplications || 0}</h2>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Under Review</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--amber)", margin: "6px 0 0 0" }}>{stats?.pending || 0}</h2>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Shortlisted</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--emerald)", margin: "6px 0 0 0" }}>{stats?.shortlisted || 0}</h2>
            </div>
            <div className="glass-card">
              <span style={{ fontSize: "0.85rem", color: "var(--text-sub)" }}>Hired Offers</span>
              <h2 style={{ fontSize: "2.2rem", color: "var(--accent)", margin: "6px 0 0 0" }}>{stats?.hired || 0}</h2>
            </div>
          </>
        )}
      </div>

      {/* Recent Activity Table */}
      <div className="glass-panel" style={{ padding: "28px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: "700" }}>
            {isRecruiter ? "Recent Candidate Applications" : "My Recent Applications"}
          </h3>
          <Link to="/applications" className="btn btn-secondary btn-sm">
            View All →
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <p style={{ color: "var(--text-sub)", textAlign: "center", padding: "30px 0" }}>
            No recent application activity found.
          </p>
        ) : (
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Job Title & Company</th>
                  <th>{isRecruiter ? "Applicant" : "Location / Type"}</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentApps.map((app) => (
                  <tr key={app._id}>
                    <td>
                      <strong>{app.job?.title || "Role"}</strong>
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{app.job?.company}</div>
                    </td>
                    <td>
                      {isRecruiter ? (
                        <div>
                          <strong>{app.applicant?.name}</strong>
                          <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{app.applicant?.email}</div>
                        </div>
                      ) : (
                        <div>{app.job?.location} • {app.job?.type}</div>
                      )}
                    </td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td>
                      <StatusBadge status={app.status} />
                    </td>
                    <td>
                      {isRecruiter ? (
                        <div style={{ display: "flex", gap: "6px" }}>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "shortlisted")}
                            className="btn btn-outline btn-sm"
                          >
                            Shortlist
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(app._id, "rejected")}
                            className="btn btn-danger btn-sm"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <Link to={`/jobs/${app.job?._id}`} className="btn btn-secondary btn-sm">
                          View Job
                        </Link>
                      )}
                    </td>
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

export default Dashboard;