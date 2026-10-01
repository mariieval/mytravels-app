<?php

require_once __DIR__ . '/includes/config.php';

$dbName = getenv('MYTRAVELS_DB_NAME') ?: 'myTravels';
$dbHost = getenv('MYTRAVELS_DB_HOST') ?: '127.0.0.1';
$username = getenv('MYTRAVELS_DB_USER') ?: 'root';
$password = getenv('MYTRAVELS_DB_PASSWORD') ?: '';
$dsn = 'mysql:dbname=' . $dbName . ';host=' . $dbHost;

// Autoloading (composer is preferred, but for this example let's just do this)
// $dsn is the Data Source Name for your database
$storage = new OAuth2\Storage\Pdo(array('dsn' => $dsn, 'username' => $username, 'password' => $password));

// Pass a storage object or array of storage objects to the OAuth2 server class
$server = new OAuth2\Server($storage);

// Add the grant type UserCredentials
$grantType = new OAuth2\GrantType\UserCredentials($storage);
$server->addGrantType($grantType);
