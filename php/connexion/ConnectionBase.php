<?php
require_once __DIR__ . '/Constantes.php';

class ConnectionBase {
    private static $pdo = null;

    // Obtenir une connexion PDO
    public static function getConnection() {
        if (self::$pdo === null) {
            try {
                // Vérifier que les constantes sont bien définies
                if (!self::validateConfig()) {
                    throw new Exception("Configuration incorrecte !");
                }

                // Création de la connexion PDO
                $dsn = "mysql:host=" . Constantes::getHost() . ";dbname=" . Constantes::getDbName() . ";charset=utf8";
                self::$pdo = new PDO($dsn, Constantes::getUser(), Constantes::getPassword(), [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
                ]);
            } catch (PDOException $e) {
                // Log de l'erreur et retour JSON en cas de problème
                error_log("Erreur de connexion : " . $e->getMessage());
                die(json_encode(["error" => "Impossible de se connecter à la base de données."]));
            } catch (Exception $e) {
                // Gestion des erreurs générales
                error_log("Erreur système : " . $e->getMessage());
                die(json_encode(["error" => "Problème de configuration du serveur."]));
            }
        }
        return self::$pdo;
    }

    // Vérifier que les constantes sont bien définies
    private static function validateConfig() {
        return !empty(Constantes::getHost()) &&
               !empty(Constantes::getDbName()) &&
               !empty(Constantes::getUser()) &&
               Constantes::getPassword() !== null;
    }
}
?>
