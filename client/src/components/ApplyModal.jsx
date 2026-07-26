import { useState } from "react";
import api from "../services/api";

function ApplyModal({ job, onClose, onSuccess }) {
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("coverLetter", coverLetter);
      if (resumeFile) {
        formData.append("resumeFile", resumeFile);
      } else if (resumeUrl) {
        formData.append("resumeUrl", resumeUrl);
      }

      await api.post(`/applications/apply/${job._id}`, formData, {
        headers: {
          "Content-Type": resumeFile ? "multipart/form-data" : "application/json",
        },
      });

      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit application");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(15, 23, 42, 0.45)",
      backdropFilter: "blur(8px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="glass-panel animate-fade-in" style={{ width: "100%", maxWidth: "550px", padding: "32px", position: "relative", background: "var(--bg-surface)", boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "20px",
            background: "none",
            border: "none",
            color: "var(--text-sub)",
            fontSize: "1.5rem",
            cursor: "pointer"
          }}
        >
          ×
        </button>

        <h2 style={{ fontSize: "1.4rem", fontWeight: "700", marginBottom: "4px" }}>
          Apply for {job.title}
        </h2>
        <p style={{ color: "var(--primary)", fontWeight: "600", fontSize: "0.95rem", marginBottom: "20px" }}>
          {job.company} • {job.location}
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Upload Resume (PDF / DOC / DOCX)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="form-input"
              onChange={(e) => setResumeFile(e.target.files[0])}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Or Resume URL (Google Drive / Portfolio link)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://drive.google.com/your-resume.pdf"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              disabled={!!resumeFile}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Letter / Introduction (Optional)</label>
            <textarea
              className="form-textarea"
              placeholder="Tell the recruiter why you are a great fit for this role..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
            />
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplyModal;