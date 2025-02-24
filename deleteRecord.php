<?php
// Enable CORS
header("Access-Control-Allow-Origin: https://horarios.gestionesculturales.org/");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$host   = 'localhost';
$user   = 'u354502285_horarioReg';
$pass   = 'bD1u66qHWK+8';
$dbName = 'u354502285_registers'; // Change to your DB name

$conn = new mysqli($host, $user, $pass, $dbName);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$date         = $_POST['date']         ?? '';
$name         = $_POST['name']         ?? '';
$reason       = $_POST['reason']       ?? '';
$exitTime     = $_POST['exitTime']     ?? '';
$returnTime   = $_POST['returnTime']   ?? '';
$observations = $_POST['observations'] ?? '';

$query = "DELETE FROM salidas WHERE date=? AND name=? AND reason=? AND exitTime=? AND returnTime=? AND observations=? LIMIT 1";
$stmt = $conn->prepare($query);
$stmt->bind_param("ssssss", $date, $name, $reason, $exitTime, $returnTime, $observations);
$stmt->execute();
$stmt->close();

echo "OK";
?>
