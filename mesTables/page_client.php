<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des Clients</title>
    <link rel="stylesheet" href="../assets/css/root.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <!-- <link rel="stylesheet" href="../assets/css/client.css"> -->
    <script src="../assets/js/core/jquery-3.7.1.min.js"></script>
</head>
<body>
    <header>
        <div class="logo">
            <a href="http://localhost/Gestion_Vente/mesTables/base.php"><img src="../icons/Logo.png" alt="Logo"></a>
        </div>
        <nav class="navigation">
            <ul>
                <li><a href="http://localhost/Gestion_Vente/mesTables/page_achat.php">Achat</a></li>
                <li><a href="http://localhost/Gestion_Vente/mesTables/page_client.php">Client</a></li>
                <li><a href="http://localhost/Gestion_Vente/mesTables/page_employe.php">Employé</a></li>
                <li><a href="http://localhost/Gestion_Vente/mesTables/page_facture.php">Facture</a></li>
                <li><a href="http://localhost/Gestion_Vente/mesTables/page_vehicule.php">Véhicule</a></li>
            </ul>
        </nav>
    </header>


    <h2>Rechercher un client</h2>
    <input type="text" id="searchClientInput" class="search" placeholder="Rechercher" onkeyup="searchClients()">

    <h2>Liste des Clients</h2>
    <table border="1">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>CIN n°</th>
                <th>Adresse</th>
                <th>Téléphone</th>
                <th>Email</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody id="clientsTable">
            <!-- Les clients seront affichés ici dynamiquement -->
        </tbody>
    </table>

    <h2>Ajouter un client</h2>
    <form id="addClientForm">
        <input type="text" id="nom_client" placeholder="Nom" required>
        <input type="text" id="prenom_client" placeholder="Prénom" required>
        <input type="number" id="cin_client" placeholder="CIN" required>
        <input type="text" id="adresse_client" placeholder="Adresse" required>
        <input type="text" id="telephone_client" placeholder="Téléphone">
        <input type="email" id="email_client" placeholder="Email" required>
        
        <button type="submit" class="add">Ajouter</button>
    </form>

    <h2>Modifier un client</h2>
    <form id="updateClientForm">
        <input type="number" id="id_client_update" placeholder="ID du client" required>
        <input type="text" id="nom_update" placeholder="Nom" required>
        <input type="text" id="prenom_update" placeholder="Prénom" required>
        <input type="number" id="cin_update" placeholder="CIN" required>
        <input type="text" id="adresse_update" placeholder="Adresse" required>
        <input type="text" id="telephone_update" placeholder="Téléphone">
        <input type="email" id="email_update" placeholder="Email" required>
        
        <button type="submit" class="update">Modifier</button>
    </form>

    <script src="../assets/js/modules/client.js"></script>

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