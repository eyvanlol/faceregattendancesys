import React, { useState, useEffect } from "react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editStudent, setEditStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    studentId: "",
    name: "",
    email: "",
    course: "",
    semester: "",
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    fetch("http://localhost/facial-attendance-backend/get_students.php")
      .then((res) => res.json())
      .then((data) => setStudents(data));
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewStudent({ ...newStudent, [name]: value });
  };

  const handleAddStudent = () => {
    const formData = new FormData();
    formData.append("studentId", newStudent.studentId);
    formData.append("name", newStudent.name);
    formData.append("email", newStudent.email);
    formData.append("course", newStudent.course);
    formData.append("semester", newStudent.semester);

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
        });
        fetchStudents();
      });
  };

  const handleViewStudent = (student) => {
    setViewStudent(student);
  };

  const handleEditStudent = (student) => {
    setEditStudent({ ...student });
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

  const submitEditStudent = () => {
    const formData = new FormData();
    formData.append("id", editStudent.id);
    formData.append("studentId", editStudent.studentId);
    formData.append("name", editStudent.name);
    formData.append("email", editStudent.email);
    formData.append("course", editStudent.course);
    formData.append("semester", editStudent.semester);

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

  return (
    <div className="container">
      <div className="sidebar">
        <h2>
          Facial Recognition
          <br />
          Attendance System
        </h2>

        <nav className="nav-menu">
          <ul>
            <li className="dropdown">
              <div className="dropdown-toggle" onClick={toggleDropdown}>
                Manage Users <span>{dropdownOpen ? "▲" : "▼"}</span>
              </div>
              <ul className={dropdownOpen ? "" : "hidden"}>
                <li className="active">Student</li>
                <li>Lecturer</li>
              </ul>
            </li>
            <li>Course Management</li>
          </ul>
        </nav>

        <div className="bottom">
          <button className="logout" onClick={() => (window.location.href = "/")}>
            Log Out
          </button>
        </div>
      </div>

      <div className="main">
        <h1 className="center-title">Admin Dashboard</h1>

        <div className="top-controls">
          <button className="btn red" onClick={() => setShowForm(true)}>Add Student</button>
          <button className="btn red">Bulk Imports</button>
          <input type="text" className="search" placeholder="Search" />
        </div>

        {showForm && (
          <div className="student-form">
            <h3>Add Student</h3>
            <input type="text" name="studentId" placeholder="Student ID" value={newStudent.studentId} onChange={handleInputChange} />
            <input type="text" name="name" placeholder="Name" value={newStudent.name} onChange={handleInputChange} />
            <input type="email" name="email" placeholder="Email" value={newStudent.email} onChange={handleInputChange} />
            <input type="text" name="course" placeholder="Course" value={newStudent.course} onChange={handleInputChange} />
            <input type="number" name="semester" placeholder="Semester" value={newStudent.semester} onChange={handleInputChange} />
            <div>
              <button className="btn red" onClick={handleAddStudent}>Submit</button>
              <button className="btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        )}

        {editStudent && (
          <div className="student-form">
            <h3>Edit Student</h3>
            <input type="text" value={editStudent.studentId} onChange={(e) => setEditStudent({ ...editStudent, studentId: e.target.value })} />
            <input type="text" value={editStudent.name} onChange={(e) => setEditStudent({ ...editStudent, name: e.target.value })} />
            <input type="email" value={editStudent.email} onChange={(e) => setEditStudent({ ...editStudent, email: e.target.value })} />
            <input type="text" value={editStudent.course} onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })} />
            <input type="number" value={editStudent.semester} onChange={(e) => setEditStudent({ ...editStudent, semester: e.target.value })} />
            <div>
              <button className="btn red" onClick={submitEditStudent}>Update</button>
              <button className="btn" onClick={() => setEditStudent(null)}>Cancel</button>
            </div>
          </div>
        )}

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

        <div className="pagination">
          <span className="active-page">1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
          <span>…</span>
          <span>10</span>
        </div>

        {viewStudent && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Student Details</h2>
              <p><strong>ID:</strong> {viewStudent.studentId}</p>
              <p><strong>Name:</strong> {viewStudent.name}</p>
              <p><strong>Email:</strong> {viewStudent.email}</p>
              <p><strong>Course:</strong> {viewStudent.course}</p>
              <p><strong>Semester:</strong> {viewStudent.semester}</p>
              <button className="btn" onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;