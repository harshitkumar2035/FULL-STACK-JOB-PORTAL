const Job = require("../models/Job");
const Application = require("../models/Application");

const createJob = async (req, res) => {
    try{
        if (req.user.role !== "recruiter") {
            return res.status(403).json({ message: "Only recruiters can post jobs "});
        }

      const job = await Job.create({
        ...req.body,
        recruiter: req.user.id,
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
            type,
            location,
            salaryMin,
            salaryMax,
            experience,
            page = 1,
            limit = 10,
        } = req.query;

        const filter = { status: "active" };

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
     if (type) filter.type = type;
    if (location) filter.location = { $regex: location, $options: "i" };
    if (salaryMin || salaryMax) {
      filter["salary.min"] = {};
      if (salaryMin) filter["salary.min"].$gte = Number(salaryMin);
      if (salaryMax) filter["salary.min"].$lte = Number(salaryMax);
    }
    if (experience) filter["experience.min"] = { $lte: Number(experience) };

    
           const skip = (page - 1) * limit;

    const jobs = await Job.find(filter)
      .populate("recruiter", "name email profile.company")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const applyJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if already applied
    const existingApp = await Application.findOne({
      job: job.id,
      applicant: req.user.id,
    });
    if (existingApp) {
      return res.status(400).json({ message: "Already applied" });
    }

    const application = await Application.create({
      job: job.id,
      applicant: req.user.id,
      resume: req.body.resume,
      coverLetter: req.body.coverLetter,
    });

    // Add application to job
    job.applications.push(application.id);
    await job.save();

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });

    }

};

module.exports = { createJob, getJobs, applyJob};
