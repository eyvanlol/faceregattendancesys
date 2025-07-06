<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}

include 'db.php';

$sql = "SELECT id, studentId, name, email, course, semester FROM students";
$result = $conn->query($sql);

$students = [];

while ($row = $result->fetch_assoc()) {
  $students[] = $row;
}

echo json_encode($students);
?>

