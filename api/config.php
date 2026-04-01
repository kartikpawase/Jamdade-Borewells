<?php
/**
 * Database Configuration & Connection (PDO)
 * Edit these settings according to your MySQL server (Localhost or cPanel).
 */
$host = 'localhost';
$db_name = 'jamdade_borewells';
$username = 'root'; // Change if using live server
$password = '';     // Change if using live server

try {
    // Basic connection (without DB selected) to allow setup_db.php to create it first
    $pdo = new PDO("mysql:host=$host;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    // Try selecting the database
    $pdo->exec("USE `$db_name`");
} catch(PDOException $e) {
    // If we're not running setup_db.php, we should respond with a tidy error.
    if(basename($_SERVER['PHP_SELF']) !== 'setup_db.php') {
        header('Content-Type: application/json');
        echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $e->getMessage()]);
        exit;
    }
}
?>
