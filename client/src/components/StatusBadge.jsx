function StatusBadge({ status }) {
  const getBadgeClass = (s) => {
    switch (s?.toLowerCase()) {
      case "shortlisted":
        return "badge-shortlisted";
      case "hired":
        return "badge-hired";
      case "rejected":
        return "badge-rejected";
      case "reviewed":
        return "badge-shortlisted";
      default:
        return "badge-pending";
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {status || "pending"}
    </span>
  );
}

export default StatusBadge;
