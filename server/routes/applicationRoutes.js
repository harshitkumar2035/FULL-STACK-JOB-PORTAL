const express = require("express");
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post(
  "/apply/:jobId",
  protect,
  authorize("jobseeker"),
  upload.single("resumeFile"),
  applyJob
);

router.get("/my-applications", protect, authorize("jobseeker"), getMyApplications);
router.get("/job-applications", protect, getJobApplications);
router.get("/job-applications/:jobId", protect, getJobApplications);
router.put(
  "/:id/status",
  protect,
  authorize("recruiter", "admin"),
  updateApplicationStatus
);

module.exports = router;
