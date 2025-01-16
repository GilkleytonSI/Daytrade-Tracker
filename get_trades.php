<?php
header('Content-Type: application/json');

$host = 'localhost';
$dbname = 'daytrade';
$user = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    if (isset($_GET['id'])) {
        // Buscar um registro específico para edição
        $stmt = $pdo->prepare("SELECT * FROM trades WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $trade = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($trade) {
            echo json_encode(['success' => true, 'data' => $trade]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registro não encontrado.']);
        }
    } elseif (isset($_GET['month'])) {
        // Buscar registros do mês
        $stmt = $pdo->prepare("SELECT * FROM trades WHERE MONTH(date) = ?");
        $stmt->execute([$_GET['month']]);
        $trades = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $trades]);
    } elseif (isset($_GET['action']) && $_GET['action'] === 'summary') {
        // Resumo dos meses
        $stmt = $pdo->query("
            SELECT 
                MONTH(date) AS month, 
                SUM(financial_result) AS financial_result, 
                SUM(net_result) AS net_result 
            FROM trades 
            GROUP BY MONTH(date)
        ");
        $summary = $stmt->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(['success' => true, 'data' => $summary]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Parâmetro inválido.']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Erro no banco de dados: ' . $e->getMessage()]);
}
?>