<?php
require './core/cors.php';
require './database/config.php'; // Database connection (PDO)
require './core/jwt.php'; // JWT handling


header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);

// Validate input
if (empty($data['email']) || empty($data['pin'])) {
    echo json_encode(["success" => false, "message" => "Email and PIN are required"]);
    exit();
}

$email = $data['email'];
$pin = $data['pin'];

// Check if user exists
$stmt = $pdo->prepare("SELECT id, email, role, pin FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if ($user && password_verify($pin, $user['pin'])) {
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
    echo json_encode(["success" => false, "message" => "Invalid credentials"]);
}
?>
