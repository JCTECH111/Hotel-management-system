<?php
require '../database/config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Validate required fields
    $requiredFields = ['email', 'newValue', 'changeType'];
    foreach ($requiredFields as $field) {
        if (empty($data[$field])) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Missing required fields',
                'code' => 'MISSING_FIELDS'
            ]);
            exit;
        }
    }

    $email = $conn->real_escape_string($data['email']);
    $currentPassword = $data['newValue'];
    $changeType = $conn->real_escape_string($data['changeType']);

    try {
        // 1. Verify current password
        $stmt = $conn->prepare("SELECT id, pin FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode([
                'status' => 'error',
                'message' => 'User not found',
                'code' => 'USER_NOT_FOUND'
            ]);
            exit;
        }

        $user = $result->fetch_assoc();

        if (password_verify($currentPassword, $user['pin'])) {
            http_response_code(401);
            echo json_encode([
                'status' => 'error',
                'message' => "Can not use Your old Password",
                'code' => 'INVALID_PASSWORD'
            ]);
            exit;
        }

        // 2. Update credentials based on change type
        if ($changeType === 'password') {
            if (empty($data['newValue'])) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'New password is required',
                    'code' => 'MISSING_PASSWORD'
                ]);
                exit;
            }

            $newPassword = password_hash($data['newValue'], PASSWORD_DEFAULT);
            $updateStmt = $conn->prepare("UPDATE users SET pin = ? WHERE id = ?");
            $updateStmt->bind_param("si", $newPassword, $user['id']);
        } 
        elseif ($changeType === 'username') {
            if (empty($data['newValue'])) {
                http_response_code(400);
                echo json_encode([
                    'status' => 'error',
                    'message' => 'New username is required',
                    'code' => 'MISSING_USERNAME'
                ]);
                exit;
            }

            $newUsername = $conn->real_escape_string($data['newValue']);
            $updateStmt = $conn->prepare("UPDATE users SET username = ? WHERE id = ?");
            $updateStmt->bind_param("si", $newUsername, $user['id']);
        } 
        else {
            http_response_code(400);
            echo json_encode([
                'status' => 'error',
                'message' => 'Invalid change type',
                'code' => 'INVALID_CHANGE_TYPE'
            ]);
            exit;
        }

        if (!$updateStmt->execute()) {
            throw new Exception("Failed to update credentials");
        }

        // 3. Return success response
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => ucfirst($changeType) . ' updated successfully!',
            'code' => 'CREDENTIALS_UPDATED'
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            'status' => 'error',
            'message' => 'Server error: ' . $e->getMessage(),
            'code' => 'SERVER_ERROR'
        ]);
    } finally {
        if (isset($stmt)) $stmt->close();
        if (isset($updateStmt)) $updateStmt->close();
        $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request method',
        'code' => 'INVALID_METHOD'
    ]);
}
?>