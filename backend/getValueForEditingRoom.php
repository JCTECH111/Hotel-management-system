<?php
require './database/config.php'; // Database connection (mysqli)
require './core/cors.php';

// Sanitize and validate the roomId parameter
$roomId = filter_input(INPUT_GET, 'roomId', FILTER_SANITIZE_NUMBER_INT);
if (!$roomId) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Invalid room ID."]);
    exit;
}

// Fetch room details with facilities and reviews
$stmt = $conn->prepare("
    SELECT 
        r.id, 
        r.room_number, 
        r.floor, 
        r.type, 
        r.price, 
        r.status, 
        r.capacity, 
        r.bed_type, 
        r.created_at,
        GROUP_CONCAT(DISTINCT room_images.image_url SEPARATOR ', ') AS image_url,
        GROUP_CONCAT(DISTINCT f.id SEPARATOR ', ') AS facility_names,
        GROUP_CONCAT(DISTINCT CONCAT(reviews.guest_id, '|', reviews.rating, '|', reviews.comment, '|', reviews.created_at)) AS review_details
    FROM rooms r
    LEFT JOIN room_facilities rf ON r.id = rf.room_id
    LEFT JOIN facilities f ON rf.facility_id = f.id
    LEFT JOIN reviews ON r.id = reviews.room_id
    LEFT JOIN room_images ON r.id = room_images.room_id
    WHERE r.id = ?
    GROUP BY r.id
");

if (!$stmt) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Failed to prepare the SQL statement."]);
    exit;
}

// Bind the roomId parameter and execute the query
$stmt->bind_param("i", $roomId);
if (!$stmt->execute()) {
    http_response_code(500); // Internal Server Error
    echo json_encode(["message" => "Failed to execute the SQL query."]);
    exit;
}

// Fetch the result
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    http_response_code(404); // Not Found
    echo json_encode(["message" => "Room not found."]);
    exit;
}

// Fetch the room data
$room = $result->fetch_assoc();

// Convert facility names from CSV string to array
$room['facility_names'] = $room['facility_names'] ? explode(', ', $room['facility_names']) : [];

$room['image_url'] = $room['image_url'] ? explode(', ', $room['image_url']) : [];

// Convert review details from CSV string to array of objects
$room['review_details'] = $room['review_details'] ? array_map(function ($review) {
    list($guestId, $rating, $comment, $createdAt) = explode('|', $review);
    return [
        'guest_id' => $guestId,
        'rating' => $rating,
        'comment' => $comment,
        'created_at' => $createdAt
    ];
}, explode(',', $room['review_details'])) : [];

// Return JSON response
header('Content-Type: application/json');
echo json_encode($room);

// Close the statement and connection
$stmt->close();
$conn->close();
?>