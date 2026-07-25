import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";

function Home() {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    try {
      const { data } = await api.get("/jobs?limit=6");
      setFeaturedJobs(data.jobs || []);
    } catch (err) {
      console.error("Failed to load featured jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/jobs?search=${encodeURIComponent(searchQuery)}&category=${selectedCategory}`);
  };

  const categories = [
    { name: "Technology", icon: "💻", count: "120+ Jobs" },
    { name: "Design", icon: "🎨", count: "85+ Jobs" },
    { name: "Marketing", icon: "🚀", count: "60+ Jobs" },
    { name: "Finance", icon: "📊", count: "45+ Jobs" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section style={{
        padding: "80px 0 60px 0",
        textAlign: "center",
        position: "relative"
      }}>
        <div className="container">
          <span className="badge badge-shortlisted" style={{ marginBottom: "20px", fontSize: "0.85rem", padding: "6px 16px" }}>
             Over 1,000+ Verified Jobs Live Today
          </span>

          <h1 style={{ fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: "800", marginBottom: "20px", letterSpacing: "-0.02em" }}>
            Find Your Dream Career <br />
            <span className="gradient-text">Without Limits</span>
          </h1>

          <p style={{ fontSize: "1.15rem", color: "var(--text-sub)", maxWidth: "680px", margin: "0 auto 40px auto" }}>
            Connect directly with top tech startups, design studios, and Fortune 500 companies. Fast application, real-time application tracking, and zero clutter.
          </p>

          {/* Search Box */}
          <form
            onSubmit={handleSearchSubmit}
            className="glass-panel"
            style={{
              padding: "10px 14px",
              maxWidth: "820px",
              margin: "0 auto",
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center"
            }}
          >
            <div style={{ flex: 2, minWidth: "200px" }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search job title, skills, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ border: "none", background: "transparent" }}
              />
            </div>

            <div style={{ flex: 1, minWidth: "140px" }}>
              <select
                className="form-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{ border: "none", background: "transparent" }}
              >
                <option value="All">All Categories</option>
                <option value="Technology">Technology</option>
                <option value="Design">Design</option>
                <option value="Marketing">Marketing</option>
                <option value="Finance">Finance</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" style={{ borderRadius: "var(--radius-md)" }}>
              Search Jobs 
            </button>
          </form>

          {/* Stats Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "24px",
            marginTop: "60px"
          }}>
            <div className="glass-card" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "2rem", color: "var(--primary)" }}>10k+</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-sub)" }}>Active Candidates</p>
            </div>
            <div className="glass-card" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "2rem", color: "var(--emerald)" }}>1.5k+</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-sub)" }}>Companies Hiring</p>
            </div>
            <div className="glass-card" style={{ textAlign: "center" }}>
              <h3 style={{ fontSize: "2rem", color: "var(--accent)" }}>98%</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-sub)" }}>Hiring Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem" }}>Popular Categories</h2>
              <p style={{ color: "var(--text-sub)" }}>Explore roles by industry</p>
            </div>
            <Link to="/jobs" className="btn btn-secondary btn-sm">View All Categories →</Link>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "20px"
          }}>
            {categories.map((cat) => (
              <div
                key={cat.name}
                className="glass-card"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/jobs?category=${cat.name}`)}
              >
                <div style={{ fontSize: "2.2rem", marginBottom: "12px" }}>{cat.icon}</div>
                <h3 style={{ fontSize: "1.2rem", marginBottom: "4px" }}>{cat.name}</h3>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{cat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section style={{ padding: "60px 0 80px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "32px" }}>
            <div>
              <h2 style={{ fontSize: "1.8rem" }}>Featured Opportunities</h2>
              <p style={{ color: "var(--text-sub)" }}>Hand-picked jobs from top tier tech startups</p>
            </div>
            <Link to="/jobs" className="btn btn-outline">Explore All Jobs →</Link>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "24px"
            }}>
              {featuredJobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Recruiter Banner */}
      <section style={{ padding: "40px 0 80px 0" }}>
        <div className="container">
          <div className="glass-panel" style={{
            padding: "50px 40px",
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)",
            border: "1px solid rgba(99, 102, 241, 0.3)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "30px"
          }}>
            <div style={{ maxWidth: "600px" }}>
              <h2 style={{ fontSize: "2rem", marginBottom: "12px" }}>Are You Hiring Top Talent?</h2>
              <p style={{ color: "var(--text-sub)", fontSize: "1.05rem" }}>
                Post your open roles in minutes and reach thousands of verified developers, designers, and growth professionals.
              </p>
            </div>
            <Link to="/register" className="btn btn-primary btn-lg">
              Post a Job Now 
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
