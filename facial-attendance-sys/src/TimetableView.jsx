import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

const TimetableView = () => {
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState("classA"); // Add class selection state

  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = Array.from({ length: 10 }, (_, i) => 8 + i);

  const fetchTimetable = async (className) => {
    try {
      const response = await fetch(
        `http://localhost/facial-attendance-backend/get_timetable.php?class=${className}`
      );
      const data = await response.json();
      if (data.success) setTimetable(data.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable(selectedClass);
  }, [selectedClass]);

  if (loading) return <div className="loading">Loading timetable...</div>;

  return (
    <div className="timetable-container student-view">
      <h2>Class Schedule</h2>
      
      {/* Add class selector */}
      <div className="class-selector">
        <label>Select Class: </label>
        <select 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="classA">DCS 1</option>
          <option value="classB">DCS 2</option>
        </select>
      </div>
      <h2>My Class Schedule</h2>

      <table className="timetable-table">
        <thead>
          <tr>
            <th style={{ width: '80px' }}>Time</th>
            {hours.map((h) => (
              <th key={h} style={{ width: '100px' }}>{h}:00</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td><strong>{day}</strong></td>
              {hours.map((hour) => {
                // Find if any entry starts exactly at this hour
                const entry = timetable.find(
                  (e) => e.day === day && parseInt(e.start_time) === hour
                );

                // Find any class that covers this hour
                const occupyingEntry = timetable.find(
                  (e) =>
                    e.day === day &&
                    hour >= parseInt(e.start_time) &&
                    hour < parseInt(e.end_time)
                );

                // Determine course color class
                const courseClass = occupyingEntry
                  ? `course-${occupyingEntry.course_code.replace(/\s+/g, '')}`
                  : '';

                return (
                  <td
                    key={`${day}-${hour}`}
                    className={`timetable-cell ${courseClass}`}
                  >
                    {entry && (
                      <div className={`entry ${courseClass}`}>
                        <div><strong>{entry.course_code}</strong></div>
                        <div>{entry.lecturer_name}</div>
                        <div>{entry.location}</div>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimetableView;
