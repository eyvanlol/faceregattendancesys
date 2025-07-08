<?php
$host = "localhost";
$user = "root"; // default in XAMPP
$password = ""; // default is blank
$dbname = "admin_dashboard";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}


?>