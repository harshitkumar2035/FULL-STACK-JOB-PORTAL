const Job = require("../models/Job");

const createJob = async (req, res) => {
  try {
    if (req.user.role !== "recruiter" && req.user.role !== "admin") {
      return res.status(403).json({ message: "Only recruiters can post jobs" });
    }

    const {
      title,
      company,
      description,
      requirements,
      responsibilities,
      skills,
      category,
      salaryMin,
      salaryMax,
      currency,
      location,
      locationType,
      type,
      experienceMin,
      experienceMax,
    } = req.body;

    const job = await Job.create({
      title,
      company: company || req.user.profile?.company || "Company",
      description,
      requirements: Array.isArray(requirements)
        ? requirements
        : typeof requirements === "string"
        ? requirements.split("\n").filter(Boolean)
        : [],
      responsibilities: Array.isArray(responsibilities)
        ? responsibilities
        : typeof responsibilities === "string"
        ? responsibilities.split("\n").filter(Boolean)
        : [],
      skills: Array.isArray(skills)
        ? skills
        : typeof skills === "string"
        ? skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      category: category || "Technology",
      salary: {
        min: Number(salaryMin) || 0,
        max: Number(salaryMax) || 0,
        currency: currency || "INR",
      },
      location,
      locationType: locationType || "on-site",
      type: type || "full-time",
      experience: {
        min: Number(experienceMin) || 0,
        max: Number(experienceMax) || 5,
      },
      recruiter: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobs = async (req, res) => {
  try {
    const {
      search,
      category,
      type,
      locationType,
      location,
      salaryMin,
      salaryMax,
      experience,
      page = 1,
      limit = 12,
    } = req.query;

    const filter = { status: "active" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") filter.category = category;
    if (type && type !== "All") filter.type = type;
    if (locationType && locationType !== "All") filter.locationType = locationType;

    if (location) filter.location = { $regex: location, $options: "i" };

    if (salaryMin || salaryMax) {
      filter["salary.max"] = {};
      if (salaryMin) filter["salary.max"].$gte = Number(salaryMin);
      if (salaryMax) filter["salary.max"].$lte = Number(salaryMax);
    }

    if (experience) {
      filter["experience.min"] = { $lte: Number(experience) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(filter)
      .populate("recruiter", "name email profile")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)) || 1,
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("recruiter", "name email profile")
      .populate({
        path: "applications",
        populate: { path: "applicant", select: "name email profile" },
      });

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecruiterJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ recruiter: req.user._id })
      .populate("applications")
      .sort({ createdAt: -1 });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.recruiter.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Job removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
};
