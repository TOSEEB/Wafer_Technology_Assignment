// Pages/Home.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Home() {
  const [tasks, setTasks] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("none");

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    if (!token) return;
    try {
      const res = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
      setTasks(res.data);
    } catch (error) {
      console.error("Fetch error:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const toggleStatus = async (task) => {
    if (!token) return;
    await axios.put(`${API_URL}/tasks/${task._id}`, 
      { status: task.status === "Complete" ? "Incomplete" : "Complete" }, 
      { headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    if (!token) return;
    await axios.delete(`${API_URL}/tasks/${id}`, { headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks
    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase()))
    .filter((t) => (filter === "All" ? true : t.status === filter));

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === "name") return a.title.localeCompare(b.title);
    if (sort === "status") return a.status.localeCompare(b.status);
    return 0;
  });

  return (
    <div className="container">
      <div className="header-row">
        <h1 className="title">TODO LIST</h1>
        <button className="logout-btn" onClick={logout}>Logout</button>
      </div>

      <Link to="/add"><button className="add-task-btn">+ Add New Task</button></Link>

      <div className="controls">
        <input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="filter-row">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Complete">Complete</option>
            <option value="Incomplete">Incomplete</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="none">No Sort</option>
            <option value="name">Name</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="task-list">
        {sortedTasks.length === 0 ? <p className="no-tasks">No tasks found.</p> :
          sortedTasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-header">
                <div
                  className={`status-dot ${task.status === "Complete" ? "complete" : "incomplete"}`}
                  onClick={() => toggleStatus(task)}
                  title="Toggle status"
                >
                  {task.status === "Complete" ? "✓" : ""}
                </div>
                <span className={`task-title ${task.status === "Complete" ? "completed" : ""}`}>
                  {task.title}
                </span>
                <span className={`status-badge ${task.status === "Complete" ? "badge-complete" : "badge-incomplete"}`}>
                  {task.status}
                </span>
              </div>

              {expandedId === task._id && task.description && (
                <div className="task-description">{task.description}</div>
              )}

              <div className="task-actions">
                <button className="view-btn" onClick={() => setExpandedId(expandedId === task._id ? null : task._id)}>
                  {expandedId === task._id ? "Hide" : "View"}
                </button>
                <button className="edit-btn" onClick={() => navigate(`/edit/${task._id}`)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default Home;