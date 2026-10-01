# MyTravels

MyTravels is a Cordova mobile application for discovering, creating, and saving travel itineraries. Users can register and log in, browse trips on a map, view itinerary stops and photos, publish their own trips, and save favorites.

## Academic Context

This project was developed as part of a class project at École polytechnique. It was created to apply web and mobile development concepts through the design of a travel-sharing application with a Cordova client, a PHP API, database persistence, authentication, and map integration.

The project is split into a mobile client and a PHP API:

- `mobile/`: Cordova web client built with HTML, CSS, jQuery, Mustache, Bootstrap, and Google Maps.
- `api/`: PHP API backed by MySQL/MariaDB and OAuth2.
- `database/schema.sql`: database schema for a new local installation.
- `docs/`: optional project documentation.

## Requirements

- A Cordova-compatible Android setup if you want to build the mobile application.
- PHP 8.0+ with PDO MySQL enabled.
- MySQL or MariaDB.
- Composer for the PHP OAuth2 dependency.
- A Google Maps API key with the required Maps JavaScript and geocoding APIs enabled.

## Configuration

1. Copy `mobile/www/js/config.js.example` to `mobile/www/js/config.js`.
2. Set the API URL, OAuth client values, and Google Maps key in `config.js`.
3. Copy `api/.env.example` to `api/.env` and set the database values. Do not commit `.env`.
4. From `api/`, install the PHP dependencies:

   ```text
   composer install
   ```

5. Create a database and import `database/schema.sql`.
6. Build or serve `mobile/` through Cordova, and serve `api/` as the PHP API. Update `apiBaseUrl` to match that API URL.

The frontend expects the API endpoints to be available at the configured base URL. The PHP API uses the `MYTRAVELS_DB_*` environment variables shown in `.env.example`.

## Project Notes

- The SQL file contains schema only. Add test users and travel records locally rather than committing real accounts, tokens, or image data.
- Google Maps API keys are browser-visible by design, so restrict the key by API and application origin in Google Cloud Console.
- The original school report is kept in `docs/rapport-modal.docx` and is not required to run the application.
