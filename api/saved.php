<?php

require_once 'headers/cors_header.php';
require 'includes/database.class.php';

$dbh = Database::connect();

$user = $_GET['user'];

$images = Database::getSaved($dbh,$user);
echo json_encode($images);