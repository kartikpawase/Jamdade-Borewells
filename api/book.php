<?php
/**
 * Customer Booking API
 * Receives POST data from the frontend and saves it to the MySQL Database.
 */
header('Content-Type: application/json');
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Fallback parsing for raw JSON if fetch sends JSON instead of FormData
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    if (strpos($contentType, 'application/json') !== false) {
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = array_merge($_POST, $data);
    }

    $name = trim($_POST['full_name'] ?? '');
    $phone = trim($_POST['phone'] ?? '');
    $service_type = trim($_POST['service_type'] ?? '');
    $date = trim($_POST['preferred_date'] ?? '');
    $address = trim($_POST['address'] ?? '');
    $estimated_cost = floatval($_POST['estimated_cost'] ?? 0);

    // Basic Validation
    if(empty($name) || empty($phone) || empty($service_type) || empty($date) || empty($address)) {
        echo json_encode(['status' => 'error', 'message' => 'All required fields must be filled.']);
        exit;
    }

    try {
        // Generate a random Reference ID
        $reference_id = 'JB-' . strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));

        $stmt = $pdo->prepare("INSERT INTO bookings (reference_id, customer_name, phone, service_type, preferred_date, address, estimated_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')");
        
        $success = $stmt->execute([
            $reference_id,
            $name,
            $phone,
            $service_type,
            $date,
            $address,
            $estimated_cost
        ]);

        if($success) {
            echo json_encode([
                'status' => 'success',
                'message' => 'Booking successfully created.',
                'reference_id' => $reference_id
            ]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Could not save booking.']);
        }

    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    }

} else {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
}
?>
