import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import JobCard from "../components/JobCard";
import FilterSidebar from "../components/FilterSidebar";

function JobList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "All",
    type: searchParams.get("type") || "All",
    locationType: searchParams.get("locationType") || "All",
    location: searchParams.get("location") || "",
    experience: searchParams.get("experience") || "",
  });

  useEffect(() => {
    fetchJobs();
  }, [filters, page]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category && filters.category !== "All") params.append("category", filters.category);
      if (filters.type && filters.type !== "All") params.append("type", filters.type);
      if (filters.locationType && filters.locationType !== "All") params.append("locationType", filters.locationType);
      if (filters.location) params.append("location", filters.location);
      if (filters.experience) params.append("experience", filters.experience);
      params.append("page", page);
      params.append("limit", 9);

      const { data } = await api.get(`/jobs?${params.toString()}`);
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "All",
      type: "All",
      locationType: "All",
      location: "",
      experience: "",
    });
    setSearchParams({});
    setPage(1);
  };

  return (
    <div className="container animate-fade-in" style={{ padding: "40px 24px" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", marginBottom: "8px" }}>Explore All Opportunities</h1>
        <p style={{ color: "var(--text-sub)" }}>
          Showing {total} open positions across technology, design, marketing, and business.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "32px" }}>
        {/* Sidebar */}
        <div>
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onReset={handleResetFilters}
          />
        </div>

        {/* Jobs List */}
        <div>
          {/* Top Search Input */}
          <div className="glass-panel" style={{ padding: "16px 20px", marginBottom: "24px", display: "flex", gap: "12px" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by keywords, title, or skills..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              style={{ flex: 1 }}
            />
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : jobs.length === 0 ? (
            <div className="glass-panel" style={{ padding: "60px 20px", textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🔍</div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "8px" }}>No Jobs Found</h3>
              <p style={{ color: "var(--text-sub)", marginBottom: "20px" }}>
                Try adjusting your search criteria or clearing filters to see more results.
              </p>
              <button onClick={handleResetFilters} className="btn btn-secondary">
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "24px",
                marginBottom: "32px"
              }}>
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: "flex", justifyContent: "center", gap: "8px", alignItems: "center" }}>
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    ← Previous
                  </button>
                  <span style={{ fontSize: "0.9rem", color: "var(--text-sub)", padding: "0 12px" }}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="btn btn-secondary btn-sm"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default JobList;
