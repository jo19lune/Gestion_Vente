<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestion des Ventes</title>
        <link rel="stylesheet" href="../assets/css/root.css">
        <link rel="stylesheet" href="../assets/css/style.css">
        <link rel="stylesheet" href="../assets/css/achat.css">


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
                    <li><a href="page_vehicule.php">Véhicule</a></li>
                </ul>
            </nav>
        </header>

        <main>
            <section>
                <h2>Rechercher une vente</h2>
                <input type="text" id="searchAchatInput" class="search" placeholder="Rechercher une vente..." aria-label="Rechercher une vente" onkeyup="searchAchats()">
            </section>

            <section>
                <h2>Liste des Ventes</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID Vente</th>
                            <th>ID Client</th>
                            <th>ID Employé</th>
                            <th>ID Facture</th>
                            <th>ID Véhicule</th>
                            <th>Date Vente</th>
                            <th>Catégorie</th>
                            <th>Marque</th>
                            <th>Modèle</th>
                            <th>Quantité</th>
                            <th>Prix Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="achatsTable">
                        <!-- Les ventes -->
                    </tbody>
                    <tfoot class="actionValide">
                        <tr>
                            <td colspan="2"><p>Montant Total :</p></td>
                            <td colspan="4"><input type="number" id="montant_total" placeholder="Montant Total" readonly></td>
                            <td colspan="6">
                                <button id="btnValider" class="valider">Valider</button>
                                <button id="btnAnnuler" class="annuler">Annuler</button>
                                <style>
                                    .valider{
                                        background: green;
                                    }
                                    .annuler {
                                        background: var(--warm-red);
                                    }
                                </style>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </section>

            <section>
                <h2>Ajouter une vente</h2>
                <form id="addAchatForm" class="achat-form">
                    <input type="number" id="id_client" placeholder="ID Client" required>
                    <input type="number" id="id_employe" placeholder="ID Employé" required>
                    <input type="number" id="id_facture" placeholder="ID Facture" required readonly>
                    <input type="number" id="id_vehicule" placeholder="ID Véhicule" required>
                    <input type="number" id="quantite" placeholder="Quantité" required min="1">
                    <input type="date" id="date_vente" required>
                    <input type="number" id="prix_total" placeholder="Prix Total" required min="0" step="0.01" readonly>
                    <button type="submit" class="add">Ajouter</button>
                </form>
            </section>

            <section>
                <h2>Modifier une vente</h2>
                <form id="updateAchatForm" class="achat-form">
                    <input type="number" id="id_vente_update" placeholder="ID Vente" required>
                    <input type="number" id="id_client_update" placeholder="ID Client" required>
                    <input type="number" id="id_employe_update" placeholder="ID Employé" required>
                    <input type="number" id="id_facture_update" placeholder="ID Facture" required>
                    <input type="number" id="id_vehicule_update" placeholder="ID Véhicule" required>
                    <input type="number" id="quantite_update" placeholder="Quantité" required min="1">
                    <input type="date" id="date_vente_update" required>
                    <input type="number" id="prix_total_update" placeholder="Prix Total" required min="0" step="0.01">
                    <button type="submit" class="update">Modifier</button>
                </form>
            </section>
        </main>

        <script src="../assets/js/modules/achat.js" defer></script>

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
