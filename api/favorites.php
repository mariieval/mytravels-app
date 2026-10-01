<?php
 
// entête CORS pour autoriser l'accès au fichier
require_once 'headers/cors_header.php';
// ma classe Database
require 'includes/database.class.php';

$dbh = Database::connect();

if (!isset($_POST['action'])) {
    $msg = array('error' => 'Error: action not specified');
    echo json_encode($msg);
    exit();
}

if (!isset($_POST['code']) || !isset($_POST['user'])) {
    $msg = array('error' => 'Incomplete datas');
    echo json_encode($msg);
    exit();
}

$code = $_POST['code'];
$user = $_POST['user'];
;

if ($_POST['action'] == "add_location") {
    Database::addFavorite($dbh, $user, $code);
}

if ($_POST['action'] == "remove_location"){
    Database::removeFavorite($dbh, $user, $code);
}

echo json_encode(array('success' => 'Location uploaded !'));