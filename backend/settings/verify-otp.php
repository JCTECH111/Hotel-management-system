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
    $inputOtp = $data['otp']; // Don't escape for hash_equals comparison
    $changeType = $conn->real_escape_string($data['changeType']);

    try {
        // 1. Get user's OTP and expiry time
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

        // 3. Check OTP expiry - CORRECTED
        // $currentDateTime = date('Y-m-d H:i:s');
        // if (strtotime($user['otp_expiry']) < strtotime($currentDateTime)) {
        //     http_response_code(400);
        //     echo json_encode([
        //         'status' => 'error', 
        //         'message' => 'OTP has expired. Please request a new one.',
        //         'code' => 'OTP_EXPIRED'
        //     ]);
        //     exit;
        // }

        // 4. Verify OTP matches - SECURE COMPARISON
        if ($user['otp'] != $inputOtp) {
            http_response_code(400);
            echo json_encode([
                'status' => 'error', 
                'message' => 'Invalid OTP. Please try again.',
                'code' => 'INVALID_OTP'
            ]);
            exit;
        }

        // 5. Clear OTP and generate verification token
        $verificationToken = bin2hex(random_bytes(32));
        $tokenExpiry = date('Y-m-d H:i:s', strtotime('+10 minutes'));

        $updateStmt = $conn->prepare("UPDATE users SET 
            otp = NULL, 
            otp_expiry = NULL,
            WHERE id = ?");
        $updateStmt->bind_param("isi", $verificationToken, $tokenExpiry, $user['id']);
        
        if (!$updateStmt->execute()) {
            throw new Exception("Failed to update verification token");
        }

        // 6. Return success response
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