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

$sql = "SELECT id, lecturerId, name, email, teachingLevel, department FROM lecturers";
$result = $conn->query($sql);

$lecturers = [];

while ($row = $result->fetch_assoc()) {
  $lecturers[] = $row;
}

echo json_encode($lecturers);
?>