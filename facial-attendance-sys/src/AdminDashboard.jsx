import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("student");

  const [students, setStudents] = useState([]);
  const [lecturers, setLecturers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);
  const [viewLecturer, setViewLecturer] = useState(null);
  const [editLecturer, setEditLecturer] = useState(null);

  const [newStudent, setNewStudent] = useState({
    studentId: "",
    name: "",
    email: "",
    course: "",
    semester: "",
    image: null,
  });

  const [newLecturer, setNewLecturer] = useState({
    lecturerId: "",
    name: "",
    email: "",
    teachingLevel: "",
    department: "",
  });

  useEffect(() => {
    fetchStudents();
    fetchLecturers();
  }, []);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const fetchStudents = () => {
    fetch("http://localhost/facial-attendance-backend/get_students.php")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  const fetchLecturers = () => {
    fetch("http://localhost/facial-attendance-backend/get_lecturers.php")
      .then((res) => res.json())
      .then((data) => setLecturers(data));
  };

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

  const handleAddStudent = () => {
    const formData = new FormData();
    Object.entries(newStudent).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    fetch("http://localhost/facial-attendance-backend/add_student.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || data.error);
        setShowForm(false);
        setNewStudent({
          studentId: "",
          name: "",
          email: "",
          course: "",
          semester: "",
          image: null,
        });
        fetchStudents();
      });
  };

  const handleAddLecturer = () => {
    fetch("http://localhost/facial-attendance-backend/add_lecturer.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLecturer),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || data.error);
        setShowForm(false);
        setNewLecturer({
          lecturerId: "",
          name: "",
          email: "",
          teachingLevel: "",
          department: "",
        });
        fetchLecturers();
      });
  };

  const handleViewStudent = (student) => setViewStudent(student);
  const handleViewLecturer = (lecturer) => setViewLecturer(lecturer);

  const handleEditStudent = (student) => {
    setEditStudent({ ...student, newImage: null });
  };

  const handleEditLecturer = (lecturer) => {
    setEditLecturer({ ...lecturer });
  };

  const handleDeleteStudent = (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      fetch(`http://localhost/facial-attendance-backend/delete_student.php?id=${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || data.error);
          fetchStudents();
        });
    }
  };

  const handleDeleteLecturer = (id) => {
    if (window.confirm("Are you sure you want to delete this lecturer?")) {
      fetch(`http://localhost/facial-attendance-backend/delete_lecturer.php?id=${id}`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          alert(data.message || data.error);
          fetchLecturers();
        });
    }
  };

  const submitEditStudent = () => {
    const formData = new FormData();
    Object.entries(editStudent).forEach(([key, value]) => {
      if (value && key !== "newImage") formData.append(key, value);
    });
    if (editStudent.newImage) {
      formData.append("image", editStudent.newImage);
    }

    fetch("http://localhost/facial-attendance-backend/edit_student.php", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || data.error);
        setEditStudent(null);
        fetchStudents();
      });
  };

  const submitEditLecturer = () => {
    fetch("http://localhost/facial-attendance-backend/edit_lecturer.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editLecturer),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || data.error);
        setEditLecturer(null);
        fetchLecturers();
      });
  };

  return (
    <div className="container">
      <div className="sidebar">
        <h2>Facial Recognition<br />Attendance System</h2>
        <nav className="nav-menu">
          <ul>
            <li className="dropdown">
              <div className="dropdown-toggle" onClick={toggleDropdown}>
                Manage Users <span>{dropdownOpen ? "▲" : "▼"}</span>
              </div>
              <ul className={dropdownOpen ? "" : "hidden"}>
                <li className={activeTab === "student" ? "active" : ""} onClick={() => setActiveTab("student")}>Student</li>
                <li className={activeTab === "lecturer" ? "active" : ""} onClick={() => setActiveTab("lecturer")}>Lecturer</li>
              </ul>
            </li>
            <li>Course Management</li>
          </ul>
        </nav>
        <div className="bottom">
          <button className="logout" onClick={() => (window.location.href = "/")}>Log Out</button>
        </div>
      </div>

      <div className="main">
        <h1 className="center-title">Admin Dashboard</h1>

        <div className="top-controls">
          <button className="btn red" onClick={() => setShowForm(true)}>
            {activeTab === "student" ? "Add Student" : "Add Lecturer"}
          </button>
          <input type="text" className="search" placeholder="Search" />
        </div>

        {/* Add Student or Lecturer Form */}
        {showForm && activeTab === "student" && (
          <div className="student-form">
            <h3>Add Student</h3>
            <input type="text" name="studentId" placeholder="Student ID" value={newStudent.studentId} onChange={handleInputChange} />
            <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleInputChange} />
            <input type="text" name="course" placeholder="Course" value={newStudent.course} onChange={handleInputChange} />
            <input type="number" name="semester" placeholder="Semester" value={newStudent.semester} onChange={handleInputChange} />
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <div>
              <button className="btn red" onClick={handleAddStudent}>Submit</button>
              <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {showForm && activeTab === "lecturer" && (
          <div className="student-form">
            <h3>Add Lecturer</h3>
            <input type="text" name="lecturerId" placeholder="Lecturer ID" value={newLecturer.lecturerId} onChange={handleInputChange} />
            <input type="text" name="name" placeholder="Name" value={newLecturer.name} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" value={newLecturer.email} onChange={handleInputChange} />
            <input type="text" name="teachingLevel" placeholder="Teaching Level" value={newLecturer.teachingLevel} onChange={handleInputChange} />
            <input type="text" name="department" placeholder="Department" value={newLecturer.department} onChange={handleInputChange} />
            <div>
              <button className="btn red" onClick={handleAddLecturer}>Submit</button>
              <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Edit Student */}
        {editStudent && activeTab === "student" && (
          <div className="student-form">
            <h3>Edit Student</h3>
            <input type="text" value={editStudent.studentId} onChange={(e) => setEditStudent({ ...editStudent, studentId: e.target.value })} />
            <input type="text" value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} />
            <input type="email" value={editStudent.email} onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} />
            <input type="text" value={editStudent.course} onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })} />
            <input type="number" value={editStudent.semester} onChange={(e) => setEditStudent({ ...editStudent, semester: e.target.value })} />
            <input type="file" accept="image/*" onChange={(e) => setEditStudent({ ...editStudent, newImage: e.target.files[0] })} />
            <div>
              <button className="btn red" onClick={submitEditStudent}>Update</button>
              <button className="btn" onClick={() => setEditStudent(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Edit Lecturer */}
        {editLecturer && activeTab === "lecturer" && (
          <div className="student-form">
            <h3>Edit Lecturer</h3>
            <input type="text" value={editLecturer.lecturerId} onChange={(e) => setEditLecturer({ ...editLecturer, lecturerId: e.target.value })} />
            <input type="text" value={editLecturer.name} onChange={(e) => setEditLecturer({ ...editLecturer, name: e.target.value })} />
            <input type="email" value={editLecturer.email} onChange={(e) => setEditLecturer({ ...editLecturer, email: e.target.value })} />
            <input type="text" value={editLecturer.teachingLevel} onChange={(e) => setEditLecturer({ ...editLecturer, teachingLevel: e.target.value })} />
            <input type="text" value={editLecturer.department} onChange={(e) => setEditLecturer({ ...editLecturer, department: e.target.value })} />
            <div>
              <button className="btn red" onClick={submitEditLecturer}>Update</button>
              <button className="btn" onClick={() => setEditLecturer(null)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Tables */}
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
              {students.map((student, index) => (
                <tr key={student.id}>
                  <td>{index + 1}</td>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.email}</td>
                  <td>{student.course}</td>
                  <td>{student.semester}</td>
                  <td className="status active">Active</td>
                  <td className="icons">
                    <span title="View" onClick={() => handleViewStudent(student)}>🔍</span>
                    <span title="Edit" onClick={() => handleEditStudent(student)}>✏️</span>
                    <span title="Delete" onClick={() => handleDeleteStudent(student.id)}>🗑️</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
              {lecturers.map((lecturer, index) => (
                <tr key={lecturer.id}>
                  <td>{index + 1}</td>
                  <td>{lecturer.lecturerId}</td>
                  <td>{lecturer.name}</td>
                  <td>{lecturer.email}</td>
                  <td>{lecturer.teachingLevel}</td>
                  <td>{lecturer.department}</td>
                  <td className="status active">Active</td>
                  <td className="icons">
                    <span title="View" onClick={() => handleViewLecturer(lecturer)}>🔍</span>
                    <span title="Edit" onClick={() => handleEditLecturer(lecturer)}>✏️</span>
                    <span title="Delete" onClick={() => handleDeleteLecturer(lecturer.id)}>🗑️</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <p><strong>ID:</strong> {viewStudent.studentId}</p>
                <p><strong>Name:</strong> {viewStudent.name}</p>
                <p><strong>Email:</strong> {viewStudent.email}</p>
                <p><strong>Course:</strong> {viewStudent.course}</p>
                <p><strong>Semester:</strong> {viewStudent.semester}</p>
              </div>
              <button className="btn" onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        )}

        {/* Lecturer View Modal */}
        {viewLecturer && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Lecturer Details</h2>
              <div className="student-details">
                <p><strong>ID:</strong> {viewLecturer.lecturerId}</p>
                <p><strong>Name:</strong> {viewLecturer.name}</p>
                <p><strong>Email:</strong> {viewLecturer.email}</p>
                <p><strong>Teaching Level:</strong> {viewLecturer.teachingLevel}</p>
                <p><strong>Department:</strong> {viewLecturer.department}</p>
              </div>
              <button className="btn" onClick={() => setViewLecturer(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;