<?php
require '../database/config.php'; // Database connection (MySQLi)
// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return HTTP 200 status for preflight requests
    http_response_code(200);
    exit;
}

require '../vendor/autoload.php'; // Load PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function sendOtp($email, $otp) {
    $mail = new PHPMailer(true);

    try {
        // Load the OTP email template
        $htmlTemplate = file_get_contents("../auth/otp_template.html");
        $htmlTemplate = str_replace("123456", $otp, $htmlTemplate); // Replace OTP in the template

        // SMTP Configuration - Update these with your actual SMTP credentials
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';
        $mail->SMTPAuth   = true;
        $mail->Username   = 'tunesflix.movie@gmail.com';
        $mail->Password   = 'vstmuygbtfbksqow'; // Use App Password for Gmail
        $mail->SMTPSecure = 'ssl';
        $mail->Port       = 465;

        // Email Headers
        $mail->setFrom('jctech333@gmail.com', '5 star Hotel');
        $mail->addAddress($email);

        // Email Content
        $mail->isHTML(true);
        $mail->Subject = 'Your OTP Code';
        $mail->Body    = $htmlTemplate;

        // Send Email
        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Email could not be sent. Error: {$mail->ErrorInfo}");
        return false;
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents("php://input"), true);
    
    // Validate required fields
    if (empty($data['email']) || empty($data['currentPassword']) || empty($data['changeType'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Missing required fields']);
        exit;
    }

    $email = $conn->real_escape_string($data['email']);
    $password = $data['currentPassword'];
    $changeType = $data['changeType'];

    try {
        // 1. Verify user exists and password is correct
        $stmt = $conn->prepare("SELECT id, pin FROM users WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        if ($result->num_rows === 0) {
            http_response_code(404);
            echo json_encode(['status' => 'error', 'message' => 'User not found']);
            exit;
        }

        $user = $result->fetch_assoc();
        
        // Verify password (assuming passwords are hashed in the database)
        if (!password_verify($password, $user['pin'])) {
            http_response_code(401);
            echo json_encode(['status' => 'error', 'message' => 'Invalid password']);
            exit;
        }

        // 2. Generate and store OTP
        $otp = rand(100000, 999999);
        $otpExpiry = date('Y-m-d H:i:s', strtotime('+10 minutes')); // OTP valid for 10 minutes
        
        // Store OTP in database (alternative to session)
        $stmt = $conn->prepare("UPDATE users SET otp = ?, otp_expiry = ? WHERE id = ?");
        $stmt->bind_param("ssi", $otp, $otpExpiry, $user['id']);
        $stmt->execute();
        
        // 3. Send OTP via email
        $emailSent = sendOtp($email, $otp);
        
        if (!$emailSent) {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Failed to send OTP']);
            exit;
        }

        // 4. Return success response
        http_response_code(200);
        echo json_encode([
            'status' => 'success', 
            'message' => 'OTP sent to your email',
            'userId' => $user['id'] // Return user ID for subsequent requests
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Server error: ' . $e->getMessage()]);
    } finally {
        if (isset($stmt)) $stmt->close();
        $conn->close();
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>