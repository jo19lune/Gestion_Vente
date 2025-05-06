<?php
class Constantes {
    private const HOST = "localhost";
    private const DB_NAME = "gestion_vente_pro";
    private const USER = "root";
    private const PASSWORD = "";

    public static function getHost() { return self::HOST; }
    public static function getDbName() { return self::DB_NAME; }
    public static function getUser() { return self::USER; }
    public static function getPassword() { return self::PASSWORD; }
}
?>
