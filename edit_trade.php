<?php
header('Content-Type: application/json');
$host = 'localhost';
$dbname = 'daytrade';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $data = json_decode(file_get_contents('php://input'), true);

    if (isset($data['id'], $data['date'], $data['points'], $data['contracts'], $data['operationFee'])) {
        // Atualizar o registro no banco de dados
        $stmt = $pdo->prepare("
            UPDATE trades 
            SET date = ?, points = ?, contracts = ?, operation_fee = ?, 
                financial_result = points * 0.20 * contracts, 
                net_result = (points * 0.20 * contracts) - operation_fee 
            WHERE id = ?
        ");
        $stmt->execute([
            $data['date'],
            $data['points'],
            $data['contracts'],
            $data['operationFee'],
            $data['id']
        ]);

        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
