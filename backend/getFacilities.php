<?php
require './core/cors.php';
require './database/config.php'; // Database connection (mysqli)

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Use prepared statements to prevent SQL injection
$sql = "SELECT id, name FROM facilities";
$stmt = $conn->prepare($sql);

if ($stmt === false) {
    die("Prepare failed: " . $conn->error);
}

// Execute the statement
$stmt->execute();
$result = $stmt->get_result();

// Check if there are any results
if ($result->num_rows > 0) {
    // Create an array to hold the facilities
    $facilities = array();

    // Fetch each row and add it to the array
    while($row = $result->fetch_assoc()) {
        $facilities[] = $row;
    }

    // Return the facilities as a JSON response
    header('Content-Type: application/json');
    echo json_encode($facilities);
} else {
    // No facilities found
    header('Content-Type: application/json');
    echo json_encode(array("message" => "No facilities found."));
}

// Close the statement and connection
$stmt->close();
$conn->close();
?>