<!-- https://www.figma.com/design/9koTuTxNKMphNcX2vQq6XG/Hotel-Management-Dashboard-(Community)?m=auto&is-community-duplicate=1&fuid=1377723531169749011 -->

<?php
require './core/cors.php';
require './database/config.php'; // Database connection (PDO)


$data = json_decode(file_get_contents("php://input"));

if (!isset($data->username) || !isset($data->email) || !isset($data->phone) || !isset($data->password)) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit();
}

$username = $data->username;
$email = $data->email;
$phone = $data->phone;
$password = password_hash($data->password, PASSWORD_DEFAULT);

// Check if email exists
$stmt = $pdo->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit();
}

// Insert new user
$stmt = $pdo->prepare("INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)");
if ($stmt->execute([$username, $email, $phone, $password])) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Signup failed"]);
}
?>
