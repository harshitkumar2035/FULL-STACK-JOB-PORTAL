const express = require("express");
const router = express.Router();
const {
  createJob,
  getJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");
const { protect, authorize } = require("../middleware/auth");

router.get("/", getJobs);
router.get("/recruiter/my-jobs", protect, authorize("recruiter", "admin"), getRecruiterJobs);
router.get("/:id", getJobById);
router.post("/", protect, authorize("recruiter", "admin"), createJob);
router.put("/:id", protect, authorize("recruiter", "admin"), updateJob);
router.delete("/:id", protect, authorize("recruiter", "admin"), deleteJob);

module.exports = router;
