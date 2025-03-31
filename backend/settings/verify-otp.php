<?php
require '../database/config.php'; // Database connection (MySQLi)

// Set headers for CORS and JSON response
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
    // Get the raw POST data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate required fields
    if (empty($data['otp']) || empty($data['email']) || empty($data['changeType'])) {
        http_response_code(400);
        echo json_encode([
            'status' => 'error', 
            'message' => 'Missing required fields',
            'code' => 'MISSING_FIELDS'
        ]);
        exit;
    }

    $email = $conn->real_escape_string($data['email']);
    $inputOtp = $conn->real_escape_string($data['otp']);
    $changeType = $conn->real_escape_string($data['changeType']);

    try {
        // 1. Get user's OTP and expiry time from database
        $stmt = $conn->prepare("SELECT id, otp, otp_expiry FROM users WHERE email = ?");
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

        // 2. Check if OTP exists
        if (empty($user['otp'])) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error', 
                'message' => 'No OTP requested for this user',
                'code' => 'NO_OTP_REQUESTED'
            ]);
            exit;
        }

        // 3. Check OTP expiry
        $currentDateTime = date('Y-m-d H:i:s');
        if ($user['otp_expiry'] < $currentDateTime) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error', 
                'message' => 'OTP has expired. Please request a new one.',
                'code' => 'OTP_EXPIRED'
            ]);
            exit;
        }

        // 4. Verify OTP matches
        if ($user['otp'] !== $inputOtp) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error', 
                'message' => 'Invalid OTP. Please try again.',
                'code' => 'INVALID_OTP'
            ]);
            exit;
        }

        // 5. If everything is valid, clear OTP from database
        $clearStmt = $conn->prepare("UPDATE users SET otp = NULL, otp_expiry = NULL WHERE id = ?");
        $clearStmt->bind_param("i", $user['id']);
        $clearStmt->execute();

        // 6. Generate a verification token for the next step
        $verificationToken = bin2hex(random_bytes(32));
        $tokenExpiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        $tokenStmt = $conn->prepare("UPDATE users SET verification_token = ?, token_expiry = ? WHERE id = ?");
        $tokenStmt->bind_param("ssi", $verificationToken, $tokenExpiry, $user['id']);
        $tokenStmt->execute();

        // 7. Return success response with token
        http_response_code(200);
        echo json_encode([
            'status' => 'success',
            'message' => 'OTP verified successfully!',
            'token' => $verificationToken,
            'userId' => $user['id'],
            'changeType' => $changeType
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
        if (isset($clearStmt)) $clearStmt->close();
        if (isset($tokenStmt)) $tokenStmt->close();
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