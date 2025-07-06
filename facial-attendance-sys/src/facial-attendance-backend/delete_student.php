<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Content-Type: application/json");

include 'db.php';

$id = $_GET['id'] ?? '';

if ($id) {
  $stmt = $conn->prepare("DELETE FROM students WHERE id = ?");
  $stmt->bind_param("i", $id);
  if ($stmt->execute()) {
    echo json_encode(["message" => "Student deleted successfully."]);
  } else {
    echo json_encode(["error" => "Delete failed."]);
  }
} else {
  echo json_encode(["error" => "Missing student ID."]);
}
?>