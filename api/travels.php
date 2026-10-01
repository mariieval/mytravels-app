<?php
 
// entête CORS pour autoriser l'accès au fichier
require_once 'headers/cors_header.php';
// ma classe Database
require 'includes/database.class.php';


$dbh = Database::connect();

if (!isset($_POST['code']) || !isset($_POST['latStart']) || !isset($_POST['lngStart']) || !isset($_POST['title']) || !isset($_POST['summary']) || !isset($_POST['user']) || !isset($_POST['days'])) {
    $msg = array('error' => 'Incomplete datas');
    echo json_encode($msg);
    exit();
}


Database::insertTravel($dbh, $_POST['title'], $_POST['latStart'], $_POST['lngStart'], $_POST['code'], $_POST['summary'], $_POST['user'], $_POST['days']);

echo json_encode(array('success' => 'Location uploaded !'));