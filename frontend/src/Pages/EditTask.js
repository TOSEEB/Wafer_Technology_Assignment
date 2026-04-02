// Pages/EditTask.js
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Incomplete");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTask = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${API_URL}/tasks`, { headers: { Authorization: `Bearer ${token}` } });
        const task = res.data.find((t) => t._id === id);
        if (task) {
          setTitle(task.title);
          setDescription(task.description);
          setStatus(task.status);
        } else {
          setError("Task not found");
        }
      } catch (err) {
        setError("Failed to fetch task");
      }
    };
    fetchTask();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    try {
      await axios.put(`${API_URL}/tasks/${id}`, { title, description, status }, 
        { headers: { Authorization: `Bearer ${token}` } });
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    }
  };

  return (
    <div className="container compact">
      <h1 className="title">Edit Task</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="add-form">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title *" required />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task Description" />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Incomplete">Incomplete</option>
          <option value="Complete">Complete</option>
        </select>
        <button className="add-btn">Update Task</button>
      </form>
      <button className="back-btn" onClick={() => navigate("/home")}>← Back</button>
    </div>
  );
}

export default EditTask;