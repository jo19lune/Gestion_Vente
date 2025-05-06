<?php
header('Content-Type: application/json; charset=utf-8');
$action = isset($_GET['action']) ? $_GET['action'] : '';

require_once __DIR__ . '/../connexion/ConnectionBase.php';

try {
    $pdo = ConnectionBase::getConnection();
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion à la base de données : " . $e->getMessage()]);
    exit;
}

if ($action === 'read') {
    try {
        $id_facture = $_GET['facture_id'] ?? null; // Vérifier si un filtre par facture est demandé

        $query = "
            SELECT a.id_vente, a.id_client, a.id_employe, a.id_facture, a.id_vehicule, a.date_vente, 
                   v.categorie, v.marque, v.model, a.quantite, a.prix_total 
            FROM ACHAT a
            JOIN VEHICULE v ON a.id_vehicule = v.id_vehicule
        ";

        if ($id_facture) {
            $query .= " WHERE a.id_facture = ?";
            $stmt = $pdo->prepare($query);
            $stmt->execute([$id_facture]);
        } else {
            $stmt = $pdo->query($query);
        }

        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la récupération des ventes : " . $e->getMessage()]);
    }
}


if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || empty($data['id_client']) || empty($data['id_employe']) || empty($data['id_vehicule']) || empty($data['quantite']) || empty($data['date_vente']) || empty($data['prix_total'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    try {
        // Récupérer l'id_facture automatiquement
        $stmtFacture = $pdo->query("SELECT MAX(id_facture) AS dernier_facture FROM FACTURE");
        $dernierFacture = $stmtFacture->fetch(PDO::FETCH_ASSOC);
        $id_facture_auto = $dernierFacture['dernier_facture'] ? $dernierFacture['dernier_facture'] + 1 : 1;

        $stmt = $pdo->prepare("INSERT INTO ACHAT (id_client, id_employe, id_facture, id_vehicule, quantite, date_vente, prix_total) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([$data['id_client'], $data['id_employe'], $id_facture_auto, $data['id_vehicule'], $data['quantite'], $data['date_vente'], $data['prix_total']]);
        
        echo json_encode(["success" => true, "id_facture" => $id_facture_auto]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de l'ajout de la vente : " . $e->getMessage()]);
    }
}

if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || empty($data['id_vente']) || empty($data['id_client']) || empty($data['id_employe']) || empty($data['id_facture']) || empty($data['id_vehicule']) || empty($data['quantite']) || empty($data['date_vente']) || empty($data['prix_total'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE ACHAT SET id_client = ?, id_employe = ?, id_facture = ?, id_vehicule = ?, quantite = ?, date_vente = ?, prix_total = ? WHERE id_vente = ?");
        $stmt->execute([$data['id_client'], $data['id_employe'], $data['id_facture'], $data['id_vehicule'], $data['quantite'], $data['date_vente'], $data['prix_total'], $data['id_vente']]);
        
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la mise à jour de la vente : " . $e->getMessage()]);
    }
}

if ($action === 'delete') {
    $id = $_GET['id'] ?? 0;

    if ($id <= 0) {
        echo json_encode(["error" => "ID invalide"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM ACHAT WHERE id_vente = ?");
        $stmt->execute([$id]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la suppression de la vente : " . $e->getMessage()]);
    }
}

if ($action === 'getLastFacture') {
    try {
        $stmtFacture = $pdo->query("SELECT MAX(id_facture) AS dernier_facture FROM FACTURE");
        $dernierFacture = $stmtFacture->fetch(PDO::FETCH_ASSOC);
        $id_facture_auto = $dernierFacture['dernier_facture'] ? $dernierFacture['dernier_facture'] + 1 : 1;

        echo json_encode(["id_facture" => $id_facture_auto]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur SQL : " . $e->getMessage()]);
    }
}

// Suppression des achats liés à une facture
if ($action === 'deleteByFacture') {
    $id_facture = $_GET['id_facture'] ?? 0;

    if ($id_facture <= 0) {
        echo json_encode(["error" => "ID Facture invalide"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("DELETE FROM ACHAT WHERE id_facture = ?");
        $stmt->execute([$id_facture]);
        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la suppression des achats liés à cette facture : " . $e->getMessage()]);
    }
}

// Calculate the total amount for a given invoice (id_facture) and return it as JSON.
if ($action === 'getMontantTotal') {
    $id_facture = $_GET['id_facture'] ?? 0;

    if ($id_facture <= 0) {
        echo json_encode(["error" => "ID Facture invalide"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("SELECT SUM(prix_total) AS montant_total FROM ACHAT WHERE id_facture = ?");
        $stmt->execute([$id_facture]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        echo json_encode(["montant_total" => $result['montant_total'] ?? 0]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors du calcul du montant total : " . $e->getMessage()]);
    }
}

?>
