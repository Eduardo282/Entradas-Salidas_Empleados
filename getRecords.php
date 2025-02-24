<?php
header("Access-Control-Allow-Origin: https://horarios.gestionesculturales.org/");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json");

// Update with your actual DB credentials
$host = "localhost";
$dbname = "u354502285_registers";
$username = "u354502285_horarioReg";
$password = "bD1u66qHWK+8";

try {
    $conn = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $conn->prepare("SELECT id, date, name, reason, exitTime, returnTime, observations FROM salidas");
    $stmt->execute();
    $records = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($records);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
?>
