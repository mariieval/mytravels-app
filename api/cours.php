<?php
require_once 'headers/cors_header.php';
include("includes/database.class.php");
$dbh = Database::connect();

$code = $_GET["code"];

$catalogue = Database::getDetailCours($dbh, $code);
echo json_encode($catalogue);
