<?php
/**
 * Save Invoice API
 * Saves the generated invoice data to the MySQL Database.
 * Requires Admin Authentication.
 */
session_start();
header('Content-Type: application/json');
require_once 'config.php';

// Auth Check
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['status' => 'unauthorized', 'message' => 'Please login to save invoices.']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    
    // Support JSON Payloads
    $contentType = isset($_SERVER["CONTENT_TYPE"]) ? trim($_SERVER["CONTENT_TYPE"]) : '';
    if (strpos($contentType, 'application/json') !== false) {
        $data = json_decode(file_get_contents('php://input'), true);
        $_POST = array_merge($_POST, $data);
    }

    $customer_name = trim($_POST['customer_name'] ?? '');
    $mobile = trim($_POST['mobile'] ?? '');
    $depth_feet = intval($_POST['depth_feet'] ?? 0);
    $rate_per_feet = floatval($_POST['rate_per_feet'] ?? 0);
    
    $subtotal = floatval($_POST['subtotal'] ?? 0);
    $tax = floatval($_POST['tax'] ?? 0);
    $total_amount = floatval($_POST['total_amount'] ?? 0);

    if (empty($customer_name) || empty($mobile) || $depth_feet <= 0 || $rate_per_feet <= 0) {
        echo json_encode(['status' => 'error', 'message' => 'Missing valid numeric/customer data.']);
        exit;
    }

    try {
        // Generate Invoice Number
        $invoice_number = 'INV-'.date('Ym').'-'.strtoupper(substr(uniqid(), -4));

        $stmt = $pdo->prepare("INSERT INTO invoices (invoice_number, customer_name, mobile, depth_feet, rate_per_feet, subtotal, tax, total_amount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
        
        $success = $stmt->execute([
            $invoice_number,
            $customer_name,
            $mobile,
            $depth_feet,
            $rate_per_feet,
            $subtotal,
            $tax,
            $total_amount
        ]);

        if($success) {
            echo json_encode(['status' => 'success', 'message' => 'Invoice saved to database.', 'invoice_number' => $invoice_number]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to save invoice.']);
        }
    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'DB Error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
}
?>
