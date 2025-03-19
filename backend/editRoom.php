<?php
require './database/config.php'; // Database connection (PDO)

// Handle CORS and preflight requests
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS, GET");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return HTTP 200 status for preflight requests
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get roomId from the request body or query parameters
    $roomId = isset($_GET['roomId']) ? filter_var($_GET['roomId'], FILTER_SANITIZE_NUMBER_INT) : null;

    if (!$roomId) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid room ID."]);
        exit;
    }

    // Fetch existing room data
    $stmt = $conn->prepare("SELECT * FROM rooms WHERE id = ?");
    $stmt->bind_param("i", $roomId);
    $stmt->execute();
    $result = $stmt->get_result();
    $room = $result->fetch_assoc();

    if (!$room) {
        http_response_code(404);
        echo json_encode(["message" => "Room not found."]);
        exit;
    }

    // Fetch old image URLs from the database
    $stmt = $conn->prepare("SELECT image_url FROM room_images WHERE room_id = ?");
    $stmt->bind_param("i", $roomId);
    $stmt->execute();
    $result = $stmt->get_result();
    $oldImageUrls = [];
    while ($row = $result->fetch_assoc()) {
        $oldImageUrls[] = $row['image_url'];
    }

    // Delete old images from the server
    foreach ($oldImageUrls as $oldImageUrl) {
        $filePath = __DIR__ . "/Pictures/" . basename($oldImageUrl);
        if (file_exists($filePath)) {
            unlink($filePath); // Delete the file
        }
    }

    // Delete old image URLs from the database
    $stmt = $conn->prepare("DELETE FROM room_images WHERE room_id = ?");
    $stmt->bind_param("i", $roomId);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to delete old images from the database."]);
        exit;
    }

    // Sanitize and validate form data
    $price = isset($_POST['price']) ? filter_var($_POST['price'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION) : $room['price'];
    $roomStatus = isset($_POST['roomStatus']) ? htmlspecialchars($_POST['roomStatus'], ENT_QUOTES, 'UTF-8') : $room['status'];
    $roomType = isset($_POST['roomType']) ? htmlspecialchars($_POST['roomType'], ENT_QUOTES, 'UTF-8') : $room['type'];
    $roomNumber = isset($_POST['roomNumber']) ? htmlspecialchars($_POST['roomNumber'], ENT_QUOTES, 'UTF-8') : $room['room_number'];
    $floor = isset($_POST['floor']) ? filter_var($_POST['floor'], FILTER_SANITIZE_NUMBER_INT) : $room['floor'];
    $roomCapacity = isset($_POST['roomCapacity']) ? filter_var($_POST['roomCapacity'], FILTER_SANITIZE_NUMBER_INT) : $room['capacity'];
    $bedType = isset($_POST['bedType']) ? htmlspecialchars($_POST['bedType'], ENT_QUOTES, 'UTF-8') : $room['bed_type'];

    // Sanitize and decode JSON string for amenities
    $amenities = isset($_POST['amenities']) ? json_decode($_POST['amenities']) : [];
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(["message" => "Invalid JSON data for amenities."]);
        exit;
    }

    // Sanitize each amenity in the array
    $sanitizedAmenities = array_map(function ($amenity) {
        return filter_var($amenity, FILTER_SANITIZE_NUMBER_INT); // Assuming amenities are IDs (integers)
    }, $amenities);

    // Update room data in the database
    $stmt = $conn->prepare("UPDATE rooms SET room_number = ?, floor = ?, type = ?, price = ?, status = ?, capacity = ?, bed_type = ? WHERE id = ?");
    $stmt->bind_param("sisdsssi", $roomNumber, $floor, $roomType, $price, $roomStatus, $roomCapacity, $bedType, $roomId);

    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to update room details."]);
        exit;
    }

    // Insert new images
    if (!empty($_FILES['images'])) {
        $stmt = $conn->prepare("INSERT INTO room_images (room_id, image_url) VALUES (?, ?)");
        $stmt->bind_param("is", $roomId, $imageUrl);

        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            $image_name = uniqid() . "_" . basename($_FILES['images']['name'][$key]); // Generate unique file name
            $upload_path = __DIR__ . "/Pictures/" . $image_name; // Use absolute path
            $url_path = "http://localhost:8000/Pictures/" . $image_name; // Use absolute path

            if (move_uploaded_file($tmp_name, $upload_path)) {
                $imageUrl = $url_path;
                if (!$stmt->execute()) {
                    http_response_code(500);
                    echo json_encode(["message" => "Failed to upload images."]);
                    exit;
                }
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to move uploaded file."]);
                exit;
            }
        }
    }

    // Delete all existing amenities for the room
    $stmt = $conn->prepare("DELETE FROM room_facilities WHERE room_id = ?");
    $stmt->bind_param("i", $roomId);
    if (!$stmt->execute()) {
        http_response_code(500);
        echo json_encode(["message" => "Failed to delete existing amenities."]);
        exit;
    }

    // Insert new amenities
    if (!empty($sanitizedAmenities)) {
        $stmt = $conn->prepare("INSERT INTO room_facilities (room_id, facility_id) VALUES (?, ?)");
        $stmt->bind_param("ii", $roomId, $facilityId);

        foreach ($sanitizedAmenities as $facilityId) {
            if (!$stmt->execute()) {
                http_response_code(500);
                echo json_encode(["message" => "Failed to update amenities."]);
                exit;
            }
        }
    }

    // Return success response
    http_response_code(200);
    echo json_encode(["message" => "Room updated successfully."]);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method Not Allowed"]);
}

// Close the connection
$conn->close();
?>