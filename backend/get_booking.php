<?php
require './database/config.php'; // Database connection (MySQLi)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Validate booking_id
    if (empty($_GET['booking_id'])) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Booking ID is required']);
        exit;
    }

    $bookingId = $_GET['booking_id'];

    // Fetch booking details
    $sql = "
        SELECT 
            bookings.*, 
            guests.full_name, 
            guests.email, 
            guests.phone, 
            room_images.image_url, 
            facilities.name AS facility_name, 
            rooms.*
        FROM bookings
        INNER JOIN guests ON bookings.guest_id = guests.id
        INNER JOIN room_images ON bookings.room_id = room_images.room_id
        INNER JOIN room_facilities ON bookings.room_id = room_facilities.room_id
        INNER JOIN facilities ON room_facilities.facility_id = facilities.id
        INNER JOIN rooms ON bookings.room_id = rooms.id
        WHERE bookings.booking_id = ?
    ";
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
        // Fetch all rows
        $rows = $result->fetch_all(MYSQLI_ASSOC);

        // Organize data into a structured response
        $bookingDetails = [
            'booking_id' => $rows[0]['booking_id'],
            'guest_name' => $rows[0]['full_name'],
            'guest_email' => $rows[0]['email'],
            'guest_phone' => $rows[0]['phone'],
            'check_in' => $rows[0]['check_in'],
            'check_out' => $rows[0]['check_out'],
            'room_plan' => $rows[0]['room_plan'],
            'total_price' => $rows[0]['total_price'],
            'capacity' => $rows[0]['capacity'],
            'reservation_status' => $rows[0]['reservation_status'],
            'room_images' => array_unique(array_column($rows, 'image_url')),
            'facilities' => array_unique(array_column($rows, 'facility_name')),
            'room_details' => [
                'room_number' => $rows[0]['room_number'],
                'room_type' => $rows[0]['type']
                // Add other room details here
            ],
        ];

        http_response_code(200); // OK
        echo json_encode($bookingDetails);
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