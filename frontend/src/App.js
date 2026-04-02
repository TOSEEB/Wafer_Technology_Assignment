import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Auth from "./Pages/Auth";
import Home from "./Pages/Home";
import AddTask from "./Pages/AddTask";
import EditTask from "./Pages/EditTask";
import "./App.css";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const handleStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={!token ? <Auth setToken={setToken} /> : <Navigate to="/home" />} />
        <Route path="/home" element={token ? <Home setToken={setToken} /> : <Navigate to="/" />} />
        <Route path="/add" element={token ? <AddTask /> : <Navigate to="/" />} />
        <Route path="/edit/:id" element={token ? <EditTask /> : <Navigate to="/" />} />
        <Route path="*" element={token ? <Navigate to="/home" /> : <Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;