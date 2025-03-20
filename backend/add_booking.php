<?php
require './database/config.php'; // Database connection (MySQLi)

// Set headers for CORS and JSON response
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Return HTTP 200 status for preflight requests
    http_response_code(200);
    exit;
}

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate and sanitize the input data
    $fullName = isset($data['full_name']) ? $data['full_name'] : null; // Use 'full_name'
    $email = isset($data['email']) ? $data['email'] : null;           // Use 'email'
    $phone = isset($data['phone']) ? $data['phone'] : null;           // Use 'phone'
    $roomId = isset($data['room_id']) ? intval($data['room_id']) : null;
    $checkIn = isset($data['check_in']) ? $data['check_in'] : null;
    $checkOut = isset($data['check_out']) ? $data['check_out'] : null;
    $totalPrice = isset($data['total_price']) ? floatval($data['total_price']) : null;
    $reservationStatus = isset($data['reservation_status']) ? $data['reservation_status'] : 'Reserved';
    $roomPlan = isset($data['room_plan']) ? $data['room_plan'] : null;
    $extras = isset($data['extras']) ? $data['extras'] : null;
    $paymentMethod = isset($data['payment_method']) ? $data['payment_method'] : null;

    // Validate required fields
    if (!$fullName || !$email || !$roomId || !$checkIn || !$checkOut || !$totalPrice || !$paymentMethod) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    // Check if the guest already exists
    $sql = "SELECT id FROM guests WHERE email = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Failed to prepare SQL statement: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();
    $stmt->bind_result($guestId);

    if ($stmt->fetch()) {
        // Guest exists, use the existing guest ID
        $stmt->close();
    } else {
        // Guest does not exist, insert new guest
        $stmt->close();
        $sql = "INSERT INTO guests (full_name, email, phone) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql);
        if (!$stmt) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Failed to prepare SQL statement: ' . $conn->error]);
            exit;
        }
        $stmt->bind_param('sss', $fullName, $email, $phone);
        if (!$stmt->execute()) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Failed to insert guest: ' . $stmt->error]);
            exit;
        }
        $guestId = $stmt->insert_id;
        $stmt->close();
    }

    // Prepare the SQL query to insert the booking
    $sql = "
        INSERT INTO bookings (
            guest_id, room_id, check_in, check_out, total_price, 
            reservation_status, room_plan, extras, payment_method
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?
        )
    ";

    // Prepare the statement
    $stmt = $conn->prepare($sql);

    // Check if the statement was prepared successfully
    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Failed to prepare SQL statement: ' . $conn->error]);
        exit;
    }

    // Bind the parameters
    $stmt->bind_param(
        'iisssssss', // Types: i = integer, s = string, d = double
        $guestId,
        $roomId,
        $checkIn,
        $checkOut,
        $totalPrice,
        $reservationStatus,
        $roomPlan,
        $extras,
        $paymentMethod
    );

    // Execute the query
    if ($stmt->execute()) {
        // Get the last inserted booking ID
        $bookingId = $stmt->insert_id;

        // Return success response with booking ID
        http_response_code(201); // Created
        echo json_encode([
            'message' => 'Booking created successfully',
            'booking_id' => $bookingId
        ]);
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Failed to execute SQL statement: ' . $stmt->error]);
    }

    // Close the statement
    $stmt->close();
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Invalid request method']);
}

// Close the database connection
$conn->close();
