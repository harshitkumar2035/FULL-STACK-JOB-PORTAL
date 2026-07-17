const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "Job",
            required: true,
        },
        applicant: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
            required: true,
        },
        resume: {
            type: String,
            required: true,
        },
        coverletter: String,
        status: {
            type: String,
            enum: ["pending", "reviewed", "shortlisted", "rejected", "hired"],
            default: "pending",
        },
        recruiterNotes: String,
     },
     { timestamps: true}
    );
    
    applicationSchema.index({job: 1, applicant: 1}, { unique: true});
    module.exports = mongoose.model("Application", applicationSchema);
