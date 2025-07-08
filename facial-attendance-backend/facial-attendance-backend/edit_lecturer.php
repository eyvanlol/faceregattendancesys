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

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Validate input
$id = $data["id"] ?? null;
$lecturerId = trim($data["lecturerId"] ?? "");
$name = trim($data["name"] ?? "");
$email = trim($data["email"] ?? "");
$teachingLevel = trim($data["teachingLevel"] ?? "");
$department = trim($data["department"] ?? "");

if (!$id || $lecturerId === "" || $name === "" || $email === "" || $teachingLevel === "" || $department === "") {
    echo json_encode(["error" => "Invalid input. All fields are required."]);
    exit();
}

// Update the database
$stmt = $conn->prepare("UPDATE lecturers SET lecturerId=?, name=?, email=?, teachingLevel=?, department=? WHERE id=?");
$stmt->bind_param("sssssi", $lecturerId, $name, $email, $teachingLevel, $department, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Lecturer updated successfully."]);
} else {
    echo json_encode(["error" => "Update failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
?>