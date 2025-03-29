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
    $reservationStatus = isset($data['reservation_status']) ? $data['reservation_status'] : 'Reserved';
    $roomPlan = isset($data['room_plan']) ? $data['room_plan'] : null;
    $extras = isset($data['extras']) ? $data['extras'] : null;
    $paymentMethod = isset($data['payment_method']) ? $data['payment_method'] : null;

    // Validate required fields
    if (!$fullName || !$email || !$roomId || !$checkIn || !$checkOut || !$paymentMethod) {
        http_response_code(400); // Bad Request
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    // Check if the room is already occupied and get room details
    $sql = "SELECT status, room_number, floor FROM rooms WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Failed to prepare SQL statement: ' . $conn->error]);
        exit;
    }

    $stmt->bind_param('i', $roomId);
    $stmt->execute();
    $stmt->bind_result($roomStatus, $roomNumber, $floorNumber);
    $stmt->fetch();
    $stmt->close();

    // If the room is occupied, return an error
    if ($roomStatus === 'Occupied') {
        http_response_code(409); // Conflict
        echo json_encode(['error' => 'This room is already occupied and cannot be booked']);
        exit;
    }


    $_SESSION['room_details'] = [
        'room_number' => $roomNumber,
        'floor_number' => $floorNumber,
        'room_id' => $roomId
    ];


    // Fetch the base price of the room
    $sql = "SELECT price FROM rooms WHERE id = ?";
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Failed to prepare SQL statement: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param('i', $roomId);
    $stmt->execute();
    $stmt->bind_result($basePrice);
    $stmt->fetch();
    $stmt->close();

    // Calculate the total price based on check_in and check_out dates
    $checkInDate = new DateTime($checkIn);
    $checkOutDate = new DateTime($checkOut);
    $interval = $checkInDate->diff($checkOutDate); // Calculate the difference between dates
    $totalHours = $interval->days * 24 + $interval->h; // Convert days to hours and add remaining hours

    // Calculate the number of 24-hour intervals
    $intervals = intval($totalHours / 24);

    // Calculate the total price
    $totalPrice = $basePrice * pow(2, $intervals); // Double the price for every 24-hour interval

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

    // Generate a unique booking ID
    function generateBookingId()
    {
        $randomNumber = mt_rand(100000, 999999); // 6-digit random number
        $timestamp = time(); // Current Unix timestamp
        $bookingId = $timestamp . $randomNumber;
        $bookingId = substr($bookingId, -6); // Ensure 6 digits
        return $bookingId;
    }
    $bookingId = generateBookingId();

    // Prepare the SQL query to insert the booking
    $sql = "
        INSERT INTO bookings (
            booking_id, guest_id, room_id, check_in, check_out, total_price, 
            reservation_status, room_plan, extras, payment_method
        ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
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
        'siisssssss', // Types: s = string, i = integer
        $bookingId,
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
        // Update the reservation status to 'Checked In'
        $updatedStatus = 'Checked In';

        // SQL query to update the reservation status
        $updateSql = "UPDATE bookings SET reservation_status = ? WHERE booking_id = ?";
        $updateStmt = $conn->prepare($updateSql);
        if (!$updateStmt) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Failed to prepare update SQL statement: ' . $conn->error]);
            exit;
        }
        $updateStmt->bind_param('ss', $updatedStatus, $bookingId); // 'ss' means both are strings
        if (!$updateStmt->execute()) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Failed to execute update SQL statement: ' . $updateStmt->error]);
            exit;
        }
        $updateStmt->close();

        // Update the room status to 'Occupied'
        $roomStatus = 'Occupied';
        $updateRoomSql = "UPDATE rooms SET status = ? WHERE id = ?";
        $updateRoomStmt = $conn->prepare($updateRoomSql);
        if (!$updateRoomStmt) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Failed to prepare room update SQL statement: ' . $conn->error]);
            exit;
        }
        $updateRoomStmt->bind_param('si', $roomStatus, $roomId); // 'si' means string and integer
        if (!$updateRoomStmt->execute()) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => 'Failed to execute room update SQL statement: ' . $updateRoomStmt->error]);
            exit;
        }
        $updateRoomStmt->close();

        // Return success response with booking ID and total price
        http_response_code(201); // Created
        echo json_encode([
            'total_price' => $totalPrice, // Include the calculated total price,
            'success' => true,
            'message' => 'Booking created successfully',
            'booking' => [
                'id' => $bookingId,
                'room_id' => $roomId,
                'check_in' => $checkIn,
                'check_out' => $checkOut,
                'total_price' => $totalPrice,
                'status' => 'Paid',
                'guest_name' => $fullName,
                'confirmation_number' => 'BK-' . strtoupper(uniqid()),
                'booking_id' => $bookingId,
                'room_number' => $_SESSION['room_details']['room_number'] ?? null,
                'floor_number' => $_SESSION['room_details']['floor_number'] ?? null
            ]
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
