<?php
require './core/cors.php';
require './database/config.php'; // Database connection (PDO)
require './core/jwt.php'; // JWT handling


header("Content-Type: application/json");

// Read raw JSON input
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

// Validate input
if (empty($data['email']) && empty($data['pin'])) {
    echo json_encode(["success" => false, "message" => "Email and PIN are required"]);
    exit();
}

$email = $data['email'];
$pin = $data['pin'];

// Check if user exists
$stmt = $conn->prepare("SELECT id, email, role, pin FROM users WHERE email = ? OR username = ?");
$stmt->bind_param("ss", $email,$email);
$stmt->execute();

// Fetch data correctly for `mysqli`
$result = $stmt->get_result();
$user = $result->fetch_assoc();
if (isset($user)) {
    if (password_verify($pin, $user['pin'])) {
        $token = generateJWT($user['id'], $user['role']); // Generate JWT token

        echo json_encode([
            "success" => true,
            "token" => $token,
            "user" => [
                "id" => $user['id'],
                "email" => $user['email'],
                "role" => $user['role']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Wrong Password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No user found"]);
}
$stmt->close();
$conn->close();
?>
