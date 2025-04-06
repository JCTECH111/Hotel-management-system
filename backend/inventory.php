<?php
require './database/config.php'; // Database connection (mysqli)
require './core/cors.php';
// Get inventory items
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $conn->prepare("
        SELECT * FROM inventory
        ORDER BY 
            CASE WHEN current_stock < restock_threshold THEN 0 ELSE 1 END,
            item_name
    ");
    $stmt->execute();
    $result = $stmt->get_result();
    $inventory = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($inventory);
}

// Update inventory or request restock
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $action = $data['action'] ?? null;
    
    if ($action === 'update') {
        $itemId = $data['itemId'] ?? null;
        $quantity = $data['quantity'] ?? null;
        
        if (!$itemId || !$quantity) {
            echo json_encode(['success' => false, 'message' => 'Missing parameters'], 400);
        }
        
        $stmt = $conn->prepare("UPDATE inventory SET current_stock = ? WHERE id = ?");
        $stmt->execute([$quantity, $itemId]);
        
        echo json_encode(['success' => true]);
    } 
    elseif ($action === 'request') {
        $itemId = $data['itemId'] ?? null;
        $quantity = $data['quantity'] ?? null;
        
        if (!$itemId) {
            echo json_encode(['success' => false, 'message' => 'Missing item ID'], 400);
        }
        
        // In a real app, this would create a restock request in another table
        echo json_encode(['success' => true, 'message' => 'Restock request submitted']);
    }
}
?>