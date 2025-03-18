<?php
require './database/config.php'; // Database connection (PDO)
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
     // Sanitize and validate form data
     $price = filter_var($_POST['price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
     $reservationStatus = htmlspecialchars($_POST['reservationStatus'], ENT_QUOTES, 'UTF-8');
     $roomType = htmlspecialchars($_POST['roomType'], ENT_QUOTES, 'UTF-8');
     $roomNumber = htmlspecialchars($_POST['roomNumber'], ENT_QUOTES, 'UTF-8');
     $roomStatus = htmlspecialchars($_POST['roomStatus'], ENT_QUOTES, 'UTF-8');
     $foStatus = htmlspecialchars($_POST['foStatus'], ENT_QUOTES, 'UTF-8');
     $roomCapacity = filter_var($_POST['roomCapacity'], FILTER_SANITIZE_NUMBER_INT);
     $bedType = htmlspecialchars($_POST['bedType'], ENT_QUOTES, 'UTF-8');
 
     // Sanitize and decode JSON string
     $amenities = json_decode($_POST['amenities']);
     if (json_last_error() !== JSON_ERROR_NONE) {
         http_response_code(400);
         echo json_encode(["message" => "Invalid JSON data for amenities."]);
         exit;
     }
 
     // Sanitize each amenity in the array
     $sanitizedAmenities = array_map(function ($amenity) {
         return filter_var($amenity, FILTER_SANITIZE_NUMBER_INT); // Assuming amenities are IDs (integers)
     }, $amenities);

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