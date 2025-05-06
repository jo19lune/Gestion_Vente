<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../connexion/ConnectionBase.php';

try {
    $pdo = ConnectionBase::getConnection();
    $pdo->exec("SET NAMES 'utf8mb4'");
} catch (PDOException $e) {
    echo json_encode(["error" => "Erreur de connexion à la base de données : " . $e->getMessage()]);
    exit;
}

$action = $_GET['action'] ?? '';

if ($action === 'create' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Vérification des données envoyées
    if (!$data || empty($data['montant_total']) || empty($data['id_client']) || empty($data['id_employe'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    try {
        // Préparer et exécuter la requête
        $stmt = $pdo->prepare("
            INSERT INTO FACTURE (id_client, id_employe, montant_total, date_facturation, mode_paiement) 
            VALUES (?, ?, ?, NOW(), 'Especes')
        ");
        $stmt->execute([$data['id_client'], $data['id_employe'], $data['montant_total']]);

        // Récupérer l'ID de la facture nouvellement créée
        $id_facture = $pdo->lastInsertId();

        echo json_encode(["success" => true, "id_facture" => $id_facture]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la création de la facture : " . $e->getMessage()]);
    }
}


if ($action === 'getDetails') {
    $id_facture = $_GET['id_facture'] ?? 0;

    // Vérification rapide
    if ($id_facture <= 0) {
        echo json_encode(["error" => "ID Facture invalide", "id_recupéré" => $id_facture]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("
            SELECT f.*, c.*, e.*
            FROM FACTURE f
            JOIN CLIENT c ON f.id_client = c.id_client
            JOIN EMPLOYE e ON f.id_employe = e.id_employe
            WHERE f.id_facture = ?
        ");
        $stmt->execute([$id_facture]);
        $factureDetails = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$factureDetails) {
            echo json_encode(["error" => "Aucune facture trouvée avec cet ID", "id_reçu" => $id_facture]);
            exit;
        }

        $stmtAchats = $pdo->prepare("
            SELECT v.*, a.*
            FROM ACHAT a
            JOIN VEHICULE v ON a.id_vehicule = v.id_vehicule
            WHERE a.id_facture = ?
        ");
        $stmtAchats->execute([$id_facture]);
        $achats = $stmtAchats->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(array_merge($factureDetails, ["achats" => $achats]));
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur SQL : " . $e->getMessage()]);
    }
}


// recuperer les id de facture
if ($action === 'getFactures') {
    try {
        $stmt = $pdo->query("SELECT id_facture FROM FACTURE ORDER BY date_facturation DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la récupération des factures : " . $e->getMessage()]);
    }
}

// recuperer les factures
if ($action === 'getFactureTable') {
    try {
        $stmt = $pdo->query("
            SELECT id_facture, id_client, id_employe, date_facturation, mode_paiement, montant_total, etat_facture
            FROM FACTURE 
            ORDER BY date_facturation DESC
        ");
        $factures = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if (!$factures) {
            echo json_encode(["error" => "Aucune facture trouvée"]);
            exit;
        }

        echo json_encode(["factures" => $factures]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la récupération des factures : " . $e->getMessage()]);
    }
}

// Création et overture de fichier Txt
if ($action === 'generateTxt' && isset($_GET['id_facture'])) {
    $id_facture = $_GET['id_facture'];

    try {
        // Vérification et création du dossier si nécessaire
        $dossier_factures = "C:/wamp64/www/Gestion_Vente/mesFactures";
        if (!file_exists($dossier_factures)) {
            mkdir($dossier_factures, 0777, true);
        }

        // Récupérer les détails de la facture
        $stmt = $pdo->prepare("
            SELECT f.*, c.nom_client, c.prenom_client, c.cin_client, c.telephone, c.email, 
                   e.nom_employe, e.prenom_employe, e.telephone_employe, e.email_employe
            FROM FACTURE f
            JOIN CLIENT c ON f.id_client = c.id_client
            JOIN EMPLOYE e ON f.id_employe = e.id_employe
            WHERE f.id_facture = ?
        ");
        $stmt->execute([$id_facture]);
        $facture = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$facture) {
            echo json_encode(["error" => "Facture introuvable"]);
            exit;
        }

        // Récupérer les achats liés à la facture
        $stmtAchats = $pdo->prepare("
            SELECT v.id_vehicule, v.categorie, v.marque, v.model, a.quantite, a.prix_total
            FROM ACHAT a
            JOIN VEHICULE v ON a.id_vehicule = v.id_vehicule
            WHERE a.id_facture = ?
        ");
        $stmtAchats->execute([$id_facture]);
        $achats = $stmtAchats->fetchAll(PDO::FETCH_ASSOC);

        // Définir le chemin du fichier TXT
        $nom_fichier = "Facture_{$facture['id_facture']}.txt";
        $chemin_fichier = "{$dossier_factures}/{$nom_fichier}";

        // Ouvrir le fichier en mode "a" (ajout)
        $fichier = fopen($chemin_fichier, "a");

        if (!$fichier) {
            echo json_encode(["error" => "Impossible d'ouvrir le fichier"]);
            exit;
        }

        // Verrouiller le fichier pour éviter les conflits d'écriture
        flock($fichier, LOCK_EX);

        // Écriture des données dans le fichier
        fwrite($fichier, "===== FACTURE N {$facture['id_facture']} =====\n");
        fwrite($fichier, "\nDate Facturation : {$facture['date_facturation']}\n");
        fwrite($fichier, "\nInformations Client\n");
        fwrite($fichier, "Nom : {$facture['prenom_client']} {$facture['nom_client']}\n");
        fwrite($fichier, "CIN : {$facture['cin_client']}\n");
        fwrite($fichier, "Telephone : {$facture['telephone']}\n");
        fwrite($fichier, "Email : {$facture['email']}\n");

        fwrite($fichier, "\nInformations Employe\n");
        fwrite($fichier, "Nom : {$facture['prenom_employe']} {$facture['nom_employe']}\n");
        fwrite($fichier, "Telephone : {$facture['telephone_employe']}\n");
        fwrite($fichier, "Email : {$facture['email_employe']}\n");

        fwrite($fichier, "\nMode de Paiement : {$facture['mode_paiement']}\n");
        fwrite($fichier, "Montant Total : {$facture['montant_total']} Euro\n");
        fwrite($fichier, "Etat Facture : {$facture['etat_facture']}\n");

        fwrite($fichier, "\nACHATS\n");
        fwrite($fichier, "-------------------------------------\n");

        foreach ($achats as $achat) {
            fwrite($fichier, "ID Vehicule : {$achat['id_vehicule']}\n");
            fwrite($fichier, "Categorie : {$achat['categorie']}\n");
            fwrite($fichier, "Marque : {$achat['marque']}\n");
            fwrite($fichier, "Modele : {$achat['model']}\n");
            fwrite($fichier, "Quantite(s) : {$achat['quantite']}\n");
            fwrite($fichier, "Prix Total : {$achat['prix_total']} Euro\n");
            fwrite($fichier, "-------------------------------------\n");
        }

        // Libérer le verrou et fermer le fichier
        flock($fichier, LOCK_UN);
        fclose($fichier);

        echo json_encode(["success" => true, "file" => "http://localhost/Gestion_Vente/mesFactures/{$nom_fichier}"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur SQL : " . $e->getMessage()]);
    }
}

// function for modify facture by id_facture ( id_facture, id_client, id_employe, mode_paiement, montant_total, etat_facture)
if ($action === 'update' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!$data || empty($data['id_facture']) || empty($data['id_client']) || empty($data['id_employe']) || empty($data['mode_paiement']) || empty($data['montant_total']) || empty($data['etat_facture'])) {
        echo json_encode(["error" => "Données invalides"]);
        exit;
    }

    try {
        $stmt = $pdo->prepare("UPDATE FACTURE SET id_client = ?, id_employe = ?, mode_paiement = ?, montant_total = ?, etat_facture = ? WHERE id_facture = ?");
        $stmt->execute([$data['id_client'], $data['id_employe'], $data['mode_paiement'], $data['montant_total'], $data['etat_facture'], $data['id_facture']]);

        echo json_encode(["success" => true]);
    } catch (PDOException $e) {
        echo json_encode(["error" => "Erreur lors de la mise à jour de la facture : " . $e->getMessage()]);
    }
}

// funtion to down load facture.txt
if ($action === 'download') {
    $id_facture = $_GET['id_facture'] ?? 0;

    if ($id_facture <= 0) {
        echo json_encode(["error" => "ID Facture invalide"]);
        exit;
    }

    $dossier_factures = "C:/wamp64/www/Gestion_Vente/mesFactures";
    $nom_fichier = "Facture_{$id_facture}.txt";
    $chemin_fichier = "{$dossier_factures}/{$nom_fichier}";

    if (!file_exists($chemin_fichier)) {
        echo json_encode(["error" => "Fichier introuvable"]);
        exit;
    }

    header('Content-Type: text/plain');
    header('Content-Disposition: attachment; filename="' . basename($chemin_fichier) . '"');
    readfile($chemin_fichier);
    exit;
}

// action checkFileTxt
if ($action === 'checkFileTxt') {
    $id_facture = $_GET['id_facture'] ?? 0;

    if ($id_facture <= 0) {
        echo json_encode(["error" => "ID Facture invalide"]);
        exit;
    }

    $dossier_factures = "C:/wamp64/www/Gestion_Vente/mesFactures";
    $nom_fichier = "Facture_{$id_facture}.txt";
    $chemin_fichier = "{$dossier_factures}/{$nom_fichier}";

    if (file_exists($chemin_fichier)) {
        echo json_encode(["exists" => true]);
    } else {
        echo json_encode(["exists" => false]);
    }
}

?>
