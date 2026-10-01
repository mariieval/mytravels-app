<?php

require_once __DIR__ . '/config.php';

class Database
{

    public static function connect()
    {
        $dbName = getenv('MYTRAVELS_DB_NAME') ?: 'myTravels';
        $dbServer = getenv('MYTRAVELS_DB_HOST') ?: '127.0.0.1';
        $dbUser = getenv('MYTRAVELS_DB_USER') ?: 'root';
        $dbPass = getenv('MYTRAVELS_DB_PASSWORD') ?: '';

        $dsn = 'mysql:dbname=' . $dbName . ';host=' . $dbServer;
        $dbh = null;
        try {
            $dbh = new PDO($dsn, $dbUser, $dbPass, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"));
            $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            return false;
        }

        return $dbh;
    }

    public static function getLocation($dbh, $code = false)
    {
        if ($code !== false) {
            $query = "SELECT * FROM locations WHERE code = :code";
            $sth = $dbh->prepare($query);
            $sth->execute(["code" => $code]);
        } else {
            $query = "SELECT * FROM `locations`";
            $sth = $dbh->prepare($query);
            $sth->execute();
        }
        $result = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public static function insertLocation($dbh, $code, $lat, $lng, $name)
    {
        $sth = $dbh->prepare("INSERT INTO locations (code, lat, lng, name) VALUES (:code, :lat, :lng, :name)");
        $sth->execute(["code" => $code, "lat" => $lat, "lng" => $lng, "name" => $name]);
    }

    public static function insertTravel($dbh, $title, $latStart, $lngStart, $code, $summary, $user, $days)
    {
        $sth = $dbh->prepare("INSERT INTO travels (title, latStart, lngStart, code, summary, user, days) VALUES (:title, :latStart, :lngStart, :code, :summary, :user, :days)");
        $sth->execute(["title" => $title, "latStart" => $latStart, "lngStart" => $lngStart, "code" => $code, "summary" => $summary, "user" => $user, "days" => $days]);
    }


    public static function getIfUserExists($dbh, $username)
    {
        $sth = $dbh->prepare("SELECT username FROM oauth_users WHERE username = :username");
        $sth->execute(["username" => $username]);
        $count = $sth->rowCount();
        if ($count == 0) {
            return false;
        }
        return true;
    }

    public static function insertUser($dbh, $login, $password, $email)
    {
        $sth = $dbh->prepare("INSERT INTO oauth_users (username, password, email, email_verified, scope) VALUES (:username, SHA1(:password), :email, :email_verified, :scope)");
        $sth->execute(["username" => $login, "password" => $password, "email" => $email, "email_verified" => 1, "scope" => NULL]);
    }

    public static function insertPhoto($dbh, $code, $img)
    {
        $sth = $dbh->prepare("INSERT INTO photos (code, image) VALUES (:code, :image)");
        $sth->execute(["code" => $code, "image" => $img]);
    }

    public static function getPhotos($dbh, $user = false)
    {
        if ($user === false) {
            $sth = $dbh->prepare("SELECT t.code, t.title, t.summary, t.latStart, t.lngStart, t.user, t.date, JSON_ARRAYAGG( JSON_OBJECT('text', p.image) ) AS photos FROM travels AS t LEFT JOIN photos AS p ON p.code = t.code GROUP BY t.code, t.title, t.summary, t.latStart, t.lngStart, t.user ORDER BY t.code;");
            $sth->execute();
            $images = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $images;
        } else {
            $sth = $dbh->prepare("SELECT t.code, t.title, t.summary, t.latStart, t.lngStart, t.user, t.date, JSON_ARRAYAGG( JSON_OBJECT('text', p.image) ) AS photos FROM travels AS t LEFT JOIN photos AS p ON p.code = t.code WHERE t.user = :user GROUP BY t.code, t.title, t.summary, t.latStart, t.lngStart, t.user ORDER BY t.code;");
            $sth->execute(["user" => $user]);
            $images = $sth->fetchAll(PDO::FETCH_ASSOC);
            return $images;
        }

    }

    public static function getDisplay($dbh, $code, $user)
    {
        $sth = $dbh->prepare("SELECT t.code, t.title, t.summary, t.latStart, t.lngStart, t.user, t.date, t.days, p.photos, l.address, l.latitudes AS lat, l.longitudes AS lng, CASE WHEN f.code IS NOT NULL THEN 1 ELSE 0 END AS isFavorite FROM travels AS t LEFT JOIN ( SELECT code, JSON_ARRAYAGG(JSON_OBJECT('text', image)) AS photos FROM photos GROUP BY code ) AS p ON p.code = t.code LEFT JOIN ( SELECT code, JSON_ARRAYAGG(JSON_OBJECT('text', lat)) AS latitudes, JSON_ARRAYAGG(JSON_OBJECT('text', lng)) AS longitudes, JSON_ARRAYAGG(JSON_OBJECT('text', name)) AS address FROM locations GROUP BY code ) AS l ON l.code = t.code LEFT JOIN favorites AS f ON f.code = t.code AND f.user = :user WHERE t.code = :code ORDER BY t.code; ");
        $sth->execute(["user" => $user, "code" => $code]);
        $travel = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $travel;
    }

    public static function addFavorite($dbh, $user, $code)
    {
        $sth = $dbh->prepare("INSERT IGNORE INTO favorites (user, code) VALUES (:user, :code)");
        $sth->execute(["user" => $user, "code" => $code]);
    }

    public static function removeFavorite($dbh, $user, $code)
    {
        $sth = $dbh->prepare("DELETE FROM favorites WHERE user = :user AND code = :code");
        $sth->execute(["user" => $user, "code" => $code]);
    }

    public static function getSaved($dbh, $user)
    {
        $sth = $dbh->prepare("SELECT f.user, f.code, t.title, t.summary, t.date, t.days, t.user AS creator, p.photos FROM favorites AS f LEFT JOIN ( SELECT code, JSON_ARRAYAGG(JSON_OBJECT('text', image)) AS photos FROM photos GROUP BY code) AS p ON p.code = f.code LEFT JOIN travels AS t ON t.code = f.code WHERE f.user = :user ORDER BY f.user; ");
        $sth->execute(["user" => $user]);
        $images = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $images;
    }

    public static function filterTravels($dbh, $north, $south, $east, $west)
    {
        $sth = $dbh->prepare("SELECT t.code, t.title, t.summary, t.date, t.days, t.latStart, t.lngStart, p.photos FROM travels AS t LEFT JOIN ( SELECT code, JSON_ARRAYAGG(JSON_OBJECT('text', image)) AS photos FROM photos GROUP BY code ) AS p ON p.code = t.code WHERE t.latStart BETWEEN :south AND :north AND t.lngStart BETWEEN :west AND :east ORDER BY t.date DESC");
        $sth->execute(['south' => $south,'north' => $north,'west' => $west,'east' => $east]);
        $travels = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $travels;
    }

    public static function getProfile($dbh, $user)
    {
        $sth = $dbh->prepare("SELECT u.username, u.email, COUNT(DISTINCT t.code) AS travels_created, COUNT(DISTINCT f.code) AS travels_saved FROM oauth_users u LEFT JOIN travels t ON t.user = u.username LEFT JOIN favorites f ON f.user = u.username WHERE u.username = :user GROUP BY u.username, u.email; ");
        $sth->execute(["user" => $user]);
        $profile = $sth->fetchAll(PDO::FETCH_ASSOC);
        return $profile;
    }
}
