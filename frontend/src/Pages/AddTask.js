import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Incomplete");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Prevent multiple clicks
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    if (loading) return; // Prevent double-click

    setLoading(true);
    setError("");

    try {
      await axios.post(
        `${API_URL}/tasks`,
        { title: title.trim(), description: description.trim(), status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container compact">
      <h1 className="title">Add New Task</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="add-form">
        <input
          placeholder="Enter a Task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="Incomplete">Incomplete</option>
          <option value="Complete">Complete</option>
        </select>

        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Task"}
        </button>
      </form>
      <button className="back-btn" onClick={() => navigate("/home")} disabled={loading}>
        ← Back to Home
      </button>
    </div>
  );
}

export default AddTask;