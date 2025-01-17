<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'daytrade';
$user = 'root'; // Ajuste conforme seu ambiente
$password = ''; // Ajuste conforme seu ambiente

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $pdo->query("SELECT * FROM darf ORDER BY created_at DESC");
    $darfRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $darfRecords]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
