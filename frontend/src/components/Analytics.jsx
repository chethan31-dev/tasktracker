export default function Analytics({ stats }) {
  return (
    <div className="analytics">
      <div className="stat-card">
        <h3>Total Tasks</h3>
        <p className="stat-value">{stats.total}</p>
      </div>
      <div className="stat-card">
        <h3>Completed</h3>
        <p className="stat-value">{stats.completed}</p>
      </div>
      <div className="stat-card">
        <h3>Pending</h3>
        <p className="stat-value">{stats.pending}</p>
      </div>
      <div className="stat-card">
        <h3>Completion Rate</h3>
        <p className="stat-value">{stats.completionPercentage}%</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: `${stats.completionPercentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}
