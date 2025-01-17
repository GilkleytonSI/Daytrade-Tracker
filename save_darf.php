<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'daytrade';
$user = 'root'; // Ajuste conforme seu ambiente
$password = ''; // Ajuste conforme seu ambiente

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    // Validação dos dados recebidos
    if (!isset($data['value'], $data['status'], $data['month']) || !is_numeric($data['value']) || !in_array($data['status'], ['pendente', 'pago'])) {
        echo json_encode(['success' => false, 'message' => 'Dados inválidos.']);
        exit;
    }

    $value = $data['value'];
    $status = $data['status'];
    $month = $data['month'];
    $year = date('Y'); // Ano atual

    // Inserir no banco de dados
    $stmt = $pdo->prepare("INSERT INTO darf (value, status, month, year) VALUES (?, ?, ?, ?)");
    $stmt->execute([$value, $status, $month, $year]);

    echo json_encode(['success' => true, 'message' => 'Registro de DARF salvo com sucesso!']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>
