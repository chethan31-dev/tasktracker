export default function TaskList({ tasks, onDelete, onEdit, onStatusChange }) {
  // Debug: Log tasks to see what data we're receiving
  console.log('📋 TaskList received tasks:', tasks);

  if (!tasks || tasks.length === 0) {
    return <div className="empty-state">No tasks found. Create one to get started!</div>;
  }

  return (
    <div className="task-list">
      {tasks.map(task => {
        // Debug: Log each task
        console.log('🔍 Rendering task:', task);

        // Safe access with optional chaining and defaults
        const taskStatus = task?.status || 'pending';
        const taskTitle = task?.task || 'Untitled';
        const taskDescription = task?.description || 'No description';
        const taskPriority = task?.priority || 'Medium';
        const taskId = task?._id;

        return (
          <div 
            key={taskId} 
            className={`task-card ${taskStatus.toLowerCase().replace(' ', '-')}`}
          >
            <div className="task-header">
              <h3>{taskTitle}</h3>
              <span className={`priority ${taskPriority.toLowerCase()}`}>
                {taskPriority}
              </span>
            </div>
            <p>{taskDescription}</p>
            <div className="task-meta">
              <span className="status">{taskStatus}</span>
              {task?.dueDate && (
                <span className="due-date">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              )}
            </div>
            <div className="task-actions">
              <select
                value={taskStatus}
                onChange={(e) => onStatusChange(taskId, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
              <button onClick={() => onEdit(task)}>Edit</button>
              <button onClick={() => onDelete(taskId)} className="delete">
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
