<?php
/**
 * Automatic Database Setup Script
 * Run this ONCE by visiting /api/setup_db.php in your browser.
 */
require_once 'config.php';

header('Content-Type: text/plain');

try {
    echo "Starting Database Setup...\n";

    // 1. Create Database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE `$db_name`");
    echo "✅ Database `$db_name` ready.\n";

    // 2. Create Admin Users Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS admin_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL UNIQUE,
            password_hash VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Table `admin_users` ready.\n";

    // Insert Default Admin (username: admin, password: password123)
    // IMPORTANT: Change this password immediately in production!
    $checkAdmin = $pdo->query("SELECT id FROM admin_users WHERE username = 'admin'")->fetch();
    if (!$checkAdmin) {
        $hash = password_hash('password123', PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO admin_users (username, password_hash) VALUES (?, ?)");
        $stmt->execute(['admin', $hash]);
        echo "✅ Default Admin Created. (User: admin | Pass: password123)\n";
    }

    // 3. Create Bookings Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS bookings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            reference_id VARCHAR(20) NOT NULL UNIQUE,
            customer_name VARCHAR(100) NOT NULL,
            phone VARCHAR(15) NOT NULL,
            service_type VARCHAR(50) NOT NULL,
            preferred_date DATE NOT NULL,
            address TEXT NOT NULL,
            estimated_cost DECIMAL(10,2) DEFAULT 0.00,
            status ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Table `bookings` ready.\n";

    // 4. Create Invoices Table
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS invoices (
            id INT AUTO_INCREMENT PRIMARY KEY,
            invoice_number VARCHAR(30) NOT NULL UNIQUE,
            customer_name VARCHAR(100) NOT NULL,
            mobile VARCHAR(15) NOT NULL,
            depth_feet INT NOT NULL,
            rate_per_feet DECIMAL(10,2) NOT NULL,
            subtotal DECIMAL(10,2) NOT NULL,
            tax DECIMAL(10,2) NOT NULL,
            total_amount DECIMAL(10,2) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ");
    echo "✅ Table `invoices` ready.\n";

    echo "\n🎉 Setup Complete! You can now use the application.";

} catch (PDOException $e) {
    echo "❌ SETUP FAILED: " . $e->getMessage();
}
?>
