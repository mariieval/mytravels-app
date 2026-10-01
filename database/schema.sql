CREATE DATABASE IF NOT EXISTS myTravels CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE myTravels;

CREATE TABLE favorites (
    user varchar(40) NOT NULL,
    code varchar(255) NOT NULL,
    UNIQUE KEY unique_user_code (user, code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE locations (
    code varchar(255) NOT NULL,
    lat decimal(20,10) NOT NULL,
    lng decimal(20,10) NOT NULL,
    name varchar(255) NOT NULL,
    KEY locations_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_access_tokens (
    access_token varchar(40) NOT NULL,
    client_id varchar(80) NOT NULL,
    user_id varchar(80) DEFAULT NULL,
    expires timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    scope varchar(4000) DEFAULT NULL,
    PRIMARY KEY (access_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_authorization_codes (
    authorization_code varchar(40) NOT NULL,
    client_id varchar(80) NOT NULL,
    user_id varchar(80) DEFAULT NULL,
    redirect_uri varchar(2000) DEFAULT NULL,
    expires timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    scope varchar(4000) DEFAULT NULL,
    id_token varchar(1000) DEFAULT NULL,
    PRIMARY KEY (authorization_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_clients (
    client_id varchar(80) NOT NULL,
    client_secret varchar(80) DEFAULT NULL,
    redirect_uri varchar(2000) DEFAULT NULL,
    grant_types varchar(80) DEFAULT NULL,
    scope varchar(4000) DEFAULT NULL,
    user_id varchar(80) DEFAULT NULL,
    PRIMARY KEY (client_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_jwt (
    client_id varchar(80) NOT NULL,
    subject varchar(80) DEFAULT NULL,
    public_key varchar(2000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_refresh_tokens (
    refresh_token varchar(40) NOT NULL,
    client_id varchar(80) NOT NULL,
    user_id varchar(80) DEFAULT NULL,
    expires timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
    scope varchar(4000) DEFAULT NULL,
    PRIMARY KEY (refresh_token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_scopes (
    scope varchar(80) NOT NULL,
    is_default tinyint(1) DEFAULT NULL,
    PRIMARY KEY (scope)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE oauth_users (
    username varchar(80) NOT NULL,
    password varchar(80) DEFAULT NULL,
    email varchar(80) DEFAULT NULL,
    email_verified tinyint(1) DEFAULT NULL,
    scope varchar(4000) DEFAULT NULL,
    PRIMARY KEY (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE photos (
    code varchar(255) NOT NULL,
    image longtext NOT NULL,
    KEY photos_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE travels (
    title varchar(255) NOT NULL,
    latStart decimal(20,10) NOT NULL,
    lngStart decimal(20,10) NOT NULL,
    code varchar(255) NOT NULL,
    summary text NOT NULL,
    user varchar(40) NOT NULL,
    days int NOT NULL,
    date date NOT NULL DEFAULT (current_date),
    PRIMARY KEY (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
