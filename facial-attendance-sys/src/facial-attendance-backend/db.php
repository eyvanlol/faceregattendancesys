<?php
$host = "localhost";
$user = "root"; // default in XAMPP
$password = ""; // default is blank
$dbname = "student_record";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

die("THIS IS THE CORRECT DB.PHP");
?>