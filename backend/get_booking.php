<?php
require './database/config.php'; // Database connection (MySQLi)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $bookingId = $_GET['booking_id'];
       if(empty($bookingId)){
        die("empty id");
       }
    // Fetch booking details
    $sql = "SELECT * FROM bookings WHERE booking_id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Failed to prepare SQL statement: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param('s', $bookingId);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        $booking = $result->fetch_assoc();
        http_response_code(200); // OK
        echo json_encode($booking);
    } else {
        http_response_code(404); // Not Found
        echo json_encode(['error' => 'Booking not found']);
    }

    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}

$conn->close();
?>