<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Détails de la Facture</title>
    <link rel="stylesheet" href="../assets/css/root.css">
    <link rel="stylesheet" href="../assets/css/style.css">
    <!-- <link rel="stylesheet" href="../assets/css/base.css"> -->
    <link rel="stylesheet" href="../assets/css/facture.css">

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
            <h2>Sélectionner une Facture</h2>
            <select name="id_facture" id="id_facture_selected" class="id_facture_selected">
                <!-- Les factures seront chargées dynamiquement ici -->
            </select>
        
            <button class="voirFichierTxt">Voir le fichier Txt</button>
            <button class="download" onclick="telechargerFacture()">Télécharger la facture</button>
        </section>

    
    <h2>Détails de la Facture</h2>
    <table border="1">
        <thead>
            <tr>
                <th>ID Facture</th>
                <th>Date Facturation</th>
                <th>Mode de Paiement</th>
                <th>Montant Total</th>
            </tr>
        </thead>
        <tbody id="factureDetails"></tbody>
    </table>

    <h2>Informations du Client</h2>
    <table border="1">
        <thead>
            <tr>
                <th>ID Client</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>CIN</th>
                <th>Téléphone</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody id="clientDetails"></tbody>
    </table>

    <h2>Informations de l'Employé</h2>
    <table border="1">
        <thead>
            <tr>
                <th>ID Employé</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Téléphone</th>
                <th>Email</th>
            </tr>
        </thead>
        <tbody id="employeDetails"></tbody>
    </table>

    <h2>Achats liés à cette facture</h2>
    <table border="1">
        <thead>
            <tr>
                <th>ID Véhicule</th>
                <th>Catégorie</th>
                <th>Marque</th>
                <th>Modèle</th>
                <th>Quantité</th>
                <th>Prix Total</th>
            </tr>
        </thead>
        <tbody id="achatsTable"></tbody>
    </table>

    <h2>Listes des factures</h2>
    <div class="table-container">
        <table border="1">
            <thead>
                <tr>
                    <th>ID Facture</th>
                    <th>ID Client</th>
                    <th>ID Employe</th>
                    <th>Date</th>
                    <th>Mode de Payement</th>
                    <th>Montant Total</th>
                    <th>Etat</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody id="facturesTable"></tbody>
        </table>
    </div>

    <h2>Modifier une facture</h2>
    <section>
        <input type="number" id="id_facture_update" placeholder="ID Facture" require>
        <input type="number" id= "id_client_update" placeholder="ID Client" require>
        <input type="number" id="id_employe_update" placeholder="ID Employe" require>
        <input type="date" id="date_update" placeholder="Date" require>
        <select name="mode" id="mode_payement_update_selected" require></select>
        <input type="number" id="montant_total" placeholder="Montant total" require readonly>
        <select name="etat" id="etat_update_selected" require></select>

        <button class="update" onclick="">Modifier</button>
        <button class="cancel">Annuler</button>
</section>

    <script src="../assets/js/core/header.js"></script>  
    <script src="../assets/js/modules/facture.js"></script>

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
