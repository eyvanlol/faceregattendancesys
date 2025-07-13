import React, { useState } from "react";
import "./StudentDashboard.css";
import TimetableView from "./TimetableView"; // Import the timetable component

const StudentDashboard = () => {
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [activeTab, setActiveTab] = useState("attendance"); // New state for tabs

  const handleLogout = () => {
    window.location.href = "/";
  };

  const attendanceData = [
    { date: "17-06-2025", courseID: "DCS1101", status: "Present", time: "9:00AM", percentage: 90 },
    { date: "27-06-2025", courseID: "DCS1102", status: "Absent", time: "-", percentage: 0 },
    { date: "30-06-2025", courseID: "DCS1103", status: "Excused", time: "-", percentage: 45 },
    { date: "2-07-2025", courseID: "DCS1104", status: "Not Taken", time: "-", percentage: 70 },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case "Present": return "present";
      case "Absent": return "absent";
      case "Excused": return "excused";
      default: return "not-taken";
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Facial Recognition<br />Attendance System</h2>

        <div className="nav-menu">
          <button 
            className={activeTab === "timetable" ? "active" : ""}
            onClick={() => setActiveTab("timetable")}
          >
            Weekly Timetable
          </button>
          <button 
            className={activeTab === "attendance" ? "active" : ""}
            onClick={() => setActiveTab("attendance")}
          >
            My Attendance
          </button>
        </div>

        <button className="logout" onClick={handleLogout}>Log Out</button>
      </div>

      <div className="main">
        {activeTab === "attendance" ? (
          <>
            <h1>My Attendance</h1>
            <div className="filters">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                <option value="">Select Month</option>
                <option value="June">June</option>
                <option value="July">July</option>
              </select>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
                <option value="">Select Course</option>
                <option value="DCS1101">DCS1101</option>
                <option value="DCS1102">DCS1102</option>
                <option value="DCS1103">DCS1103</option>
                <option value="DCS1104">DCS1104</option>
              </select>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>CourseID</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {attendanceData.map((row, index) => (
                  <tr key={index}>
                    <td>{row.date}</td>
                    <td>{row.courseID}</td>
                    <td className={getStatusClass(row.status)}>{row.status}</td>
                    <td>{row.time}</td>
                    <td>{row.percentage}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="warning">
              Warning: You are at risk of failing due to low attendance
            </div>

            <button className="report-btn">View Attendance Report</button>
          </>
        ) : (
          <TimetableView />
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;