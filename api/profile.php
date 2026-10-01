<?php

require_once 'headers/cors_header.php';
require 'includes/database.class.php';

$dbh = Database::connect();

if (!isset($_GET['user'])) {
    echo json_encode(['error' => 'Missing user parameter']);
    exit;
}

$images = Database::getProfile($dbh, $_GET['user']);
echo json_encode($images);