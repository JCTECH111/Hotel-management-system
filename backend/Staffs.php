<?php
require './database/config.php'; // Database connection (PDO)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function validateStaffData($data, $isUpdate = false) {
    $errors = [];
    
    if (!$isUpdate && (empty($data['username']) || strlen($data['username']) > 100)) {
        $errors[] = 'Username is required and must be 100 characters or less';
    };
    
    if (!$isUpdate && (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL))) {
        $errors[] = 'Valid email is required';
    }
    
    if (isset($data['phone']) && strlen($data['phone']) < 11) {
        $errors[] = 'Phone number must be 11 characters or more';
    }
    
    if (!$isUpdate && (empty($data['pin']) || strlen($data['pin']) < 6)) {
        $errors[] = 'PIN must be at least 6 characters';
    }
    
    $validRoles = ['guest', 'employee', 'housekeeper', 'manager'];
    if (empty($data['role']) || !in_array($data['role'], $validRoles)) {
        $errors[] = 'Valid role is required';
    }
    
    return $errors;
}

// GET all staff
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = "SELECT id, username, email, phone, role, created_at FROM users";
        $result = $conn->query($query);
        
        $staffs = [];
        while ($row = $result->fetch_assoc()) {
            $staffs[] = $row;
        }
        
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'data' => $staffs
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to fetch staff',
            'error' => $e->getMessage()
        ]);
    }
}

// CREATE new staff
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $errors = validateStaffData($data);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $errors
        ]);
        exit;
    }
    
    try {
        // Check if email already exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->bind_param("s", $data['email']);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows > 0) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Email already exists'
            ]);
            exit;
        }
        
        // Hash the PIN
        $hashedPin = password_hash($data['pin'], PASSWORD_DEFAULT);
        
        $stmt = $conn->prepare("INSERT INTO users (username, email, phone, pin, role) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("sssss", 
            $data['username'],
            $data['email'],
            $data['phone'],
            $hashedPin,
            $data['role']
        );
        
        if ($stmt->execute()) {
            $newStaffId = $stmt->insert_id;
            
            // Get the newly created staff
            $stmt = $conn->prepare("SELECT id, username, email, phone, role, created_at FROM users WHERE id = ?");
            $stmt->bind_param("i", $newStaffId);
            $stmt->execute();
            $result = $stmt->get_result();
            $newStaff = $result->fetch_assoc();
            
            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'Staff created successfully',
                'data' => $newStaff
            ]);
        } else {
            throw new Exception("Failed to create staff");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to create staff',
            'error' => $e->getMessage()
        ]);
    }
}

// UPDATE staff
if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = json_decode(file_get_contents("php://input"), true);
    $staffId = $_GET['id'] ?? null;
    
    if (empty($staffId)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Staff ID is required'
        ]);
        exit;
    }
    
    $errors = validateStaffData($data, true);
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Validation failed',
            'errors' => $errors
        ]);
        exit;
    }
    
    try {
        // Check if staff exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->bind_param("i", $staffId);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Staff not found'
            ]);
            exit;
        }
        
        // Build dynamic update query
        $updates = [];
        $params = [];
        $types = '';
        
        if (isset($data['username'])) {
            $updates[] = "username = ?";
            $params[] = $data['username'];
            $types .= "s";
        }
        
        if (isset($data['email'])) {
            // Check if new email is unique
            $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
            $stmt->bind_param("si", $data['email'], $staffId);
            $stmt->execute();
            $stmt->store_result();
            
            if ($stmt->num_rows > 0) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'Email already in use by another staff'
                ]);
                exit;
            }
            
            $updates[] = "email = ?";
            $params[] = $data['email'];
            $types .= "s";
        }
        
        if (isset($data['phone'])) {
            $updates[] = "phone = ?";
            $params[] = $data['phone'];
            $types .= "s";
        }
        
        if (isset($data['pin'])) {
            $hashedPin = password_hash($data['pin'], PASSWORD_DEFAULT);
            $updates[] = "pin = ?";
            $params[] = $hashedPin;
            $types .= "s";
        }
        
        if (isset($data['role'])) {
            $updates[] = "role = ?";
            $params[] = $data['role'];
            $types .= "s";
        }
        
        if (empty($updates)) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'No valid fields to update'
            ]);
            exit;
        }
        
        $query = "UPDATE users SET " . implode(", ", $updates) . " WHERE id = ?";
        $types .= "i";
        $params[] = $staffId;
        
        $stmt = $conn->prepare($query);
        $stmt->bind_param($types, ...$params);
        
        if ($stmt->execute()) {
            // Get the updated staff
            $stmt = $conn->prepare("SELECT id, username, email, phone, role, created_at FROM users WHERE id = ?");
            $stmt->bind_param("i", $staffId);
            $stmt->execute();
            $result = $stmt->get_result();
            $updatedStaff = $result->fetch_assoc();
            
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Staff updated successfully',
                'data' => $updatedStaff
            ]);
        } else {
            throw new Exception("Failed to update staff");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to update staff',
            'error' => $e->getMessage()
        ]);
    }
}

// DELETE staff
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $staffId = $_GET['id'] ?? null;
    
    if (empty($staffId)) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error',
            'message' => 'Staff ID is required'
        ]);
        exit;
    }
    
    try {
        // Check if staff exists
        $stmt = $conn->prepare("SELECT id FROM users WHERE id = ?");
        $stmt->bind_param("i", $staffId);
        $stmt->execute();
        $stmt->store_result();
        
        if ($stmt->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'Staff not found'
            ]);
            exit;
        }
        
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param("i", $staffId);
        
        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode([
                'status' => 'success',
                'message' => 'Staff deleted successfully'
            ]);
        } else {
            throw new Exception("Failed to delete staff");
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Failed to delete staff',
            'error' => $e->getMessage()
        ]);
    }
}