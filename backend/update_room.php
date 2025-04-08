<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 3600");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require './database/config.php'; // Your database connection file

// Verify Authorization header
$headers = getallheaders();
if (!isset($headers['Authorization'])) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Authorization header missing']);
    exit;
}

$token = str_replace('Bearer ', '', $headers['Authorization']);

// Verify token (implement your own token verification logic)
if (!verifyToken($token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Invalid or expired token']);
    exit;
}

// Only process POST requests
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate input
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit;
    }

    $requiredFields = ['roomId', 'status', 'housekeeperName'];
    foreach ($requiredFields as $field) {
        if (!isset($input[$field]) || empty($input[$field])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => "Missing required field: $field"]);
            exit;
        }
    }

    // Validate status value
    $validStatuses = ['Pending', 'In Progress', 'Completed'];
    if (!in_array($input['status'], $validStatuses)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid status value']);
        exit;
    }

    try {
        // Update room status in database
        $stmt = $conn->prepare("
            INSERT INTO housekeeping (room_id, housekeeper_name, status, updated_at)
            VALUES (?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            housekeeper_name = VALUES(housekeeper_name),
            updated_at = VALUES(updated_at)
        ");
        
        $stmt->bind_param("iss", $input['roomId'], $input['housekeeperName'], $input['status']);
        $stmt->execute();

        // Update room status in rooms table if needed
        if ($input['status'] === 'Completed') {
            $updateRoom = $conn->prepare("UPDATE rooms SET status = 'Available' WHERE id = ?");
            $updateRoom->bind_param("i", $input['roomId']);
            $updateRoom->execute();
        }

        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Room status updated successfully',
            'updated_at' => date('Y-m-d H:i:s')
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to update room status',
            'error' => $e->getMessage()
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
}

// Token verification function (replace with your actual implementation)
function verifyToken($token) {
    // Example: Verify JWT token
    // You should implement proper token verification based on your auth system
    return !empty($token); // This is just a placeholder
}