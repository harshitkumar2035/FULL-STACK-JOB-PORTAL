const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jobportal";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash("123456", salt);

    // Create Recruiter 1
    const recruiter1 = await User.create({
      name: "Tech Corp HR",
      email: "recruiter@techcorp.com",
      password: passwordHash,
      role: "recruiter",
      profile: {
        phone: "+91 9876543210",
        location: "Bangalore, India",
        title: "Senior Talent Acquisition Manager",
        company: "Tech Corp Inc.",
        companyWebsite: "https://techcorp.com",
      },
    });

    // Create Recruiter 2
    const recruiter2 = await User.create({
      name: "Design Studio Lead",
      email: "hr@designstudio.io",
      password: passwordHash,
      role: "recruiter",
      profile: {
        phone: "+91 9123456789",
        location: "Mumbai, India",
        title: "Head of People Operations",
        company: "Design Studio Labs",
        companyWebsite: "https://designstudio.io",
      },
    });

    // Create Jobseeker 1
    const jobseeker1 = await User.create({
      name: "Harshit Kumar",
      email: "jobseeker@example.com",
      password: passwordHash,
      role: "jobseeker",
      profile: {
        phone: "+91 9988776655",
        location: "Delhi NCR, India",
        title: "Full Stack MERN Developer",
        bio: "Passionate software developer specializing in React, Node.js, and MongoDB with 3+ years experience.",
        skills: ["React", "Node.js", "Express", "MongoDB", "JavaScript", "CSS3"],
        resume: "https://example.com/resumes/harshit-resume.pdf",
      },
    });

    // Create Jobseeker 2
    const jobseeker2 = await User.create({
      name: "Priya Sharma",
      email: "priya@example.com",
      password: passwordHash,
      role: "jobseeker",
      profile: {
        phone: "+91 9876123456",
        location: "Pune, India",
        title: "UI/UX & Product Designer",
        bio: "Creative designer focused on crafting engaging web and mobile user interfaces.",
        skills: ["Figma", "UI/UX", "CSS", "Wireframing", "Prototyping"],
        resume: "https://example.com/resumes/priya-resume.pdf",
      },
    });

    // Sample Jobs
    const jobs = await Job.insertMany([
      {
        title: "Senior Full Stack MERN Developer",
        company: "Tech Corp Inc.",
        description: "We are seeking an experienced MERN Stack Developer to build high-scale web applications. You will collaborate with cross-functional product teams to design, implement, and maintain microservices and user interfaces.",
        requirements: [
          "3+ years of experience with React, Node.js, and MongoDB",
          "Strong understanding of RESTful APIs, JWT authentication, and async workflows",
          "Proficiency in modern CSS, responsive layouts, and state management",
          "Experience with AWS, Docker, or CI/CD pipelines is a plus",
        ],
        responsibilities: [
          "Architect scalable backend APIs and responsive frontend interfaces",
          "Write clean, maintainable, and well-tested code",
          "Collaborate with product managers and designers to deliver core features",
        ],
        skills: ["React", "Node.js", "MongoDB", "Express", "JavaScript", "REST API"],
        category: "Technology",
        salary: { min: 1200000, max: 2000000, currency: "INR" },
        location: "Bangalore, India",
        locationType: "hybrid",
        type: "full-time",
        experience: { min: 3, max: 6 },
        recruiter: recruiter1._id,
        status: "active",
      },
      {
        title: "Lead UI/UX Product Designer",
        company: "Design Studio Labs",
        description: "Join our creative team to lead user experience strategy and craft beautiful visual designs for global tech brands.",
        requirements: [
          "4+ years designing web and mobile user interfaces",
          "Expert proficiency in Figma, design systems, and component libraries",
          "Strong portfolio demonstrating user research, wireframing, and interactive prototypes",
        ],
        responsibilities: [
          "Create user personas, journey maps, and high-fidelity mockups",
          "Build and maintain accessible, scalable design systems",
        ],
        skills: ["Figma", "UI Design", "UX Research", "Design Systems", "Prototyping"],
        category: "Design",
        salary: { min: 1500000, max: 2400000, currency: "INR" },
        location: "Remote",
        locationType: "remote",
        type: "full-time",
        experience: { min: 4, max: 8 },
        recruiter: recruiter2._id,
        status: "active",
      },
      {
        title: "Frontend Engineer (React / Next.js)",
        company: "Tech Corp Inc.",
        description: "Looking for a talented Frontend Engineer passionate about web performance, clean architecture, and responsive user interfaces.",
        requirements: [
          "2+ years experience building web apps with React.js",
          "Deep knowledge of HTML5, CSS3, JavaScript ES6+, and Tailwind/Vanilla CSS",
          "Familiarity with state management, API integration, and web performance optimization",
        ],
        responsibilities: [
          "Develop responsive, pixel-perfect user interfaces",
          "Integrate backend APIs and manage local component state",
        ],
        skills: ["React", "Next.js", "TypeScript", "CSS3", "HTML5"],
        category: "Technology",
        salary: { min: 800000, max: 1400000, currency: "INR" },
        location: "Hyderabad, India",
        locationType: "on-site",
        type: "full-time",
        experience: { min: 2, max: 4 },
        recruiter: recruiter1._id,
        status: "active",
      },
      {
        title: "Digital Marketing & Growth Specialist",
        company: "Design Studio Labs",
        description: "Drive user acquisition, SEO optimization, content strategies, and social media campaigns for cutting-edge digital products.",
        requirements: [
          "2+ years in digital marketing, SEO, and paid ad management",
          "Data-driven mindset with experience in Google Analytics & Search Console",
        ],
        responsibilities: [
          "Plan and execute multichannel growth marketing strategies",
          "Analyze campaign ROI and optimize conversions",
        ],
        skills: ["SEO", "Google Analytics", "Content Marketing", "PPC"],
        category: "Marketing",
        salary: { min: 600000, max: 1000000, currency: "INR" },
        location: "Mumbai, India",
        locationType: "hybrid",
        type: "part-time",
        experience: { min: 1, max: 3 },
        recruiter: recruiter2._id,
        status: "active",
      },
    ]);

    // Create Sample Application
    const app1 = await Application.create({
      job: jobs[0]._id,
      applicant: jobseeker1._id,
      resume: jobseeker1.profile.resume,
      coverLetter: "Hi, I am an experienced MERN developer eager to contribute to Tech Corp's innovative products!",
      status: "pending",
    });

    jobs[0].applications.push(app1._id);
    await jobs[0].save();

    console.log("\n=============================================");
    console.log("🎉 Database Seeded Successfully!");
    console.log("---------------------------------------------");
    console.log("🔑 Sample Credentials:");
    console.log("   Jobseeker 1 : jobseeker@example.com / 123456");
    console.log("   Jobseeker 2 : priya@example.com     / 123456");
    console.log("   Recruiter 1 : recruiter@techcorp.com / 123456");
    console.log("   Recruiter 2 : hr@designstudio.io    / 123456");
    console.log("=============================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Seeding Error:", error);
    process.exit(1);
  }
};

seedData();
