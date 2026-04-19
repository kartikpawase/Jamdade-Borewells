<?php
echo "<h2>Jamdade Borewells Cloud Installer & Sanitizer</h2>";

function clearDir($dir) {
    if(!file_exists($dir)) return;
    $files = array_diff(scandir($dir), array('.','..'));
    foreach ($files as $file) {
        if ($file === 'app.zip' || $file === 'unzip.php') continue;
        $path = "$dir/$file";
        (is_dir($path)) ? clearDir($path) : @unlink($path);
        @rmdir($path);
    }
}

// Ensure the directory is clean of garbage drag-and-drop files
clearDir(__DIR__);
echo "<p>✅ Cleaned up old corrupted files.</p>";

$zipFile = 'app.zip';
if (!file_exists($zipFile)) {
    die("Deployment archive (app.zip) not found! Waiting for file upload in background...");
}

$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    $zip->extractTo(__DIR__);
    $zip->close();
    echo "<p style='color:green;font-weight:bold;'>✅ Successfully extracted precise application architecture!</p>";
    
    @unlink($zipFile);
    @unlink(__FILE__);
    
    echo "<p>Redirecting to Database Initialization in 3 seconds...</p>";
    echo "<script>setTimeout(function() { window.location.href = 'api/setup_db.php'; }, 3000);</script>";
} else {
    echo "<p style='color:red;'>❌ Failed to open ZIP archive. File might be corrupted.</p>";
}
?>
