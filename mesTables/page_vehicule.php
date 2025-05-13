<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Véhicules</title>
    <link rel="stylesheet" href="../assets/css/root.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <!-- <link rel="stylesheet" href="../assets/css/vehicule.css"> -->

    <script src="../assets/js/core/jquery-3.7.1.min.js"></script>
</head>
<body>
        <header>
            <div class="logo">
                <a href="http://localhost/Gestion_Vente/mesTables/base.php">
                    <img src="../icons/Logo.png" alt="Logo du site">
                </a>
            </div>
            <nav class="navigation">
                <ul>
                    <li><a href="page_achat.php">Achat</a></li>
                    <li><a href="page_client.php">Client</a></li>
                    <li><a href="page_employe.php">Employé</a></li>
                    <li><a href="page_facture.php">Facture</a></li>
                    <li><a href="page_statistique.php">Statistiques</a></li>
                    <li><a href="page_vehicule.php">Véhicule</a></li>
                </ul>
            </nav>
            <div class="burger-menu">
                <img src="../icons/MenuLogo.png" alt="Menu Logo" srcset="">
            </div>
        </header>

        <section>
            <h2>Rechercher un véhicule</h2>
            <input type="text" id="searchVehiculeInput" class="search" placeholder="Rechercher" onkeyup="searchVehicules()">
        </section>

    <h2>Liste des Véhicules</h2>
    <div class="table-container">
        <table border="1">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Marque</th>
                    <th>Modèle</th>
                    <th>Cylindrée</th>
                    <th>Moteur</th>
                    <th>Catégorie</th>
                    <th>Stock</th>
                    <th>Prix Unitaire (€)</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="vehiculesTable">
                <!-- Les lignes du tableau seront ajoutées dynamiquement via JavaScript -->
            </tbody>
        </table>
    </div>

    <h2>Ajouter un véhicule</h2>
    <form id="addVehiculeForm">
        <input type="text" id="marque" placeholder="Marque" required>
        <input type="text" id="modele" placeholder="Modèle" required>
        <input type="number" id="cylindree" placeholder="Cylindrée" required>
        <input type="text" id="moteur" placeholder="Moteur" required>
        <input type="text" id="categorie" placeholder="Catégorie" required>
        <input type="number" id="stock" placeholder="Stock" required>
        <input type="number" step="0.01" id="prix_u" placeholder="Prix Unitaire (€)" required>
        <button type="submit" class="add">Ajouter</button>
    </form>

    <h2>Modifier un véhicule</h2>
    <form id="updateVehiculeForm">
        <input type="number" id="id_vehicule_update" placeholder="ID du véhicule" required>
        <input type="text" id="marque_update" placeholder="Marque" required>
        <input type="text" id="modele_update" placeholder="Modèle" required>
        <input type="number" id="cylindree_update" placeholder="Cylindrée" required>
        <input type="text" id="moteur_update" placeholder="Moteur" required>
        <input type="text" id="categorie_update" placeholder="Catégorie" required>
        <input type="number" id="stock_update" placeholder="Stock" required>
        <input type="number" step="0.01" id="prix_u_update" placeholder="Prix Unitaire (€)" required>
        <button type="submit" class="update">Modifier</button>
    </form>

    <script src="../assets/js/core/header.js"></script>  
    <script src="../assets/js/modules/vehicule.js"></script>

    <footer>
        <div class="footer-container">
            <p>&copy; 2025 Mon Site Web. Tous droits réservés.</p>
            
            <div class="footer-links">
                <a href="contact.php">Contact</a>
                <a href="mentions_legales.php">Mentions légales</a>
                <a href="politique_confidentialite.php">Politique de confidentialité</a>
            </div>
            
            <div class="social-icons">
                <a href="https://m.me/loick.johny" target="_blank">
                    <img src="../icons/facebook_blanc.png" alt="Facebook">
                    <span>Facebook</span>
                </a>
                <a href="https://github.com/jo19lune" target="_blank">
                    <img src="../icons/github_blanc.png" alt="GitHub">
                    <span>GitHub</span>
                </a>
                <a href="https://wa.me/261325255146" target="_blank">
                    <img src="../icons/whatsapp_blanc.png" alt="Whatsapp">
                    <span>WhatsApp</span>
                </a>
            </div>
        </div>
    </footer>
</body>
</html>
