<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../connexion/ConnectionBase.php';
$pdo = ConnectionBase::getConnection();

$action = $_GET['action'] ?? '';

if ($action === 'read') {
    $stmt = $pdo->query("SELECT * FROM EMPLOYE");
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
}

if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['nom_employe'], $data['prenom_employe'], $data['cin_employe'], $data['adresse_employe'], $data['telephone_employe'], $data['email_employe'], $data['mot_de_passe'], $data['poste_employe'], $data['salaire'], $data['date_embauche'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO EMPLOYE (nom_employe, prenom_employe, cin_employe, adresse_employe, telephone_employe, email_employe, mot_de_passe, poste_employe, salaire, date_embauche) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([$data['nom_employe'], $data['prenom_employe'], $data['cin_employe'], $data['adresse_employe'], $data['telephone_employe'], $data['email_employe'], password_hash($data['mot_de_passe'], PASSWORD_DEFAULT), $data['poste_employe'], $data['salaire'], $data['date_embauche']]);
    echo json_encode(["success" => true]);
}

if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!$data || !isset($data['id_employe'], $data['nom_employe'], $data['prenom_employe'], $data['cin_employe'], $data['adresse_employe'], $data['telephone_employe'], $data['email_employe'], $data['poste_employe'], $data['salaire'], $data['date_embauche'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    $stmt = $pdo->prepare("UPDATE EMPLOYE SET nom_employe = ?, prenom_employe = ?, cin_employe = ?, adresse_employe = ?, telephone_employe = ?, email_employe = ?, poste_employe = ?, salaire = ?, date_embauche = ? WHERE id_employe = ?");
    $stmt->execute([$data['nom_employe'], $data['prenom_employe'], $data['cin_employe'], $data['adresse_employe'], $data['telephone_employe'], $data['email_employe'], $data['poste_employe'], $data['salaire'], $data['date_embauche'], $data['id_employe']]);
    echo json_encode(["success" => true]);
}

if ($action === 'delete') {
    $id = $_GET['id'] ?? 0;
    if ($id > 0) {
        $stmt = $pdo->prepare("DELETE FROM EMPLOYE WHERE id_employe = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["error" => "ID invalide"]);
    }
}
?>
