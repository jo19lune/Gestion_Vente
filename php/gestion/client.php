<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../connexion/ConnectionBase.php';
$pdo = ConnectionBase::getConnection();

$action = $_GET['action'] ?? '';

if ($action === 'read') {
    $stmt = $pdo->query("SELECT * FROM CLIENT");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['nom_client'], $data['prenom_client'], $data['cin_client'], $data['adresse'], $data['telephone'], $data['email'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO CLIENT (nom_client, prenom_client, cin_client, adresse, telephone, email) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['nom_client'], $data['prenom_client'], $data['cin_client'], $data['adresse'], $data['telephone'], $data['email']]);
    echo json_encode(["success" => true]);
}

if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['nom_client'], $data['prenom_client'], $data['cin_client'], $data['adresse'], $data['telephone'], $data['email'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE CLIENT SET nom_client = ?, prenom_client = ?, cin_client = ?, adresse = ?, telephone = ?, email = ? WHERE id_client = ?");
    $stmt->execute([$data['nom_client'], $data['prenom_client'], $data['cin_client'], $data['adresse'], $data['telephone'], $data['email'], $data['id_client']]);
    echo json_encode(["success" => true]);
}

if ($action === 'delete') {
    $id = $_GET['id'] ?? 0;
    if ($id > 0) {
        $stmt = $pdo->prepare("DELETE FROM CLIENT WHERE id_client = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "ID invalide"]);
    }
}
?>
