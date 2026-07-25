function FilterSidebar({ filters, onFilterChange, onReset }) {
  const categories = ["All", "Technology", "Design", "Marketing", "Finance", "Sales", "Management"];
  const jobTypes = ["All", "full-time", "part-time", "contract", "internship"];
  const locationTypes = ["All", "remote", "hybrid", "on-site"];

  return (
    <div className="glass-panel" style={{ padding: "24px", position: "sticky", top: "100px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: "700" }}>Filters</h3>
        <button
          onClick={onReset}
          style={{ background: "none", border: "none", color: "var(--primary)", fontSize: "0.85rem", cursor: "pointer" }}
        >
          Reset All
        </button>
      </div>

      {/* Category Filter */}
      <div className="form-group">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={filters.category || "All"}
          onChange={(e) => onFilterChange("category", e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Job Type Filter */}
      <div className="form-group">
        <label className="form-label">Employment Type</label>
        <select
          className="form-select"
          value={filters.type || "All"}
          onChange={(e) => onFilterChange("type", e.target.value)}
        >
          {jobTypes.map((type) => (
            <option key={type} value={type}>
              {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Location Type Filter */}
      <div className="form-group">
        <label className="form-label">Workplace Policy</label>
        <select
          className="form-select"
          value={filters.locationType || "All"}
          onChange={(e) => onFilterChange("locationType", e.target.value)}
        >
          {locationTypes.map((loc) => (
            <option key={loc} value={loc}>
              {loc === "All" ? "All Workplaces" : loc.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Location Search */}
      <div className="form-group">
        <label className="form-label">Location</label>
        <input
          type="text"
          className="form-input"
          placeholder="e.g. Bangalore, Remote"
          value={filters.location || ""}
          onChange={(e) => onFilterChange("location", e.target.value)}
        />
      </div>

      {/* Min Experience */}
      <div className="form-group">
        <label className="form-label">Max Experience (Years)</label>
        <input
          type="number"
          className="form-input"
          placeholder="e.g. 5"
          value={filters.experience || ""}
          onChange={(e) => onFilterChange("experience", e.target.value)}
        />
      </div>
    </div>
  );
}

export default FilterSidebar;