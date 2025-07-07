<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

include 'db.php';

$studentId = $_POST['studentId'] ?? '';
$name = $_POST['name'] ?? '';
$email = $_POST['email'] ?? '';
$course = $_POST['course'] ?? '';
$semester = isset($_POST['semester']) ? intval($_POST['semester']) : 0;

if (!$studentId || !$name || !$email || !$course || !$semester) {
  echo json_encode(["error" => "Missing required fields"]);
  exit;
}

$imagePath = '';

if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
  $imageName = uniqid() . "_" . basename($_FILES['image']['name']);
  $targetDir = "uploads/";
  $targetPath = $targetDir . $imageName;

  if (!is_dir($targetDir)) {
    mkdir($targetDir, 0755, true);
  }

  if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
    $imagePath = $targetPath;
  }
}

$sql = "INSERT INTO students (studentId, name, email, course, semester, imagePath) VALUES (?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ssssis", $studentId, $name, $email, $course, $semester, $imagePath);

if ($stmt->execute()) {
  echo json_encode(["message" => "Student added successfully."]);
} else {
  echo json_encode(["error" => "Failed to add student."]);
}
?>