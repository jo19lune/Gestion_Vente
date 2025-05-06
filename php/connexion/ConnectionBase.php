<?php
require_once __DIR__ . '/Constantes.php';

//require_once __DIR__ . '/../gestion/Constantes.php';

class ConnectionBase {
    public static function getConnection() {
        try {
            $dsn = "mysql:host=" . Constantes::getHost() . ";dbname=" . Constantes::getDbName() . ";charset=utf8";
            $pdo = new PDO($dsn, Constantes::getUser(), Constantes::getPassword(), [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]);
            return $pdo;
        } catch (PDOException $e) {
            die(json_encode(["error" => "Erreur de connexion : " . $e->getMessage()]));
        }
    }
}
?>
