import React, { useState, useEffect, useCallback } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  // ========== STATE MANAGEMENT ==========
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("student");

  // Student states
  const [students, setStudents] = useState([]);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [newStudent, setNewStudent] = useState({
    studentId: "",
    name: "",
    email: "",
    course: "",
    semester: "",
    image: null,
  });

  // Lecturer states
  const [lecturers, setLecturers] = useState([]);
  const [showLecturerForm, setShowLecturerForm] = useState(false);
  const [viewLecturer, setViewLecturer] = useState(null);
  const [editLecturer, setEditLecturer] = useState(null);
  const [newLecturer, setNewLecturer] = useState({
    lecturerId: "",
    name: "",
    email: "",
    teachingLevel: "",
    department: "",
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Timetable states
  const [selectedClass, setSelectedClass] = useState("classA");
  const [timetables, setTimetables] = useState({
    classA: [],
    classB: [],
  });
  const [timetableEntry, setTimetableEntry] = useState({
    course: "",
    lecturer: "",
    location: "",
    day: "MON",
    startTime: "8",
    endTime: "9",
  });
  const [editTimetableEntry, setEditTimetableEntry] = useState(null);
  const [occupiedSlots, setOccupiedSlots] = useState([]);

  // Constants
  const days = ["MON", "TUE", "WED", "THU", "FRI"];
  const hours = Array.from({ length: 10 }, (_, i) => 8 + i);

  // ========== DATA FETCHING ==========
  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/get_students.php"
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      alert("Error fetching students: " + error.message);
    }
  }, []);

  const fetchLecturers = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/get_lecturers.php"
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setLecturers(data);
    } catch (error) {
      console.error("Error fetching lecturers:", error);
      alert("Error fetching lecturers: " + error.message);
    }
  }, []);

  const fetchTimetable = useCallback(async (className) => {
    try {
      const response = await fetch(
        `http://localhost/facial-attendance-backend/get_timetable.php?class=${className}`
      );
      
      // First check if response is OK
      if (!response.ok) {
        const errorData = await response.text(); // Get the raw response
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }
      
      // Then try to parse as JSON
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || "Failed to fetch timetable");
      }
      
      setTimetables((prev) => ({
        ...prev,
        [className]: data.data,
      }));
      updateOccupiedSlots(data.data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
      alert("Error fetching timetable: " + error.message);
    }
  }, []);

  const updateOccupiedSlots = useCallback((entries) => {
    const slots = entries.map((entry) => ({
      day: entry.day,
      start: parseInt(entry.start_time),
      end: parseInt(entry.end_time),
    }));
    setOccupiedSlots(slots);
  }, []);

  // ========== USE EFFECTS ==========
  useEffect(() => {
    if (activeTab === "student") {
      fetchStudents();
    } else if (activeTab === "lecturer") {
      fetchLecturers();
    } else if (activeTab === "timetable") {
      fetchTimetable(selectedClass);
    }
  }, [activeTab, selectedClass, fetchStudents, fetchLecturers, fetchTimetable]);

  // ========== TIMETABLE FUNCTIONS ==========
  const isSlotAvailable = useCallback(
    (day, start, end) => {
      return !occupiedSlots.some(
        (slot) =>
          slot.day === day &&
          ((start >= slot.start && start < slot.end) ||
            (end > slot.start && end <= slot.end) ||
            (start <= slot.start && end >= slot.end))
      );
    },
    [occupiedSlots]
  );

  const handleTimetableInput = (e) => {
    const { name, value } = e.target;
    setTimetableEntry({ ...timetableEntry, [name]: value });
  };

  const addTimetableEntry = async () => {
    const start = parseInt(timetableEntry.startTime);
    const end = parseInt(timetableEntry.endTime);

    if (start >= end) {
      alert("End time must be after start time");
      return;
    }

    if (!isSlotAvailable(timetableEntry.day, start, end)) {
      alert("This time slot is already occupied");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/add_timetable_entry.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            class_name: selectedClass,
            course_code: timetableEntry.course,
            lecturer_name: timetableEntry.lecturer,
            location: timetableEntry.location,
            day: timetableEntry.day,
            start_time: start,
            end_time: end,
          }),
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      if (data.success) {
        fetchTimetable(selectedClass);
        setTimetableEntry({
          course: "",
          lecturer: "",
          location: "",
          day: "MON",
          startTime: "8",
          endTime: "9",
        });
      } else {
        throw new Error(data.error || "Failed to add timetable entry");
      }
    } catch (error) {
      console.error("Error adding timetable entry:", error);
      alert("Error adding timetable entry: " + error.message);
    }
  };

  const handleEditTimetable = (entry) => {
    setEditTimetableEntry({
      ...entry,
      startTime: entry.start_time.toString(),
      endTime: entry.end_time.toString(),
    });
  };

  const updateTimetableEntry = async () => {
    const start = parseInt(editTimetableEntry.startTime);
    const end = parseInt(editTimetableEntry.endTime);

    if (start >= end) {
      alert("End time must be after start time");
      return;
    }

    const otherSlots = occupiedSlots.filter(
      (slot) => !(slot.day === editTimetableEntry.day && slot.start === parseInt(editTimetableEntry.start_time))
    );

    const hasConflict = otherSlots.some(
      (slot) =>
        slot.day === editTimetableEntry.day &&
        ((start >= slot.start && start < slot.end) ||
          (end > slot.start && end <= slot.end) ||
          (start <= slot.start && end >= slot.end))
    );

    if (hasConflict) {
      alert("This time slot is already occupied");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/update_timetable_entry.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: editTimetableEntry.id,
            class_name: selectedClass,
            course_code: editTimetableEntry.course_code,
            lecturer_name: editTimetableEntry.lecturer_name,
            location: editTimetableEntry.location,
            day: editTimetableEntry.day,
            start_time: start,
            end_time: end,
          }),
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      if (data.success) {
        fetchTimetable(selectedClass);
        setEditTimetableEntry(null);
      } else {
        throw new Error(data.error || "Failed to update timetable entry");
      }
    } catch (error) {
      console.error("Error updating timetable entry:", error);
      alert("Error updating timetable entry: " + error.message);
    }
  };

  const handleDeleteTimetable = async (id) => {
    if (window.confirm("Are you sure you want to delete this timetable entry?")) {
      try {
        const response = await fetch(
          `http://localhost/facial-attendance-backend/delete_timetable_entry.php?id=${id}`
        );
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        if (data.success) {
          fetchTimetable(selectedClass);
        } else {
          throw new Error(data.error || "Failed to delete timetable entry");
        }
      } catch (error) {
        console.error("Error deleting timetable entry:", error);
        alert("Error deleting timetable entry: " + error.message);
      }
    }
  };

  // ========== STUDENT FUNCTIONS ==========
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (activeTab === "student") {
      setNewStudent({ ...newStudent, [name]: value });
    } else {
      setNewLecturer({ ...newLecturer, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setNewStudent({ ...newStudent, image: e.target.files[0] });
  };

  const handleAddStudent = async () => {
    const formData = new FormData();
    Object.entries(newStudent).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/add_student.php",
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      alert(data.message || data.error);
      setShowStudentForm(false);
      setNewStudent({
        studentId: "",
        name: "",
        email: "",
        course: "",
        semester: "",
        image: null,
      });
      fetchStudents();
    } catch (error) {
      console.error("Error adding student:", error);
      alert("Error adding student: " + error.message);
    }
  };

  const handleViewStudent = (student) => setViewStudent(student);

  const handleEditStudent = (student) => {
    setEditStudent({ ...student, newImage: null });
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        const response = await fetch(
          `http://localhost/facial-attendance-backend/delete_student.php?id=${id}`,
          {
            method: "DELETE",
          }
        );
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        alert(data.message || data.error);
        fetchStudents();
      } catch (error) {
        console.error("Error deleting student:", error);
        alert("Error deleting student: " + error.message);
      }
    }
  };

  const submitEditStudent = async () => {
    const formData = new FormData();
    Object.entries(editStudent).forEach(([key, value]) => {
      if (value && key !== "newImage") formData.append(key, value);
    });
    if (editStudent.newImage) {
      formData.append("image", editStudent.newImage);
    }

    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/edit_student.php",
        {
          method: "POST",
          body: formData,
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      alert(data.message || data.error);
      setEditStudent(null);
      fetchStudents();
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Error updating student: " + error.message);
    }
  };

  // ========== LECTURER FUNCTIONS ==========
  const handleAddLecturer = async () => {
    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/add_lecturer.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newLecturer),
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      alert(data.message || data.error);
      setShowLecturerForm(false);
      setNewLecturer({
        lecturerId: "",
        name: "",
        email: "",
        teachingLevel: "",
        department: "",
      });
      fetchLecturers();
    } catch (error) {
      console.error("Error adding lecturer:", error);
      alert("Error adding lecturer: " + error.message);
    }
  };

  const handleViewLecturer = (lecturer) => setViewLecturer(lecturer);

  const handleEditLecturer = (lecturer) => {
    setEditLecturer({ ...lecturer });
  };

  const handleDeleteLecturer = async (id) => {
    if (window.confirm("Are you sure you want to delete this lecturer?")) {
      try {
        const response = await fetch(
          `http://localhost/facial-attendance-backend/delete_lecturer.php?id=${id}`,
          {
            method: "DELETE",
          }
        );
        
        if (!response.ok) throw new Error("Network response was not ok");
        
        const data = await response.json();
        alert(data.message || data.error);
        fetchLecturers();
      } catch (error) {
        console.error("Error deleting lecturer:", error);
        alert("Error deleting lecturer: " + error.message);
      }
    }
  };

  const submitEditLecturer = async () => {
    try {
      const response = await fetch(
        "http://localhost/facial-attendance-backend/edit_lecturer.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editLecturer),
        }
      );
      
      if (!response.ok) throw new Error("Network response was not ok");
      
      const data = await response.json();
      alert(data.message || data.error);
      setEditLecturer(null);
      fetchLecturers();
    } catch (error) {
      console.error("Error updating lecturer:", error);
      alert("Error updating lecturer: " + error.message);
    }
  };

  // ========== FILTER FUNCTIONS ==========
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredLecturers = lecturers.filter(
    (lecturer) =>
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.lecturerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ========== RENDER ==========
  return (
    <div className="container">
      {/* Sidebar Navigation */}
      <div className="sidebar">
        <h2>Facial Recognition<br />Attendance System</h2>
        <nav className="nav-menu">
          <ul>
            <li className="dropdown">
              <div className="dropdown-toggle" onClick={() => setDropdownOpen(!dropdownOpen)}>
                Manage Users <span>{dropdownOpen ? "▲" : "▼"}</span>
              </div>
              <ul className={dropdownOpen ? "" : "hidden"}>
                <li
                  className={activeTab === "student" ? "active" : ""}
                  onClick={() => setActiveTab("student")}
                >
                  Student
                </li>
                <li
                  className={activeTab === "lecturer" ? "active" : ""}
                  onClick={() => setActiveTab("lecturer")}
                >
                  Lecturer
                </li>
              </ul>
            </li>
            <li
              className={activeTab === "timetable" ? "active" : ""}
              onClick={() => setActiveTab("timetable")}
            >
              Course Management
            </li>
          </ul>
        </nav>
        <div className="bottom">
          <button className="logout" onClick={() => (window.location.href = "/")}>
            Log Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main">
        <h1 className="center-title">Admin Dashboard</h1>

        {/* Add/Search Controls */}
        {activeTab !== "timetable" && (
          <div className="top-controls">
            <button
              className="btn red"
              onClick={() =>
                activeTab === "student"
                  ? setShowStudentForm(true)
                  : setShowLecturerForm(true)
              }
            >
              {activeTab === "student" ? "Add Student" : "Add Lecturer"}
            </button>
            <input
              type="text"
              className="search"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}

        {/* Student Form */}
        {showStudentForm && (
          <div className="student-form">
            <h3>Add Student</h3>
            <input
              type="text"
              name="studentId"
              placeholder="Student ID"
              value={newStudent.studentId}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newStudent.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newStudent.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="course"
              placeholder="Course"
              value={newStudent.course}
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="semester"
              placeholder="Semester"
              value={newStudent.semester}
              onChange={handleInputChange}
            />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div>
              <button className="btn red" onClick={handleAddStudent}>
                Submit
              </button>
              <button className="btn" onClick={() => setShowStudentForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Lecturer Form */}
        {showLecturerForm && (
          <div className="student-form">
            <h3>Add Lecturer</h3>
            <input
              type="text"
              name="lecturerId"
              placeholder="Lecturer ID"
              value={newLecturer.lecturerId}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newLecturer.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={newLecturer.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="teachingLevel"
              placeholder="Teaching Level"
              value={newLecturer.teachingLevel}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={newLecturer.department}
              onChange={handleInputChange}
            />
            <div>
              <button className="btn red" onClick={handleAddLecturer}>
                Submit
              </button>
              <button className="btn" onClick={() => setShowLecturerForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Student Form */}
        {editStudent && (
          <div className="student-form">
            <h3>Edit Student</h3>
            <input
              type="text"
              value={editStudent.studentId}
              onChange={(e) =>
                setEditStudent({ ...editStudent, studentId: e.target.value })
              }
            />
            <input
              type="text"
              value={editStudent.name}
              onChange={(e) =>
                setEditStudent({ ...editStudent, name: e.target.value })
              }
            />
            <input
              type="email"
              value={editStudent.email}
              onChange={(e) =>
                setEditStudent({ ...editStudent, email: e.target.value })
              }
            />
            <input
              type="text"
              value={editStudent.course}
              onChange={(e) =>
                setEditStudent({ ...editStudent, course: e.target.value })
              }
            />
            <input
              type="number"
              value={editStudent.semester}
              onChange={(e) =>
                setEditStudent({ ...editStudent, semester: e.target.value })
              }
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditStudent({ ...editStudent, newImage: e.target.files[0] })
              }
            />
            <div>
              <button className="btn red" onClick={submitEditStudent}>
                Update
              </button>
              <button className="btn" onClick={() => setEditStudent(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Edit Lecturer Form */}
        {editLecturer && (
          <div className="student-form">
            <h3>Edit Lecturer</h3>
            <input
              type="text"
              value={editLecturer.lecturerId}
              onChange={(e) =>
                setEditLecturer({ ...editLecturer, lecturerId: e.target.value })
              }
            />
            <input
              type="text"
              value={editLecturer.name}
              onChange={(e) =>
                setEditLecturer({ ...editLecturer, name: e.target.value })
              }
            />
            <input
              type="email"
              value={editLecturer.email}
              onChange={(e) =>
                setEditLecturer({ ...editLecturer, email: e.target.value })
              }
            />
            <input
              type="text"
              value={editLecturer.teachingLevel}
              onChange={(e) =>
                setEditLecturer({
                  ...editLecturer,
                  teachingLevel: e.target.value,
                })
              }
            />
            <input
              type="text"
              value={editLecturer.department}
              onChange={(e) =>
                setEditLecturer({ ...editLecturer, department: e.target.value })
              }
            />
            <div>
              <button className="btn red" onClick={submitEditLecturer}>
                Update
              </button>
              <button className="btn" onClick={() => setEditLecturer(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Student Table */}
        {activeTab === "student" && (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>StudentID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Course</th>
                <th>Semester</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.semester}</td>
                  <td className="status active">Active</td>
                  <td className="icons">
                    <span
                      title="View"
                      onClick={() => handleViewStudent(student)}
                    >
                      🔍
                    </span>
                    <span
                      title="Edit"
                      onClick={() => handleEditStudent(student)}
                    >
                      ✏️
                    </span>
                    <span
                      title="Delete"
                      onClick={() => handleDeleteStudent(student.id)}
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Lecturer Table */}
        {activeTab === "lecturer" && (
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>LecturerID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Teaching Level</th>
                <th>Department</th>
                <th>Status</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredLecturers.map((lecturer, index) => (
                <tr key={lecturer.id}>
                  <td>{index + 1}</td>
                  <td>{lecturer.lecturerId}</td>
                  <td>{lecturer.name}</td>
                  <td>{lecturer.email}</td>
                  <td>{lecturer.teachingLevel}</td>
                  <td>{lecturer.department}</td>
                  <td className="status active">Active</td>
                  <td className="icons">
                    <span
                      title="View"
                      onClick={() => handleViewLecturer(lecturer)}
                    >
                      🔍
                    </span>
                    <span
                      title="Edit"
                      onClick={() => handleEditLecturer(lecturer)}
                    >
                      ✏️
                    </span>
                    <span
                      title="Delete"
                      onClick={() => handleDeleteLecturer(lecturer.id)}
                    >
                      🗑️
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Timetable Section */}
        {activeTab === "timetable" && (
          <div className="timetable-container">
            <h2 className="center-title">Timetable</h2>

            {/* Class Selector */}
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

            {/* Timetable Form */}
            <div className="timetable-form">
              <select
                name="course"
                value={
                  editTimetableEntry
                    ? editTimetableEntry.course_code
                    : timetableEntry.course
                }
                onChange={
                  editTimetableEntry
                    ? (e) =>
                        setEditTimetableEntry({
                          ...editTimetableEntry,
                          course_code: e.target.value,
                        })
                    : handleTimetableInput
                }
              >
                <option value="">Select Course</option>
                <option value="DCS2106">DCS2106</option>
                <option value="DCS2113">DCS2113</option>
                <option value="DCS2112">DCS2112</option>
                <option value="DCS2103">DCS2103</option>
              </select>

              <input
                type="text"
                name="lecturer"
                placeholder="Lecturer Name"
                value={
                  editTimetableEntry
                    ? editTimetableEntry.lecturer_name
                    : timetableEntry.lecturer
                }
                onChange={
                  editTimetableEntry
                    ? (e) =>
                        setEditTimetableEntry({
                          ...editTimetableEntry,
                          lecturer_name: e.target.value,
                        })
                    : handleTimetableInput
                }
              />

              <input
                type="text"
                name="location"
                placeholder="Location"
                value={
                  editTimetableEntry
                    ? editTimetableEntry.location
                    : timetableEntry.location
                }
                onChange={
                  editTimetableEntry
                    ? (e) =>
                        setEditTimetableEntry({
                          ...editTimetableEntry,
                          location: e.target.value,
                        })
                    : handleTimetableInput
                }
              />

              <select
                name="day"
                value={
                  editTimetableEntry ? editTimetableEntry.day : timetableEntry.day
                }
                onChange={
                  editTimetableEntry
                    ? (e) =>
                        setEditTimetableEntry({
                          ...editTimetableEntry,
                          day: e.target.value,
                        })
                    : handleTimetableInput
                }
              >
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>

              <select
                name="startTime"
                value={
                  editTimetableEntry
                    ? editTimetableEntry.startTime
                    : timetableEntry.startTime
                }
                onChange={
                  editTimetableEntry
                    ? (e) =>
                        setEditTimetableEntry({
                          ...editTimetableEntry,
                          startTime: e.target.value,
                        })
                    : handleTimetableInput
                }
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}:00
                  </option>
                ))}
              </select>

              <select
                name="endTime"
                value={
                  editTimetableEntry
                    ? editTimetableEntry.endTime
                    : timetableEntry.endTime
                }
                onChange={
                  editTimetableEntry
                    ? (e) =>
                        setEditTimetableEntry({
                          ...editTimetableEntry,
                          endTime: e.target.value,
                        })
                    : handleTimetableInput
                }
              >
                {hours.map((h) => (
                  <option key={h} value={h}>
                    {h}:00
                  </option>
                ))}
              </select>

              {editTimetableEntry ? (
                <>
                  <button className="btn red" onClick={updateTimetableEntry}>
                    Update Entry
                  </button>
                  <button
                    className="btn"
                    onClick={() => setEditTimetableEntry(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button className="btn red" onClick={addTimetableEntry}>
                  Add Entry
                </button>
              )}
            </div>

            {/* Timetable Display */}
            <table className="timetable-table">
              <thead>
                <tr>
                  <th></th>
                  {hours.map((h) => (
                    <th key={h}>{h}:00</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => (
                  <tr key={day}>
                    <td>
                      <strong>{day}</strong>
                    </td>
                    {hours.map((hour) => {
                      const entry = timetables[selectedClass].find(
                        (e) =>
                          e.day === day &&
                          parseInt(e.start_time) <= hour &&
                          parseInt(e.end_time) > hour
                      );

                      return (
                        <td
                          key={hour}
                          className={`timetable-cell ${
                            entry ? "occupied" : ""
                          }`}
                        >
                          {entry && parseInt(entry.start_time) === hour ? (
                            <div className="entry">
                              <div>
                                <strong>{entry.course_code}</strong>
                              </div>
                              <div>{entry.lecturer_name}</div>
                              <div>{entry.location}</div>
                              <div className="timetable-actions">
                                <button
                                  onClick={() => handleEditTimetable(entry)}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteTimetable(entry.id)
                                  }
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : entry ? (
                            <div className="entry-continued"></div>
                          ) : null}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Student View Modal */}
        {viewStudent && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Student Details</h2>
              {viewStudent.imagePath && (
                <div className="student-image">
                  <img
                    src={`http://localhost/facial-attendance-backend/${viewStudent.imagePath}`}
                    alt="Student"
                    style={{ width: "150px" }}
                  />
                </div>
              )}
              <div className="student-details">
                <p>
                  <strong>ID:</strong> {viewStudent.studentId}
                </p>
                <p>
                  <strong>Name:</strong> {viewStudent.name}
                </p>
                <p>
                  <strong>Email:</strong> {viewStudent.email}
                </p>
                <p>
                  <strong>Course:</strong> {viewStudent.course}
                </p>
                <p>
                  <strong>Semester:</strong> {viewStudent.semester}
                </p>
              </div>
              <button className="btn" onClick={() => setViewStudent(null)}>
                Close
              </button>
            </div>
          </div>
        )}

        {/* Lecturer View Modal */}
        {viewLecturer && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Lecturer Details</h2>
              <div className="student-details">
                <p>
                  <strong>ID:</strong> {viewLecturer.lecturerId}
                </p>
                <p>
                  <strong>Name:</strong> {viewLecturer.name}
                </p>
                <p>
                  <strong>Email:</strong> {viewLecturer.email}
                </p>
                <p>
                  <strong>Teaching Level:</strong> {viewLecturer.teachingLevel}
                </p>
                <p>
                  <strong>Department:</strong> {viewLecturer.department}
                </p>
              </div>
              <button className="btn" onClick={() => setViewLecturer(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;