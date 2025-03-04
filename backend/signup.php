

<?php
require './core/cors.php';
require './database/config.php'; // Database connection (PDO)


// Read raw JSON input
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);

// Debugging: Log raw input and parsed JSON
file_put_contents("debug.log", "Raw Input: " . $rawInput . "\n", FILE_APPEND);
file_put_contents("debug.log", "Parsed JSON: " . print_r($data, true) . "\n", FILE_APPEND);

// Ensure JSON decoding didn't fail
if (!$data) {
    echo json_encode(["success" => false, "message" => "Invalid JSON input"]);
    exit();
}

// ✅ **Sanitize and filter input**
$username = isset($data["username"]) ? trim(filter_var($data["username"], FILTER_SANITIZE_STRING)) : null;
$email = isset($data["email"]) ? trim(filter_var($data["email"], FILTER_SANITIZE_EMAIL)) : null;
$phone = isset($data["phone"]) ? trim(filter_var($data["phone"], FILTER_SANITIZE_NUMBER_INT)) : null;
$password = isset($data["password"]) ? trim($data["password"]) : null;
$role = isset($data["role"]) ? trim(filter_var($data["role"], FILTER_SANITIZE_STRING)) : "guest";

// ✅ **Validate input**
if (!$username || !$email || !$phone || !$password) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email format"]);
    exit();
}
// git commit -m "added smtp", git branch -M main, git push -u origin main
if (!preg_match("/^[0-9]{10,15}$/", $phone)) {
    echo json_encode(["success" => false, "message" => "Invalid phone number"]);
    exit();
}

// ✅ **Hash the password securely**
// ✅ **Convert password to Base64**
$encodedPassword = base64_encode($password);

// Validate required fields
if (!$username || !$email || !$phone || !$password) {
    echo json_encode(["success" => false, "message" => "Invalid input"]);
    exit();
}


// Check if email exists
$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(["success" => false, "message" => "Email already exists"]);
    exit();
}

// Insert new user
$stmt = $conn->prepare("INSERT INTO users (username, email, phone, pin, role) VALUES (?, ?, ?, ?, ?)");
if ($stmt->execute([$username, $email, $phone, $encodedPassword, $role])) {
    echo json_encode(["success" => true, "message" => "User registered successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Signup failed"]);
    exit();
}
$stmt->close();
$conn->close();
?>
