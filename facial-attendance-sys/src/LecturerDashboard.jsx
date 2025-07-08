import React, { useState } from "react";
import "./LecturerDashboard.css";

const LecturerDashboard = () => {
  const [activeTab, setActiveTab] = useState("attendance");

  const handleLogout = () => {
    window.location.href = "/";
  };

  return (
    <div className="lecturer-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="top">
          <h2>
            Facial <br />
            Recognition <br />
            Attendance <br />
            System
          </h2>

          <nav className="nav-menu">
            <ul>
              <li
                className={activeTab === "attendance" ? "active" : ""}
                onClick={() => setActiveTab("attendance")}
              >
                Take Attendance
              </li>
              <li
                className={activeTab === "reports" ? "active" : ""}
                onClick={() => setActiveTab("reports")}
              >
                View Reports
              </li>
            </ul>
          </nav>
        </div>

        <div className="bottom">
          <button className="logout" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activeTab === "attendance" && (
          <>
            <h1>Lecturer Dashboard</h1>

            <div className="controls">
              <select>
                <option>Select Course</option>
              </select>
            </div>

            <div className="dashboard-panels">
              <div className="attendance-box">
                <p className="live-indicator">
                  <span className="green-dot"></span> Live attendance taking
                </p>
                <div className="video-box">[ Live camera feed here ]</div>
                <button className="scan-btn">Start Scan</button>
              </div>

              <div className="summary-panel">
                <div className="summary-card detected">
                  <p>11</p>
                  <span>Detected</span>
                </div>
                <div className="summary-card absent">
                  <p>3</p>
                  <span>Absent</span>
                </div>
                <div className="action-buttons">
                  <button className="submit">Submit</button>
                  <button className="cancel">Cancel</button>
                </div>
              </div>
            </div>

            <table className="recent-table">
              <thead>
                <tr>
                  <th>Recent Activity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Retcheal Lea E.Omar</td>
                  <td>Detected</td>
                </tr>
                <tr>
                  <td>Lorens Ong Tien Min</td>
                  <td>Detected</td>
                </tr>
                <tr>
                  <td>Eyvan Lim Yik Wen</td>
                  <td>Detected</td>
                </tr>
                <tr>
                  <td>Ran Takahashi</td>
                  <td>Absent</td>
                </tr>
              </tbody>
            </table>
          </>
        )}

        {activeTab === "reports" && (
          <>
            <h1 className="center-title">View Reports</h1>
            <p>This section will show attendance reports for each course and date.</p>
            {/* Future: Filter by course/date + table of report */}
          </>
        )}
      </div>
    </div>
  );
};

export default LecturerDashboard;