<?php
require '../vendor/autoload.php';

use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dotenv\Dotenv;

// Load environment variables
$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$secret_key = $_ENV['JWT_SECRET']; // Securely loaded key
function generateJWT($user_id, $role) {
    global $secret_key;
    $payload = [
        "iat" => time(),
        "exp" => time() + (60 * 60 * 24), // Expires in 24 hours
        "user_id" => $user_id,
        "role" => $role,
    ];
    return JWT::encode($payload, $secret_key, 'HS256');
}

function validateJWT($token) {
    global $secret_key;
    try {
        $decoded = JWT::decode($token, new Key($secret_key, 'HS256'));
        return ["id" => $decoded->user_id];
    } catch (Exception $e) {
        return false;
    }
}

?>
