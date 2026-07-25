const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    responsibilities: [{ type: String }],
    skills: [{ type: String }],
    category: {
      type: String,
      default: "Technology",
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
    },
    location: { type: String, required: true, trim: true },
    locationType: {
      type: String,
      enum: ["on-site", "remote", "hybrid"],
      default: "on-site",
    },
    type: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship"],
      required: true,
    },
    experience: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 5 },
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
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
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
