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

$data = json_decode(file_get_contents('php://input'), true);

$required = ['class_name', 'course_code', 'lecturer_name', 'location', 'day', 'start_time', 'end_time'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

$class_name = $conn->real_escape_string($data['class_name']);
$course_code = $conn->real_escape_string($data['course_code']);
$lecturer_name = $conn->real_escape_string($data['lecturer_name']);
$location = $conn->real_escape_string($data['location']);
$day = $conn->real_escape_string($data['day']);
$start_time = (int)$data['start_time'];
$end_time = (int)$data['end_time'];

$query = "INSERT INTO timetable (class_name, course_code, lecturer_name, location, day, start_time, end_time)
          VALUES ('$class_name', '$course_code', '$lecturer_name', '$location', '$day', $start_time, $end_time)";

if ($conn->query($query)) {
    echo json_encode(['success' => true, 'message' => 'Timetable entry added successfully']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>