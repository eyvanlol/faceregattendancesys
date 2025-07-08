<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

// Get and decode input
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit();
}

// Extract and sanitize values
$lecturerId = trim($data["lecturerId"] ?? "");
$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$teachingLevel = trim($data["teachingLevel"] ?? "");
$department = trim($data["department"] ?? "");

// Validate input
if ($lecturerId === "" || $name === "" || $email === "" || $teachingLevel === "" || $department === "") {
    echo json_encode(["error" => "Invalid input. Please fill in all fields."]);
    exit();
}

// Insert into DB
$stmt = $conn->prepare("INSERT INTO lecturers (lecturerId, name, email, teachingLevel, department) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $lecturerId, $name, $email, $teachingLevel, $department);

if ($stmt->execute()) {
    echo json_encode(["message" => "Lecturer added successfully"]);
} else {
    echo json_encode(["error" => "Database error: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>