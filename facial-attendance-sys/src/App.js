import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import AdminDashboard from "./AdminDashboard";
import LecturerDashboard from "./LecturerDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/lecturer" element={<LecturerDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;