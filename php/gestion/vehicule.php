<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../connexion/ConnectionBase.php';
$pdo = ConnectionBase::getConnection();

$action = $_GET['action'] ?? '';

if ($action === 'read') {
    $stmt = $pdo->query("SELECT id_vehicule, marque, model, cyl, moteur, categorie, stock, prix_u FROM VEHICULE");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['marque'], $data['model'], $data['cylindree'], $data['moteur'], $data['categorie'], $data['stock'], $data['prix_u'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO VEHICULE (marque, model, cyl, moteur, categorie, stock, prix_u) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['marque'], $data['model'], $data['cylindree'], $data['moteur'], $data['categorie'], $data['stock'], $data['prix_u']]);
    echo json_encode(["success" => true]);
}

if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id_vehicule'], $data['marque'], $data['model'], $data['cylindree'], $data['moteur'], $data['categorie'], $data['stock'], $data['prix_u'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE VEHICULE SET marque = ?, model = ?, cyl = ?, moteur = ?, categorie = ?, stock = ?, prix_u = ? WHERE id_vehicule = ?");
    $stmt->execute([$data['marque'], $data['model'], $data['cylindree'], $data['moteur'], $data['categorie'], $data['stock'], $data['prix_u'], $data['id_vehicule']]);
    echo json_encode(["success" => true]);
}

if ($action === 'delete') {
    $id = $_GET['id'] ?? 0;
    if ($id > 0) {
        $stmt = $pdo->prepare("DELETE FROM VEHICULE WHERE id_vehicule = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "ID invalide"]);
    }
}

if ($action === 'getPrice') {
    $id_vehicule = $_GET['id_vehicule'] ?? 0;

    if ($id_vehicule <= 0) {
        echo json_encode(["error" => "ID Véhicule invalide"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT prix_u FROM VEHICULE WHERE id_vehicule = ?");
        $stmt->execute([$id_vehicule]);
        $prix_u = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(["prix_u" => $prix_u['prix_u']]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la récupération du prix unitaire : " . $e->getMessage()]);
    }
}

?>
