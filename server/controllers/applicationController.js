const Application = require("../models/Application");
const Job = require("../models/Job");

const getApplication= async (req, res)=> {
    try {
        let applications;

        if (req.user.role === "recruiter") {
            const jobs = await job.find({ recruiter: req.use.id}).select("_id");
            const jobIds = jobs.map((j) => j._id);

            application = await Application.find({ job: { $in: jobIds}})
               .populate("application", "name eamil profile")
               .populatie("job", "title location");
        } else if (req.user.role == "jobseeker") {
            applications = await Application.find({ job: { $in: jobIds}})
                   .populate("job", "title location company")
        .populate({
          path: "job",
          populate: { path: "recruiter", select: "name email" },
        });
    }

    res.json(applications);
        }  catch (error) {
            res.status(500).json({ message: error.message});
        }
    };


    const updateApplicationStatus = async (req, res) => {
        try {
            const application = await Application.findById(req.params.id)
            .populate({
                path: "job",
                select:"recruiter",
            });
            if (!application) {
                return res.status(404).json({message: "Application not found"});
            }

            if(application.job.recruiter.toString() !== req.user.id) {
                return res.status(403).json({message: "Not authorized"});
            }

                application.status = req.body.status;
    application.recruiterNotes = req.body.notes || application.recruiterNotes;
    await application.save();

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {getApplication, updateApplicationStatus};
    