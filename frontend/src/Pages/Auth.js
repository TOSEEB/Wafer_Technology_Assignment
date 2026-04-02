import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL;

function Auth({ setToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError("");
    if (!isLogin && password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    setLoading(true);
    try {
      const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
      const res = await axios.post(url, { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container compact">
      <h1 className="title">{isLogin ? "Login" : "Register"}</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit} className="add-form">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        {!isLogin && (
          <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        )}
        <button type="submit" className="add-btn" disabled={loading}>
          {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
        </button>
      </form>
      <button className="back-btn" onClick={() => setIsLogin(!isLogin)} disabled={loading}>
        {isLogin ? "Create Account" : "Already have an account?"}
      </button>
    </div>
  );
}

export default Auth;