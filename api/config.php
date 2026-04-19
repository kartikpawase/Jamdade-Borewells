<?php
/**
 * Database Configuration & Connection (PDO)
 * Configured for XAMPP localhost MySQL.
 */
$host = 'localhost';
$db_name = 'jamdade_borewells';
$username = 'root'; 
$password = '';  // XAMPP default: no password for root

try {
    // Basic connection (without DB selected) to allow setup_db.php to create it first
    $pdo = new PDO("mysql:host=$host;port=3306;charset=utf8mb4", $username, $password);
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
    } else {
        if (!isset($pdo) || $pdo === null) {
            die("❌ Database Server connection failed: " . $e->getMessage() . "\nPlease ensure MySQL is running (e.g. via XAMPP Control Panel).\n");
        }
    }
}
?>
