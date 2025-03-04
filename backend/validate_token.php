
<?php
require './core/cors.php';
require 'jwt.php';


$data = json_decode(file_get_contents("php://input"));

if (!isset($data->token)) {
    echo json_encode(["success" => false, "message" => "Token required"]);
    exit();
}

$user = validateJWT($data->token);
if ($user) {
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Invalid token"]);
}
?>
