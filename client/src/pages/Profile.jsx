import { useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    skills: "",
    company: "",
    companyWebsite: "",
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await api.get("/users/profile");
      setFormData({
        name: data.name || "",
        email: data.email || "",
        phone: data.profile?.phone || "",
        location: data.profile?.location || "",
        title: data.profile?.title || "",
        bio: data.profile?.bio || "",
        skills: data.profile?.skills ? data.profile.skills.join(", ") : "",
        company: data.profile?.company || "",
        companyWebsite: data.profile?.companyWebsite || "",
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      if (resumeFile) {
        submitData.append("resumeFile", resumeFile);
      }

      const { data } = await api.put("/users/profile", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      updateUser(data);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to update profile" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="spinner"></div>;

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 24px", maxWidth: "700px" }}>
      <div className="glass-panel" style={{ padding: "36px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: "800", marginBottom: "6px" }}>User Profile</h1>
        <p style={{ color: "var(--text-sub)", marginBottom: "28px" }}>
          Manage your account details and professional info.
        </p>

        {message.text && (
          <div className={`alert ${message.type === "success" ? "alert-success" : "alert-error"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email (Read-only)</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                disabled
                style={{ opacity: 0.7 }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Location</label>
              <input
                type="text"
                name="location"
                className="form-input"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Professional Title / Headline</label>
            <input
              type="text"
              name="title"
              className="form-input"
              placeholder="e.g. Senior MERN Stack Engineer"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          {user?.role === "jobseeker" ? (
            <>
              <div className="form-group">
                <label className="form-label">Skills (Comma separated)</label>
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
                <label className="form-label">Upload Default Resume (PDF/DOC)</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="form-input"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
              </div>
            </>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input
                  type="text"
                  name="company"
                  className="form-input"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company Website</label>
                <input
                  type="url"
                  name="companyWebsite"
                  className="form-input"
                  value={formData.companyWebsite}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Bio / Summary</label>
            <textarea
              name="bio"
              className="form-textarea"
              placeholder="Brief overview of your experience and interests..."
              value={formData.bio}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "16px" }}
            disabled={saving}
          >
            {saving ? "Saving Changes..." : "Save Profile Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
