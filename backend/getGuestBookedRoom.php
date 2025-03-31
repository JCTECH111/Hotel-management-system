<?php
require './database/config.php'; // Database connection (MySQLi)

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
// Use prepared statements to prevent SQL injection
$user_id = $_GET["user_id"];
$stmt = $conn->prepare("SELECT * 
                       FROM bookings
                       INNER JOIN guests 
                       ON bookings.user_id = guests.user_id
                       WHERE guests.user_id = ?");


    // Prepare the statement
    $stmt->bind_param("i", $user_id);
    if (!$stmt) {
        http_response_code(500); // Internal Server Error
        echo json_encode(['error' => 'Failed to prepare SQL statement: ' . $conn->error]);
        exit;
    }

    // Execute the query
    if ($stmt->execute()) {
        // Fetch the results
        $result = $stmt->get_result();
        $bookings = [];

        // Loop through the results and store them in an array
        while ($row = $result->fetch_assoc()) {
            $bookings[] = $row;
        }

        // Return the bookings as JSON
        http_response_code(200); // OK
        echo json_encode($bookings);
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
?>