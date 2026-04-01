<?php
/**
 * Admin Dashboard API
 * Returns metrics and recent bookings. Must be authenticated.
 */
session_start();
header('Content-Type: application/json');
require_once 'config.php';

// Auth Check
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['status' => 'unauthorized', 'message' => 'Please login to access this data.']);
    exit;
}

try {
    $stats = [
        'total_revenue' => 0,
        'total_bookings' => 0,
        'pending_jobs' => 0,
    ];

    // Total Revenue (from completed bookings and/or invoices)
    // For simplicity, we sum the estimated_cost of all bookings that are not cancelled
    $revStmt = $pdo->query("SELECT SUM(estimated_cost) as total FROM bookings WHERE status != 'cancelled'");
    $stats['total_revenue'] = $revStmt->fetch()['total'] ?? 0;

    // Total Bookings
    $cntStmt = $pdo->query("SELECT COUNT(*) as cnt FROM bookings");
    $stats['total_bookings'] = $cntStmt->fetch()['cnt'] ?? 0;

    // Pending Jobs
    $pendStmt = $pdo->query("SELECT COUNT(*) as cnt FROM bookings WHERE status = 'pending'");
    $stats['pending_jobs'] = $pendStmt->fetch()['cnt'] ?? 0;

    // Recent Bookings (top 10)
    $recStmt = $pdo->query("SELECT id, reference_id, customer_name, address, service_type, preferred_date, status FROM bookings ORDER BY created_at DESC LIMIT 10");
    $recent_bookings = $recStmt->fetchAll();

    echo json_encode([
        'status' => 'success',
        'stats' => $stats,
        'recent_bookings' => $recent_bookings
    ]);

} catch(PDOException $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
}
?>
