<?php

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debugging: Print POST and FILES data
    echo "<pre>";
    echo "POST Data:\n";
    print_r($_POST);
    echo "FILES Data:\n";
    print_r($_FILES);
    echo "</pre>";

    // Get form data
    $price = $_POST['price'];
    $reservationStatus = $_POST['reservationStatus'];
    $roomType = $_POST['roomType'];
    $roomNumber = $_POST['roomNumber'];
    $roomStatus = $_POST['roomStatus'];
    $foStatus = $_POST['foStatus'];
    $roomCapacity = $_POST['roomCapacity'];
    $bedType = $_POST['bedType'];
    $amenities = json_decode($_POST['amenities']); // Decode JSON string

    // // Handle file uploads
    $images = [];
    if (!empty($_FILES['images'])) {
        // Check if $_FILES['images'] is an array
        if (is_array($_FILES['images']['name'])) {
            foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
                $image_name = $_FILES['images']['name'][$key];
                $upload_path = __DIR__ . "/Pictures/" . basename($image_name); // Use absolute path
                if (move_uploaded_file($tmp_name, $upload_path)) {
                    $images[] = $upload_path;
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Failed to upload images. Check directory permissions or file path."]);
                    exit;
                }
            }
        } else {
            // Handle single file upload
            $image_name = $_FILES['images']['name'];
            $upload_path = __DIR__ . "/Pictures/" . basename($image_name); // Use absolute path
            if (move_uploaded_file($_FILES['images']['tmp_name'], $upload_path)) {
                $images[] = $upload_path;
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to upload images. Check directory permissions or file path."]);
                exit;
            }
        }
    }

    // Save data to database (example)
    // $sql = "INSERT INTO rooms (...) VALUES (...)";
    // Execute query...

    // Return success response
//     http_response_code(201);
//     echo json_encode(["message" => "Room added successfully."]);
// } else {
//     http_response_code(405);
//     echo json_encode(["message" => "Method Not Allowed"]);
}
?>