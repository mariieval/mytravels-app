<?php

require_once 'headers/cors_header.php';
require 'includes/database.class.php';

$dbh = Database::connect();

if (!isset($_GET['user'])) {
    $images = Database::getPhotos($dbh);
    echo json_encode($images);
} else {
    $user = $_GET['user'];

    $images = Database::getPhotos($dbh, $user);
    echo json_encode($images);
}
