<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Parse URL query (e.g., ?id=5)
    parse_str($_SERVER['QUERY_STRING'], $params);
    $id = isset($params['id']) ? intval($params['id']) : 0;

    if ($id <= 0) {
        echo json_encode(["error" => "Invalid ID."]);
        exit();
    }

    // Prepare delete
    $stmt = $conn->prepare("DELETE FROM lecturers WHERE id = ?");
    $stmt->bind_param("i", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Lecturer deleted successfully."]);
    } else {
        echo json_encode(["error" => "Failed to delete lecturer: " . $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["error" => "Invalid request method."]);
}
?>
