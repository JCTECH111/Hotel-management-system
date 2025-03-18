<?php
require './core/cors.php';
require './database/config.php'; // Database connection (mysqli)

// Fetch all rooms with their facilities and facility names
$stmt = $conn->prepare("
    SELECT 
        r.id, r.room_number, r.floor, r.type, r.price, r.status, r.capacity, r.bed_type, r.created_at,
        GROUP_CONCAT(f.name) AS facility_names
    FROM rooms r
    LEFT JOIN room_facilities rf ON r.id = rf.room_id
    LEFT JOIN facilities f ON rf.facility_id = f.id
    GROUP BY r.id
");

// Execute the query
if ($stmt->execute()) {
    $result = $stmt->get_result();
    $rooms = [];

    // Fetch results as an associative array
    while ($row = $result->fetch_assoc()) {
        // Convert facility names from CSV string to array
        $row['facility_names'] = $row['facility_names'] ? explode(',', $row['facility_names']) : [];
        $rooms[] = $row;
    }

    // Return JSON response
    header('Content-Type: application/json');
    echo json_encode($rooms);
} else {
    // Handle query execution error
    http_response_code(500);
    echo json_encode(["message" => "Failed to fetch rooms."]);
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>