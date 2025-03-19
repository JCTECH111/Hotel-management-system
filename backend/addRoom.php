<?php
require './database/config.php'; // Database connection (PDO)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Debugging: Print POST and FILES data
    // echo "<pre>";
    // echo "POST Data:\n";
    // print_r($_POST);
    // echo "FILES Data:\n";
    // print_r($_FILES);
    // echo "</pre>";

    // // Get form data
    // Sanitize and validate form data
    $price = filter_var($_POST['price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
    $roomStatus = htmlspecialchars($_POST['roomStatus'], ENT_QUOTES, 'UTF-8');
    $roomType = htmlspecialchars($_POST['roomType'], ENT_QUOTES, 'UTF-8');
    $roomNumber = htmlspecialchars($_POST['roomNumber'], ENT_QUOTES, 'UTF-8');
    $floor = htmlspecialchars($_POST['floor'], FILTER_SANITIZE_NUMBER_INT);
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



    // Save data to database
    $stmt = $conn->prepare("INSERT INTO rooms (room_number, floor, type, price, status, capacity, bed_type) VALUES (?,?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sisdsss", $roomNumber, $floor, $roomType, $price, $roomStatus, $roomCapacity, $bedType);

    // Execute the statement
    if ($stmt->execute()) {
        $roomId = $stmt->insert_id; // Get the auto-generated room ID
        echo "Room added successfully. Room ID: " . $roomId;
    } else {
        echo "Error adding room: " . $stmt->error;
    }
    $stmt->close();

    // // Handle file uploads
    $images = [];
    if (!empty($_FILES['images'])) {
        // Check if $_FILES['images'] is an array
        if (is_array($_FILES['images']['name'])) {
            $stmt = $conn->prepare("INSERT INTO room_images (room_id, image_url) VALUES (?, ?)");
            $stmt->bind_param("is", $roomId, $imageUrl);
            foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
                $image_name = $_FILES['images']['name'][$key];
                $upload_path = __DIR__ . "/Pictures/" . basename($image_name); // Use absolute path
                $url_path ="http://localhost:8000/Pictures/" . basename($image_name); // Use absolute path
                if (move_uploaded_file($tmp_name, $upload_path)) {
                    $images[] = $upload_path;
                    $imageUrl = $url_path;
                    if (!$stmt->execute()) {
                        echo "Error adding image: " . $stmt->error;
                    }
                } else {
                    http_response_code(500);
                    echo json_encode(["message" => "Failed to upload images. Check directory permissions or file path."]);
                    exit;
                }
            }
        } else {
            $stmt = $conn->prepare("INSERT INTO room_images (room_id, image_url) VALUES (?, ?)");
            $stmt->bind_param("is", $roomId, $imageUrl);
            // Handle single file upload
            $image_name = $_FILES['images']['name'];
            $upload_path = __DIR__ . "/Pictures/" . basename($image_name); // Use absolute path
            if (move_uploaded_file($_FILES['images']['tmp_name'], $upload_path)) {
                $images[] = $upload_path;
                $imageUrl = $upload_path;
                if (!$stmt->execute()) {
                    echo "Error adding image: " . $stmt->error;
                }
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to upload images. Check directory permissions or file path."]);
                exit;
            }
        }
    }

    //uploading amenities
    if(!empty($sanitizedAmenities)){
        $stmt = $conn->prepare("INSERT INTO room_facilities (room_id, facility_id) VALUES (?, ?)");
    $stmt->bind_param("ii", $roomId, $facilityId);
    foreach ($sanitizedAmenities as $facilityId) {
        if (!$stmt->execute()) {
            echo "Error adding amenity: " . $stmt->error;
        }
    }
    $stmt->close();
    }
    //Return success response
        http_response_code(201);
        echo json_encode(["message" => "Room added successfully."]);
    } else {
        http_response_code(405);
        echo json_encode(["message" => "Method Not Allowed"]);
}

// Close the connection
$conn->close();
