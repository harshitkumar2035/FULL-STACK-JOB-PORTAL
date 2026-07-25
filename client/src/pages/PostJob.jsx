import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    category: "Technology",
    location: "",
    locationType: "on-site",
    type: "full-time",
    salaryMin: "",
    salaryMax: "",
    currency: "INR",
    experienceMin: 0,
    experienceMax: 5,
    skills: "",
    description: "",
    responsibilities: "",
    requirements: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/jobs", formData);
      alert("Job posted successfully!");
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job. Please check inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 24px", maxWidth: "800px" }}>
      <div className="glass-panel" style={{ padding: "36px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "8px" }}>Post a New Job Opportunity</h1>
        <p style={{ color: "var(--text-sub)", marginBottom: "28px" }}>
          Fill in the job details below to reach qualified candidates.
        </p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="e.g. Senior React Developer"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Company Name *</label>
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
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
                <option value="Sales">Sales</option>
                <option value="Management">Management</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Employment Type *</label>
              <select name="type" className="form-select" value={formData.type} onChange={handleChange}>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Workplace Policy</label>
              <select name="locationType" className="form-select" value={formData.locationType} onChange={handleChange}>
                <option value="on-site">On-Site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input
                type="text"
                name="location"
                className="form-input"
                placeholder="e.g. Bangalore, India"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Min Salary (INR / yr)</label>
              <input
                type="number"
                name="salaryMin"
                className="form-input"
                placeholder="800000"
                value={formData.salaryMin}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Max Salary (INR / yr)</label>
              <input
                type="number"
                name="salaryMax"
                className="form-input"
                placeholder="1500000"
                value={formData.salaryMax}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Required Skills (Comma separated)</label>
            <input
              type="text"
              name="skills"
              className="form-input"
              placeholder="React, Node.js, MongoDB, JavaScript"
              value={formData.skills}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Full Job Description *</label>
            <textarea
              name="description"
              className="form-textarea"
              placeholder="Describe the job role, goals, and team expectations..."
              value={formData.description}
              onChange={handleChange}
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Key Responsibilities (One per line)</label>
            <textarea
              name="responsibilities"
              className="form-textarea"
              placeholder="Develop clean backend APIs&#10;Lead code reviews&#10;Collaborate with product managers"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Requirements & Qualifications (One per line)</label>
            <textarea
              name="requirements"
              className="form-textarea"
              placeholder="3+ years experience with React&#10;Degree in CS or related field&#10;Strong communication skills"
              value={formData.requirements}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg"
            style={{ width: "100%", marginTop: "16px" }}
            disabled={loading}
          >
            {loading ? "Publishing Job..." : "Publish Job Opportunity 🚀"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
