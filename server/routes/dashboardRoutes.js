const express = require("express");
const router = express.Router();
const {
  getRecruiterStats,
  getJobseekerStats,
} = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/auth");

router.get("/recruiter", protect, authorize("recruiter", "admin"), getRecruiterStats);
router.get("/jobseeker", protect, authorize("jobseeker"), getJobseekerStats);

module.exports = router;
