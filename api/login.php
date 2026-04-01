<?php
/**
 * Admin Login API
 * Receives username/password, verifies against database, creates session.
 */
session_start();
require_once 'config.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Please enter both username and password.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT id, username, password_hash FROM admin_users WHERE username = ?");
        $stmt->execute([$username]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password_hash'])) {
            // Authentication successful
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];

            echo json_encode(['status' => 'success', 'message' => 'Login successful', 'redirect' => 'admin.html']);
            exit;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid username or password.']);
            exit;
        }

    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error.']);
        exit;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>
