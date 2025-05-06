-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : ....
-- Généré le : mar. 06 mai 2025 à 17:49
-- Version du serveur : 9.1.0
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `gestion_vente_pro`
--
CREATE DATABASE IF NOT EXISTS `gestion_vente_pro` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `gestion_vente_pro`;

-- --------------------------------------------------------

--
-- Structure de la table `achat`
--

DROP TABLE IF EXISTS `achat`;
CREATE TABLE IF NOT EXISTS `achat` (
  `id_vente` int NOT NULL AUTO_INCREMENT,
  `date_vente` date NOT NULL,
  `id_client` int NOT NULL,
  `id_employe` int NOT NULL,
  `id_vehicule` int NOT NULL,
  `id_facture` int DEFAULT NULL,
  `quantite` int NOT NULL,
  `prix_total` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id_vente`),
  KEY `id_facture` (`id_facture`),
  KEY `idx_client` (`id_client`),
  KEY `idx_employe` (`id_employe`),
  KEY `idx_vehicule` (`id_vehicule`)
) ENGINE=MyISAM AUTO_INCREMENT=79 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `achat`
--

INSERT INTO `achat` (`id_vente`, `date_vente`, `id_client`, `id_employe`, `id_vehicule`, `id_facture`, `quantite`, `prix_total`) VALUES
(1, '2025-04-20', 1, 6, 3, 1, 1, 8500.00),
(2, '2025-04-22', 2, 7, 5, 2, 2, 18000.00),
(3, '2025-04-21', 3, 8, 7, 3, 1, 7200.00),
(4, '2025-04-23', 4, 9, 10, 4, 1, 9500.00),
(5, '2025-04-24', 5, 10, 12, 5, 2, 6200.00),
(6, '2025-04-25', 6, 6, 14, 6, 1, 4600.00),
(7, '2025-04-26', 7, 7, 17, 7, 2, 10400.00),
(8, '2025-04-27', 8, 8, 19, 8, 1, 3200.00),
(9, '2025-04-28', 9, 9, 8, 9, 2, 13500.00),
(10, '2025-04-29', 10, 10, 15, 10, 1, 9900.00);

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

DROP TABLE IF EXISTS `client`;
CREATE TABLE IF NOT EXISTS `client` (
  `id_client` int NOT NULL AUTO_INCREMENT,
  `nom_client` varchar(50) NOT NULL,
  `prenom_client` varchar(50) NOT NULL,
  `cin_client` varchar(12) NOT NULL,
  `adresse` varchar(200) DEFAULT NULL,
  `telephone` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_client`),
  UNIQUE KEY `cin_client` (`cin_client`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id_client`, `nom_client`, `prenom_client`, `cin_client`, `adresse`, `telephone`, `email`) VALUES
(1, 'Rakoto', 'Jean', '121234567890', 'Ambohijatovo, Antananarivo', '0321234567', 'jean.rakoto@example.com'),
(2, 'Ramanisa', 'Sophie', '221234567890', 'Ankirihiry, Toamasina', '0339876543', 'sophie.ramanisa@example.com'),
(3, 'Andrianina', 'Thomas', '321234567890', 'Mahavoky, Mahajanga', '0346789123', 'thomas.andrianina@example.com'),
(4, 'Randrianasolo', 'Elise', '421234567890', 'Sambava Centre, Sambava', '0373456789', 'elise.randrianasolo@example.com'),
(5, 'Rasolo', 'Nicolas', '521234567890', 'Isaha, Fianarantsoa', '0389876543', 'nicolas.rasolo@example.com'),
(6, 'Ravelo', 'Alice', '621234567890', 'Ankadilalana, Antsirabe', '0327654321', 'alice.ravelo@example.com'),
(7, 'Rakotonirina', 'David', '721234567890', 'Ampasimbe, Toamasina', '0334567890', 'david.rakotonirina@example.com'),
(8, 'Raharinirina', 'Claire', '821234567890', 'Andranomena, Toliara', '0343456789', 'claire.raharinirina@example.com'),
(9, 'Randrianasolo', 'Lucas', '921234567890', 'Besarety, Antananarivo', '0371234567', 'lucas.randrianasolo@example.com'),
(10, 'Raharisoa', 'Emma', '102123456789', 'Mahamanina, Mahajanga', '0382345678', 'emma.raharisoa@example.com');

-- --------------------------------------------------------

--
-- Structure de la table `employe`
--

DROP TABLE IF EXISTS `employe`;
CREATE TABLE IF NOT EXISTS `employe` (
  `id_employe` int NOT NULL AUTO_INCREMENT,
  `nom_employe` varchar(50) NOT NULL,
  `prenom_employe` varchar(50) NOT NULL,
  `cin_employe` varchar(12) NOT NULL,
  `adresse_employe` varchar(200) NOT NULL,
  `telephone_employe` varchar(10) DEFAULT NULL,
  `email_employe` varchar(100) DEFAULT NULL,
  `mot_de_passe` varchar(100) DEFAULT NULL,
  `poste_employe` varchar(50) NOT NULL,
  `salaire` decimal(10,2) DEFAULT NULL,
  `date_embauche` date NOT NULL,
  PRIMARY KEY (`id_employe`),
  UNIQUE KEY `cin_employe` (`cin_employe`)
) ENGINE=MyISAM AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `employe`
--

INSERT INTO `employe` (`id_employe`, `nom_employe`, `prenom_employe`, `cin_employe`, `adresse_employe`, `telephone_employe`, `email_employe`, `mot_de_passe`, `poste_employe`, `salaire`, `date_embauche`) VALUES
(1, 'Rakoto', 'Jean', '123456789012', 'Ville Haute, Fianarantsoa', '0321234567', 'jean.rakoto@example.com', 'admin123', 'Admin', 3500.00, '2022-01-10'),
(2, 'Ramanisa', 'Sophie', '223456789012', 'Ankidanonkona, Fianarantsoa', '0339876543', 'sophie.ramanisa@example.com', 'admin456', 'Admin', 3600.00, '2021-09-15'),
(3, 'Andrianina', 'Thomas', '323456789012', 'Ambatomena, Fianarantsoa', '0346789123', 'thomas.andrianina@example.com', 'admin789', 'Admin', 3700.00, '2020-05-20'),
(4, 'Rasolo', 'Elise', '423456789012', 'Ampasambazaha, Fianarantsoa', '0373456789', 'elise.rasolo@example.com', 'manager123', 'Manager', 4200.00, '2019-07-14'),
(5, 'Randriamanana', 'Nicolas', '523456789012', 'Isaha, Fianarantsoa', '0389876543', 'nicolas.randriamanana@example.com', 'manager456', 'Manager', 4300.00, '2020-11-23'),
(6, 'Ravelo', 'Alice', '623456789012', 'Antsahamasina, Fianarantsoa', '0327654321', 'alice.ravelo@example.com', 'vendeur123', 'Vendeur', 2500.00, '2023-03-10'),
(7, 'Rakotonirina', 'David', '723456789012', 'Ankidanonkona, Fianarantsoa', '0334567890', 'david.rakotonirina@example.com', 'vendeur456', 'Vendeur', 2600.00, '2022-06-05'),
(8, 'Raharinirina', 'Claire', '823456789012', 'Andrainjato, Fianarantsoa', '0343456789', 'claire.raharinirina@example.com', 'vendeur789', 'Vendeur', 2550.00, '2021-08-12'),
(9, 'Randrianasolo', 'Lucas', '923456789012', 'Ambohimandroso, Fianarantsoa', '0371234567', 'lucas.randrianasolo@example.com', 'vendeur321', 'Vendeur', 2700.00, '2020-04-18'),
(10, 'Raharisoa', 'Emma', '102345678901', 'Ambalavato, Fianarantsoa', '0382345678', 'emma.raharisoa@example.com', 'vendeur654', 'Vendeur', 2650.00, '2019-02-27');

-- --------------------------------------------------------

--
-- Structure de la table `facture`
--

DROP TABLE IF EXISTS `facture`;
CREATE TABLE IF NOT EXISTS `facture` (
  `id_facture` int NOT NULL AUTO_INCREMENT,
  `id_client` int NOT NULL,
  `id_employe` int NOT NULL,
  `date_facturation` date NOT NULL,
  `mode_paiement` varchar(50) NOT NULL,
  `montant_total` decimal(10,2) NOT NULL,
  `etat_facture` varchar(50) NOT NULL DEFAULT 'En attente',
  PRIMARY KEY (`id_facture`),
  KEY `id_employe` (`id_employe`),
  KEY `idx_facture` (`id_client`)
) ENGINE=MyISAM AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `facture`
--

INSERT INTO `facture` (`id_facture`, `id_client`, `id_employe`, `date_facturation`, `mode_paiement`, `montant_total`, `etat_facture`) VALUES
(1, 1, 6, '2025-04-20', 'Especes', 8500.00, 'PAYEE'),
(2, 2, 7, '2025-04-22', 'Carte bancaire', 18000.00, 'PAYEE'),
(3, 3, 8, '2025-04-21', 'Especes', 7200.00, 'EN ATTENTE'),
(4, 4, 9, '2025-04-23', 'Carte bancaire', 9500.00, 'EN ATTENTE'),
(5, 5, 10, '2025-04-24', 'Especes', 6200.00, 'PAYEE'),
(6, 6, 6, '2025-04-25', 'Carte bancaire', 4600.00, 'EN ATTENTE'),
(7, 7, 7, '2025-04-26', 'Carte bancaire', 10400.00, 'PAYEE'),
(8, 8, 8, '2025-04-27', 'Especes', 3200.00, 'PAYEE'),
(9, 9, 9, '2025-04-28', 'Carte bancaire', 13500.00, 'EN ATTENTE'),
(10, 10, 10, '2025-04-29', 'Carte bancaire', 6800.00, 'PAYEE'),
(11, 0, 0, '2025-05-06', '', 73900.00, 'En attente'),
(12, 0, 0, '2025-05-06', '', 73900.00, 'En attente'),
(13, 0, 0, '2025-05-06', '', 73900.00, 'En attente');

-- --------------------------------------------------------

--
-- Structure de la table `vehicule`
--

DROP TABLE IF EXISTS `vehicule`;
CREATE TABLE IF NOT EXISTS `vehicule` (
  `id_vehicule` int NOT NULL AUTO_INCREMENT,
  `marque` varchar(50) NOT NULL,
  `model` varchar(50) NOT NULL,
  `cyl` int NOT NULL,
  `moteur` varchar(50) NOT NULL,
  `categorie` varchar(50) NOT NULL,
  `stock` int NOT NULL DEFAULT '0',
  `prix_u` decimal(18,2) NOT NULL,
  PRIMARY KEY (`id_vehicule`)
) ENGINE=MyISAM AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `vehicule`
--

INSERT INTO `vehicule` (`id_vehicule`, `marque`, `model`, `cyl`, `moteur`, `categorie`, `stock`, `prix_u`) VALUES
(1, 'Yamaha', 'MT-07', 689, 'Essence', 'Moto', 5, 7500.00),
(2, 'Honda', 'CB500F', 500, 'Essence', 'Moto', 3, 6500.00),
(3, 'Kawasaki', 'Ninja 400', 399, 'Essence', 'Moto', 6, 6200.00),
(4, 'Suzuki', 'GSX-S750', 749, 'Essence', 'Moto', 4, 8500.00),
(5, 'Ducati', 'Panigale V2', 955, 'Essence', 'Moto', 2, 17900.00),
(6, 'BMW', 'S1000RR', 999, 'Essence', 'Moto', 3, 20500.00),
(7, 'KTM', 'Duke 390', 373, 'Essence', 'Moto', 7, 5900.00),
(8, 'Triumph', 'Street Triple 765', 765, 'Essence', 'Moto', 5, 9800.00),
(9, 'Harley-Davidson', 'Sportster S', 1250, 'Essence', 'Moto', 2, 13499.00),
(10, 'Aprilia', 'RS660', 660, 'Essence', 'Moto', 4, 11200.00),
(11, 'Yamaha', 'XMAX 300', 300, 'Essence', 'Scooter', 5, 5800.00),
(12, 'Honda', 'Forza 125', 125, 'Essence', 'Scooter', 4, 5200.00),
(13, 'Piaggio', 'Vespa GTS 300', 300, 'Essence', 'Scooter', 6, 6700.00),
(14, 'Kymco', 'Xciting S 400i', 400, 'Essence', 'Scooter', 3, 7500.00),
(15, 'Suzuki', 'Burgman 650', 650, 'Essence', 'Scooter', 2, 9900.00),
(16, 'Aprilia', 'SR GT 200', 200, 'Essence', 'Scooter', 7, 5200.00),
(17, 'BMW', 'C 400 X', 400, 'Essence', 'Scooter', 5, 7800.00),
(18, 'KTM', 'E-Speed', 50, 'Électrique', 'Scooter', 4, 4500.00),
(19, 'Niu', 'NQi GT', 50, 'Électrique', 'Scooter', 6, 4200.00),
(20, 'Yadea', 'G5', 50, 'Électrique', 'Scooter', 5, 3900.00);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
