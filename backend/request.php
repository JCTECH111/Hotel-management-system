<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(response_code: 200);
    exit;
}

// Your existing database connection
require './database/config.php';
// Get guest requests
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $status = $_GET['status'] ?? null;
    
    $query = "
        SELECT r.*, g.full_name as guest_name, rm.room_number
        FROM guest_requests r
        JOIN guests g ON r.guest_id = g.id
        JOIN rooms rm ON r.room_id = rm.id
    ";
    
    if ($status) {
        $query .= " WHERE r.status = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$status]);
        $result = $stmt->get_result();
    } else {
        $stmt = $conn->prepare($query);
        $stmt->execute();
        $result = $stmt->get_result();
    }
    
    $requests = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($requests);
}

// Update request status
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $requestId = $data['requestId'] ?? null;
    $status = $data['status'] ?? null;
    
    if (!$requestId || !$status) {
        echo json_encode(['success' => false, 'message' => 'Missing parameters'], 400);
    }
    
    $stmt = $pdo->prepare("UPDATE guest_requests SET status = ? WHERE id = ?");
    $stmt->execute([$status, $requestId]);
    
    echo json_encode(['success' => true]);
}
?>