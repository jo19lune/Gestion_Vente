<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../connexion/ConnectionBase.php';

$conn = ConnectionBase::getConnection();

header('Content-Type: application/json');

$data = [];

// Vérification de la connexion
if (!$conn) {
    echo json_encode(["error" => "Erreur de connexion à la base de données"]);
    exit;
}

// 🔹 **1. Ventes mensuelles**
$query = "SELECT MONTH(date_vente) AS mois, SUM(prix_total) AS total_ventes FROM ACHAT GROUP BY mois ORDER BY mois";
$data["ventes"] = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC) ?? [];

// 🔹 **2. Nombre total de clients**
$query = "SELECT COUNT(id_client) AS total_clients FROM CLIENT";
$data["clients_total"] = $conn->query($query)->fetch(PDO::FETCH_ASSOC) ?? [];

// 🔹 **3. Top 5 clients ayant le plus acheté**
$query = "SELECT c.nom_client, c.prenom_client, SUM(a.prix_total) AS total_achats 
          FROM CLIENT c 
          JOIN ACHAT a ON c.id_client = a.id_client 
          GROUP BY c.id_client, c.nom_client, c.prenom_client 
          ORDER BY total_achats DESC 
          LIMIT 5";
$data["clients"] = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC) ?? [];

// 🔹 **4. Meilleurs vendeurs (top employés par ventes)**
$query = "SELECT e.nom_employe, e.prenom_employe, COUNT(a.id_vente) AS nombre_ventes 
          FROM EMPLOYE e 
          JOIN ACHAT a ON e.id_employe = a.id_employe 
          GROUP BY e.id_employe, e.nom_employe, e.prenom_employe 
          ORDER BY nombre_ventes DESC 
          LIMIT 5";
$data["employes"] = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC) ?? [];

// 🔹 **5. Stock restant par marque**
$query = "SELECT marque, SUM(stock) AS stock_total FROM VEHICULE GROUP BY marque ORDER BY stock_total DESC";
$data["vehicules"] = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC) ?? [];

// 🔹 **6. Prix moyen des véhicules par catégorie**
$query = "SELECT categorie, AVG(prix_u) AS prix_moyen FROM VEHICULE GROUP BY categorie";
$data["vehicules_prix_moyen"] = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC) ?? [];

// 🔹 **7. Montant total des ventes par employé**
$query = "SELECT e.nom_employe, e.prenom_employe, SUM(a.prix_total) AS total_ventes 
          FROM EMPLOYE e 
          JOIN ACHAT a ON e.id_employe = a.id_employe 
          GROUP BY e.id_employe, e.nom_employe, e.prenom_employe 
          ORDER BY total_ventes DESC";
$data["employes_ventes"] = $conn->query($query)->fetchAll(PDO::FETCH_ASSOC) ?? [];

// 🔹 **8. Vérification et sortie JSON**
echo json_encode($data, JSON_PRETTY_PRINT);
?>
