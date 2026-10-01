var url = APP_CONFIG.apiBaseUrl;
var client_id = APP_CONFIG.oauthClientId;
var client_secret = APP_CONFIG.oauthClientSecret;

function oAuthConnect() {
    // récupérez ici avec Jquery les valeurs contenus dans vos champs <input> du template de login
    var username = $("#loginUser").val();
    var password = $("#loginPass").val();

    return $.post(url + "/token.php", {
        client_id: client_id,
        client_secret: client_secret,
        grant_type: "password",
        username: username,
        password: password,
    });

}