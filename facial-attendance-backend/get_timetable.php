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

try {
    // Validate class parameter
    if (!isset($_GET['class'])) {
        throw new Exception("Class parameter is required");
    }

    $className = $conn->real_escape_string($_GET['class']);

    // Use prepared statement to prevent SQL injection
    $query = "SELECT * FROM timetable WHERE class_name = ? ORDER BY day, start_time";
    $stmt = $conn->prepare($query);
    
    if (!$stmt) {
        throw new Exception("Database query preparation failed: " . $conn->error);
    }

    $stmt->bind_param("s", $className);
    $stmt->execute();
    $result = $stmt->get_result();

    $entries = [];
    while ($row = $result->fetch_assoc()) {
        $entries[] = $row;
    }

    echo json_encode([
        'success' => true,
        'data' => $entries
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
} finally {
    if (isset($stmt)) $stmt->close();
    $conn->close();
}
?>