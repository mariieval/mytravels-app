<?php
require_once 'headers/cors_header.php';
include("includes/database.class.php");
$dbh = Database::connect();

if (!isset($_POST["code"]) || !isset($_POST["user"])) {
    $msg = array('error' => 'Incomplete datas');
    echo json_encode($msg);
    exit();
}

$code = $_POST["code"];
$user = $_POST["user"];

$display = Database::getDisplay($dbh, $code, $user);
echo json_encode($display);
