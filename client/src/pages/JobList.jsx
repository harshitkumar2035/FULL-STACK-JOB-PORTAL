import { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import SearchBar from "../components/SearchBar";
import FilterSidebar from "../components/FilterSidebar";

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    location: "",
    salaryMin: "",
    salaryMax: "",
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12, ...filters };
      // Remove empty filters
      Object.keys(params).forEach(
        (key) => params[key] === "" && delete params[key]
      );

      const { data } = await axios.get("/api/jobs", { params });
      setJobs(data.jobs);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, filters]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SearchBar
        value={filters.search}
        onChange={(val) => {
          setFilters({ ...filters, search: val });
          setPage(1);
        }}
      />

      <div className="flex gap-6 mt-6">
        {/* Filters */}
        <div className="w-64 flex-shrink-0">
          <FilterSidebar filters={filters} setFilters={setFilters} setPage={setPage} />
        </div>

        {/* Job Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No jobs found matching your criteria</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobList;