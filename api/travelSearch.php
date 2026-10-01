<?php
require_once 'headers/cors_header.php';
require 'includes/database.class.php';

$dbh = Database::connect();

// Validate inputs
if (!isset($_GET['north'], $_GET['south'], $_GET['east'], $_GET['west'])) {
    echo json_encode(['error' => 'Missing bounds parameters']);
    exit();
}

$north = (float) $_GET['north'];
$south = (float) $_GET['south'];
$east = (float) $_GET['east'];
$west = (float) $_GET['west'];


$travels = Database::filterTravels($dbh,$north, $south, $east, $west);

echo json_encode($travels);
