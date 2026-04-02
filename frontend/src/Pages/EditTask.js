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
  const [loading, setLoading] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (error) setError("");
  }, [title, description, status]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    const fetchTask = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const task = res.data;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch task");
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token || loading) return;

    setLoading(true);
    setError("");
    try {
      await axios.put(
        `${API_URL}/tasks/${id}`,
        { title, description, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container compact">
      <h1 className="title">Edit Task</h1>
      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading task...</p>
      ) : (
        <form onSubmit={handleSubmit} className="add-form">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title *" required />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Task Description" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Incomplete">Incomplete</option>
            <option value="Complete">Complete</option>
          </select>
          <button className="add-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Task"}
          </button>
        </form>
      )}
      <button className="back-btn" onClick={() => navigate("/home")} disabled={loading}>
        ← Back
      </button>
    </div>
  );
}

export default EditTask;