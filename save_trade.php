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

    if (isset($data['tradeDate'], $data['points'], $data['contracts'], $data['financialResult'], $data['operationFee'], $data['netResult'])) {
        $stmt = $pdo->prepare("
            INSERT INTO trades (date, points, financial_result, operation_fee, net_result, contracts) 
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['tradeDate'], 
            $data['points'], 
            $data['financialResult'], 
            $data['operationFee'], 
            $data['netResult'],
            $data['contracts']
        ]);
        echo json_encode(['success' => true]);

    } else {
        echo json_encode(['success' => false, 'message' => 'Dados incompletos.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>