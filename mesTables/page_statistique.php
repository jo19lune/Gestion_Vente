<!DOCTYPE html>
<html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gestion des Ventes</title>
        <link rel="stylesheet" href="../assets/css/root.css">
        <link rel="stylesheet" href="../assets/css/style.css">
        <link rel="stylesheet" href="../assets/css/stat.css">

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
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

        <main>
            <div class="chart-container">
                <div class="box">
                    <div class="chart-box-title">
                        <h3>Ventes mensuelles</h3>
                    </div>
                    <div class="chart-box" id="statsChart-container">
                        <canvas id="statsChart"></canvas>
                    </div>
                </div>
                <div class="box">
                    <div class="chart-box-title">
                        <h3>Clients inscrits</h3>
                    </div>
                    <div class="chart-box" id="clientsChart-container">
                        <canvas id="clientsChart"></canvas>
                    </div>
                </div>
                <div class="box">
                    <div class="chart-box-title">
                        <h3>Stock et ventes de véhicules</h3>
                    </div>
                    <div class="chart-box" id="vehiculesChart-container">
                        <canvas id="vehiculesChart"></canvas>
                    </div>
                </div>
                <div class="box">
                    <div class="chart-box-title">
                        <h3>Performances des employés</h3>
                    </div>
                    <div class="chart-box" id="employesChart-container">
                        <canvas id="employesChart"></canvas>
                    </div>
                </div>
            </div>

            <div class="stats-table">
                <h3>Résumé des statistiques</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Mois</th>
                            <th>Total Ventes</th>
                            <th>Clients</th>
                            <th>Véhicules vendus</th>
                            <th>Meilleur Employé</th>
                        </tr>
                    </thead>
                    <tbody id="statsTableBody">
                        <!-- Les données seront insérées ici via JavaScript -->
                    </tbody>
                </table>
            </div>
        </main>


        <script src="../assets/js/core/header.js"></script>        
        <script src="../assets/js/modules/stats.js"></script>


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