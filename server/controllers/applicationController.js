const Application = require("../models/Application");
const Job = require("../models/Job");

const applyJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply for jobs" });
    }

    const { jobId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });
    if (existingApp) {
      return res.status(400).json({ message: "You have already applied for this job" });
    }

    const resumeFile = req.file
      ? `/uploads/${req.file.filename}`
      : resumeUrl || req.user.profile?.resume || "default-resume.pdf";

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      resume: resumeFile,
      coverLetter: coverLetter || "",
      status: "pending",
    });

    job.applications.push(application._id);
    await job.save();

    const populatedApp = await Application.findById(application._id)
      .populate("job", "title company location type salary")
      .populate("applicant", "name email profile");

    res.status(201).json(populatedApp);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        populate: { path: "recruiter", select: "name email profile" },
      })
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobApplications = async (req, res) => {
  try {
    let applications;

    if (req.user.role === "recruiter" || req.user.role === "admin") {
      if (req.params.jobId) {
        applications = await Application.find({ job: req.params.jobId })
          .populate("applicant", "name email profile")
          .populate("job", "title company location");
      } else {
        const recruiterJobs = await Job.find({ recruiter: req.user._id }).select("_id");
        const jobIds = recruiterJobs.map((j) => j._id);

        applications = await Application.find({ job: { $in: jobIds } })
          .populate("applicant", "name email profile")
          .populate("job", "title company location type")
          .sort({ createdAt: -1 });
      }
    } else {
      applications = await Application.find({ applicant: req.user._id })
        .populate("job", "title company location type")
        .sort({ createdAt: -1 });
    }

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ["pending", "reviewed", "shortlisted", "rejected", "hired"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const application = await Application.findById(req.params.id).populate({
      path: "job",
      select: "recruiter title",
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (
      application.job.recruiter.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized to update status" });
    }

    application.status = status;
    if (notes !== undefined) {
      application.recruiterNotes = notes;
    }
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
};