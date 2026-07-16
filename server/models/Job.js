const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema(
    {
        title: { type: String, required: true},
        description: { type: String, required: True},
        requirements: [String],
        salary: {
            min: Number,
            max: Number,
            currency: { type: String, default: "INR"},
        },
        location: { type: String, required: true},
        type : {
            type: String,
            enum: ["full-time", "part-time", "contract", "internship"],
            required: true,
        },
        experience: {
            min: Number,
            max: Number,
        },
        recruiter: {
            type: mongoose.Schema.Types.ObjectID,
            ref: "User",
            required: true,
        },
        applications: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Application",
            },
        ],
        status: {
            type: String,
            enum: ["active", "closed", "draft"],
            default: "active",
        },
      },
      { timestamps : true}
);

module.exports = mongoose.model("Job", jobSchema);
