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

if (empty($data['id'])) {
    echo json_encode(['success' => false, 'error' => 'Entry ID is required']);
    exit;
}

$id = (int)$data['id'];
$class_name = $conn->real_escape_string($data['class_name'] ?? '');
$course_code = $conn->real_escape_string($data['course_code'] ?? '');
$lecturer_name = $conn->real_escape_string($data['lecturer_name'] ?? '');
$location = $conn->real_escape_string($data['location'] ?? '');
$day = $conn->real_escape_string($data['day'] ?? '');
$start_time = (int)($data['start_time'] ?? 0);
$end_time = (int)($data['end_time'] ?? 0);

$query = "UPDATE timetable SET 
            class_name = '$class_name',
            course_code = '$course_code',
            lecturer_name = '$lecturer_name',
            location = '$location',
            day = '$day',
            start_time = $start_time,
            end_time = $end_time
          WHERE id = $id";

if ($conn->query($query)) {
    echo json_encode(['success' => true, 'message' => 'Timetable entry updated successfully']);
} else {
    echo json_encode(['success' => false, 'error' => $conn->error]);
}

$conn->close();
?>