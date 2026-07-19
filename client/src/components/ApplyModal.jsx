import { useState } from "react";
import axios from "axios";

const ApplyModal = ({ job, isOpen, onClose }) => {
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Upload resume first
      const formData = new FormData();
      formData.append("file", resume);

      const { data: uploadData } = await axios.post(
        "/api/upload/resume",
        formData
      );

      // Submit application
      await axios.post(`/api/jobs/${job._id}/apply`, {
        resume: uploadData.url,
        coverLetter,
      });

      alert("Application submitted successfully!");
      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Error applying");
    } finally {
      setSubmitting(false);
    }
  };

  return isOpen ? (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-2">{job.title}</h2>
        <p className="text-gray-500 mb-6">{job.company}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Resume *</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Cover Letter
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              className="w-full border rounded px-3 py-2"
              placeholder="Why are you a good fit for this role?"
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};

export default ApplyModal;