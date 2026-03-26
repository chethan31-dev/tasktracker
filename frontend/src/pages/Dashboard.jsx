import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import Analytics from '../components/Analytics';
import Filters from '../components/Filters';
import api from '../api/axios';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({ status: '', priority: '', search: '' });
  const { logout, user } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);

      const { data } = await api.get(`/tasks?${params}`);
      console.log('📥 Fetched tasks from API:', data);
      
      const tasksArray = data.data || data;
      console.log('📦 Tasks array:', tasksArray);
      
      setTasks(tasksArray);
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/tasks');
      const tasks = data.data || data;
      const total = tasks.length;
      const completed = tasks.filter(t => t.status === 'Done' || t.status === 'completed').length;
      const pending = total - completed;
      const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      setStats({ total, completed, pending, completionPercentage });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      console.log('📤 Sending task data:', taskData);
      const response = await api.post('/tasks', taskData);
      console.log('✅ Task created successfully:', response.data);
      setShowForm(false);
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('❌ Error creating task:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await api.put(`/tasks/${editingTask._id}`, taskData);
      setEditingTask(null);
      setShowForm(false);
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(`/tasks/${id}/status`, { status });
      fetchTasks();
      fetchStats();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  return (
    <div className="dashboard">
      <header>
        <h1>Task Management</h1>
        <div className="header-actions">
          <span>{user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      {stats && <Analytics stats={stats} />}

      <div className="main-content">
        <div className="controls">
          <button onClick={() => { setShowForm(true); setEditingTask(null); }}>
            + New Task
          </button>
          <Filters filters={filters} setFilters={setFilters} />
        </div>

        {showForm && (
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
            onCancel={() => { setShowForm(false); setEditingTask(null); }}
          />
        )}

        {loading ? (
          <div className="loading">Loading tasks...</div>
        ) : (
          <TaskList
            tasks={tasks}
            onDelete={handleDeleteTask}
            onEdit={handleEdit}
            onStatusChange={handleStatusChange}
          />
        )}
      </div>
    </div>
  );
}
