const Job = require("../models/Job");
const Application = require("../models/application");

const getRecruiterStats = async (req, res) => {
  try {
    const recruiterId = req.user._id;

    const jobs = await Job.find({ recruiter: recruiterId });
    const jobIds = jobs.map((j) => j._id);

    const activeJobs = jobs.filter((j) => j.status === "active").length;

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "name email profile")
      .populate("job", "title company")
      .sort({ createdAt: -1 });

    const totalApplications = applications.length;
    const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
    const hired = applications.filter((a) => a.status === "hired").length;
    const pending = applications.filter((a) => a.status === "pending").length;

    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyApplications = applications.filter((a) => new Date(a.createdAt) >= oneWeekAgo).length;

    res.json({
      activeJobs,
      totalJobs: jobs.length,
      totalApplications,
      shortlisted,
      hired,
      pending,
      weeklyApplications,
      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobseekerStats = async (req, res) => {
  try {
    const applicantId = req.user._id;

    const applications = await Application.find({ applicant: applicantId })
      .populate("job", "title company location type salary status")
      .sort({ createdAt: -1 });

    const totalApplications = applications.length;
    const shortlisted = applications.filter((a) => a.status === "shortlisted").length;
    const hired = applications.filter((a) => a.status === "hired").length;
    const pending = applications.filter((a) => a.status === "pending").length;
    const rejected = applications.filter((a) => a.status === "rejected").length;

    res.json({
      totalApplications,
      shortlisted,
      hired,
      pending,
      rejected,
      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getRecruiterStats,
  getJobseekerStats,
};
