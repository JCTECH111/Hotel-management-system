<?php
require './database/config.php'; // Database connection (mysqli)
header("Access-Control-Allow-Origin: http://localhost:5173"); // Allow frontend URL exactly
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get all rooms needing cleaning
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("
        SELECT r.id, r.room_number, r.floor, r.type, r.status as room_status,
               h.status as cleaning_status, h.housekeeper_name, h.updated_at as last_updated
        FROM rooms r
        LEFT JOIN housekeeping h ON r.id = h.room_id
        WHERE r.status IN ('Occupied', 'Cleaning') OR h.status != 'Completed' OR h.status IS NULL
        ORDER BY 
            CASE WHEN h.status = 'Pending' THEN 0
                 WHEN h.status = 'In Progress' THEN 1
                 WHEN h.status IS NULL THEN 2
                 ELSE 3 END,
            r.floor, r.room_number
    ");
    $stmt->execute();
    $result= $stmt->get_result();
    $rooms = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($rooms);
}

// Update cleaning status
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $roomId = $data['roomId'] ?? null;
    $status = $data['status'] ?? null;
    $housekeeperName = $data['housekeeperName'] ?? null;
    
    if (!$roomId || !$status || !$housekeeperName) {
        echo json_encode(['success' => false, 'message' => 'Missing parameters'], 400);
    }
    
    // Check if record exists
    $stmt = $conn->prepare("SELECT * FROM housekeeping WHERE room_id = ?");
    $stmt->execute([$roomId]);
    $result= $stmt->get_result();
    
    if ($result->num_rows > 0) {
        // Update existing record
        $stmt = $conn->prepare("
            UPDATE housekeeping 
            SET status = ?, housekeeper_name = ?, updated_at = NOW() 
            WHERE room_id = ?
        ");
        $stmt->execute([$status, $housekeeperName, $roomId]);
    } else {
        // Create new record
        $stmt = $conn->prepare("
            INSERT INTO housekeeping (room_id, housekeeper_name, status, updated_at)
            VALUES (?, ?, ?, NOW())
        ");
        $stmt->execute([$roomId, $housekeeperName, $status]);
    }
    
    // Update room status if cleaning is completed
    if ($status === 'Completed') {
        $stmt = $conn->prepare("UPDATE rooms SET status = 'Available' WHERE id = ?");
        $stmt->execute([$roomId]);
    }
    
    echo json_encode(['success' => true]);
}
?>