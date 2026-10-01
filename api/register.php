<?php
require_once 'headers/cors_header.php';
include("includes/database.class.php");
$dbh = Database::connect();

$fail = isset($_POST['username'], $_POST['pass1'], $_POST['pass2'], $_POST['email']);

if (!$fail) {
    $message = "Problème de champ";
    $error = array('error' => $message);
    echo json_encode($error);
    // on arrête l'execution du programme
    exit();
}

$username = $_POST['username'];
$pass1 = $_POST['pass1'];
$pass2 = $_POST['pass2'];
$email = $_POST['email'];


$fail = ($username != "" && $pass1 != "" && $pass2 != "" && $email != "");

if (!$fail) {
    $message = "Champ manquant";
    $error = array('error' => $message);
    echo json_encode($error);
    // on arrête l'execution du programme
    exit();
}

$test = $pass1 == $pass2;

if (!$test) {
    $message = "Deux mots de passe non identiques";
    $error = array('error' => $message);
    echo json_encode($error);
    // on arrête l'execution du programme
    exit();
}

$test = Database::getIfUserExists($dbh, $username);

if ($test) {
    $message = "Le nom d'utilisateur existe déjà";
    $error = array("error" => $message);
    echo json_encode($error);
    exit();
}

Database::insertUser($dbh, $username, $pass1, $email);
$message = "success";
$success = array("success" => $message);
echo json_encode($success);
exit();