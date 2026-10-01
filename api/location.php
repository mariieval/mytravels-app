<?php
 
// entête CORS pour autoriser l'accès au fichier
require_once 'headers/cors_header.php';
// ma classe Database
require 'includes/database.class.php';


$dbh = Database::connect();

if (!isset($_POST['code']) || !isset($_POST['lat']) || !isset($_POST['lng']) || !isset($_POST['name'])) {
    $msg = array('error' => 'Incomplete datas');
    echo json_encode($msg);
    exit();
}


Database::insertLocation($dbh, $_POST['code'], $_POST['lat'], $_POST['lng'], $_POST['name']);

echo json_encode(array('success' => 'Location uploaded !'));