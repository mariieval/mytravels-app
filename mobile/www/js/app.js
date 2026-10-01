$(document).ready(function () {

    $(window).on('hashchange', route);

    function route() {
        var hash = window.location.hash;
        switch (hash) {
            default:
                if (localStorage.getItem("access_token") == null) {
                    window.location.hash = "#register";
                    break;
                }
                else {
                    window.location.hash = "#home";
                    break;
                }

            case "#login":
                $.get("template/login.tpl.html", function (template) {
                    $("#my-navbar").hide();
                    $("#my-content").html(template);
                    $("#loginConnect").click(function () {
                        oAuthConnect()
                            .done(function (data) {
                                localStorage.setItem("access_token", data["access_token"]);
                                localStorage.setItem("userId", $("#loginUser").val());
                                $("#my-navbar").show();
                                window.location.hash = "#home";
                            })
                            .fail(function (xhr, status, error) {
                                var err = eval("(" + xhr.responseText + ")");
                                // si l'authentification oAuth ne se passe pas bien, on récupère le message d'erreur dans le tableau err
                                alert(err["error_description"]);
                            });
                    })
                }, "html");
                break;

            case "#register":
                $.get("template/register.tpl.html", function (template) {
                    $("#my-navbar").hide();
                    $("#my-content").html(template);
                    let serveur = url;
                    $("#registerButton").click(function () {
                        var username = $("#inputUsername").val();
                        var pass1 = $("#inputPassword").val();
                        var pass2 = $("#checkPassword").val();
                        var email = $("#inputEmail").val();
                        $.post(serveur + "/register.php", { username: username, pass1: pass1, pass2: pass2, email: email }, function (data) {
                            if (data["error"] != null) {
                                document.getElementById("modal-body-error").textContent = data["error"];
                                const myModal = new bootstrap.Modal(document.getElementById("error"));
                                myModal.show();
                            }
                            else {
                                const myModal = new bootstrap.Modal(document.getElementById("success"));
                                myModal.show();
                                window.location.hash = "#login";
                            }
                        });
                    });

                }, "html");
                break;

            case "#home":
                $.get("template/my.tpl.html", function (template) {
                    $.getJSON(url + "/add.php", { "user": localStorage['userId'] }, function (data) {
                        for (let i = 0; i < data.length; i++) {
                            data[i].photos = data[i].photos ? JSON.parse(data[i].photos) : [];
                            if (data[i].photos.length) {
                                data[i].photos[0].isFirst = true;
                            }
                        }
                        content = Mustache.render(template, data);
                        $("#my-content").html(content);

                        $(document).on("click", ".travel-card", function (event) {
                            if ($(event.target).closest(".carousel").length > 0) {
                                return;
                            }
                            sessionStorage.setItem("selectedTravelCode", $(this).data("code"));
                            sessionStorage.setItem("previousHash", "#home");
                            window.location.href = "#display";
                        });
                    });

                }, "html");
                break;

            case "#profile":
                $.get("template/profile.tpl.html", function (template) {
                    $.getJSON(url + "/profile.php", { "user": localStorage['userId'] }, function (data) {
                        content = Mustache.render(template, data);
                        $("#my-content").html(content);
                    });
                    $(document).on("click", "#disconnect", function () {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("userId");
                        window.location.hash = "#login";
                    });
                }, "html");
                break;

            case "#saved":
                $.get("template/saved.tpl.html", function (template) {
                    $.getJSON(url + "/saved.php", { "user": localStorage['userId'] }, function (data) {
                        for (let i = 0; i < data.length; i++) {
                            data[i].photos = data[i].photos ? JSON.parse(data[i].photos) : [];
                            if (data[i].photos.length) {
                                data[i].photos[0].isFirst = true;
                            }
                        }
                        content = Mustache.render(template, data);
                        $("#my-content").html(content);
                        if (data.length === 0) {
                            $("#no-saved-message").show();
                        } else {
                            $("#no-saved-message").hide();
                        }
                        $(document).on("click", ".travel-card", function (event) {
                            if ($(event.target).closest(".carousel").length > 0) {
                                return;
                            }
                            sessionStorage.setItem("selectedTravelCode", $(this).data("code"));
                            sessionStorage.setItem("previousHash", "#saved");
                            window.location.href = "#display";
                        });
                        $(document).on("click", "#go-to-search", function () {
                            window.location.hash = "#search";
                        });
                    });
                }, "html");
                break;

            case "#search":
                $.get("template/explore.tpl.html", function (template) {
                    $.getJSON(url + "/add.php", function (data) {
                        for (let i = 0; i < data.length; i++) {
                            data[i].photos = data[i].photos ? JSON.parse(data[i].photos) : [];
                            if (data[i].photos.length) {
                                data[i].photos[0].isFirst = true;
                            }
                        }
                        content = Mustache.render(template, data);
                        $("#my-content").html(content);
                        $(document).on("click", ".travel-results", function () {
                            sessionStorage.setItem("selectedTravelCode", $(this).data("code"));
                            sessionStorage.setItem("previousHash", "#search");
                            window.location.href = "#display";
                        });
                        waitForGoogleMaps(() => {
                            let map4 = new google.maps.Map(document.getElementById("map4"), {
                                zoom: 4,
                                center: { lat: 48.85, lng: 2.35 },
                                mapTypeId: 'hybrid',
                                disableDefaultUI: true
                            });
                            for (let j = 0; j < data.length; j++) {
                                var lat = parseFloat(data[j].latStart);
                                var lng = parseFloat(data[j].lngStart);
                                new google.maps.Marker({
                                    position: { lat: lat, lng: lng },
                                    map: map4,
                                    title: data[j].title || "Point sélectionné",
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
                                });
                            }
                            function fetchTravelsInBounds() {
                                const bounds = map4.getBounds();
                                const ne = bounds.getNorthEast();
                                const sw = bounds.getSouthWest();
                                const params = {
                                    north: ne.lat(),
                                    south: sw.lat(),
                                    east: ne.lng(),
                                    west: sw.lng()
                                };
                                $.get(url + "/travelSearch.php", params, function (data2) {
                                    if (data.error) {
                                        console.error(data.error);
                                        return;
                                    }
                                    for (let i = 0; i < data2.length; i++) {
                                        data2[i].photos = data2[i].photos ? JSON.parse(data2[i].photos) : [];
                                    }
                                    $.get("template/searchresult.tpl.html", function (template2) {
                                        const rendered = Mustache.render(template2, data2);
                                        $("#results-section").html(rendered);
                                        if (data2.length === 0) {
                                            $("#no-results-message2").show();
                                        } else {
                                            $("#no-results-message2").hide();
                                        }
                                    }, "html");
                                }, "json");
                            }
                            google.maps.event.addListener(map4, 'idle', function () {
                                fetchTravelsInBounds();
                            });
                            google.maps.event.addListenerOnce(map4, 'idle', function () {
                                fetchTravelsInBounds();
                            });
                        });
                    });
                }, "html");
                break;

            case "#add":
                $.get("template/add.tpl.html", function (template) {
                    let serveur = url;
                    let code = makeid(30);
                    sessionStorage.setItem("codeNewTravel", code);
                    let latStart;
                    let lngStart;
                    var currentId = 0;
                    var uniqueId = function () {
                        return ++currentId;
                    }
                    var startmarkers = {};
                    $("#my-content").html(template);
                    waitForGoogleMaps(() => {
                        initMap();
                    });
                    $('#valider').on('click', function () {
                        if (window.selectedGeocodingResult) {
                            const { lat, lng, address } = window.selectedGeocodingResult;
                            if (sessionStorage['whichloc'] == 'stop') {
                                new google.maps.Marker({
                                    map: map,
                                    position: { lat: lat, lng: lng },
                                    title: address || "Point sélectionné",
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                });
                                $.post(serveur + "/location.php", { code: code, lat: lat, lng: lng, name: address }, function (data) {
                                });
                                return;
                            }
                            if (sessionStorage['whichloc'] == 'start') {
                                var id = uniqueId();
                                latStart = lat;
                                lngStart = lng;
                                var marker = new google.maps.Marker({
                                    id: id,
                                    map: map,
                                    position: { lat: lat, lng: lng },
                                    title: address || "Point sélectionné",
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png',
                                });
                                startmarkers[id] = marker;
                                var marker = startmarkers[id - 1];
                                marker.setMap(null);
                                return;
                            }
                        } else {
                            alert("Veuillez d'abord sélectionner un lieu !");
                        }
                    });
                    $("#saveChanges").click(function () {
                        let title = $("#title").val();
                        let summary = $("#summary").val();
                        let user = localStorage['userId'];
                        let days = $("#duree-voyage").val();
                        $.post(serveur + "/travels.php", { title: title, latStart: latStart, lngStart: lngStart, code: code, summary: summary, user: user, days: days }, function (data) { });
                        window.location.hash = "#home";
                    });
                    $("#returnHome").click(function () {
                        window.location.hash = "#home";
                    });
                }, "html");
                break;

            case "#display":
                let travelCode = sessionStorage.getItem("selectedTravelCode");
                if (!travelCode) {
                    $.get("template/error.tpl.html", function (templateError) {
                        $("#my-content").html(templateError);
                    }, "html");
                    break;
                }
                else {
                    $.get("template/display.tpl.html", function (template) {
                        $.post(url + "/display.php", { "code": travelCode, "user": localStorage.getItem('userId') }, function (data) {
                            for (let i = 0; i < data.length; i++) {
                                data[i].photos = data[i].photos ? JSON.parse(data[i].photos) : [];
                                if (data[i].photos.length) {
                                    data[i].photos[0].isFirst = true;
                                }
                                data[i].lat = data[i].lat ? JSON.parse(data[i].lat).map(item => parseFloat(item.text)) : [];
                                data[i].lng = data[i].lng ? JSON.parse(data[i].lng).map(item => parseFloat(item.text)) : [];
                                data[i].address = data[i].address ? JSON.parse(data[i].address).map(item => item.text) : [];
                            }
                            content = Mustache.render(template, data);
                            $("#my-content").html(content);
                            const isFavorite = Number(data[0].isFavorite);
                            if (isFavorite === 1) {
                                $("#add-to-favorites").hide();
                            }
                            if (isFavorite === 0) {
                                $("#remove-from-favorites").hide();
                            }
                            $(document).on("click", ".gallery-item", function () {
                                let image = $(this).data("code");
                                const modal = new bootstrap.Modal(document.getElementById("image-display"));
                                $("#displayed-image").attr("src", image);
                                modal.show();
                            });
                            $(document).on("click", "#add-to-favorites", function () {
                                $.post(url + "/favorites.php", { action: 'add_location', code: travelCode, user: localStorage.getItem('userId') }, function (data) {
                                    if (data["error"] != null) {
                                        alert(data["error"]);
                                    }
                                    else {
                                        $("#add-to-favorites").hide();
                                        $("#remove-from-favorites").show();
                                    }
                                }, "json");
                            });
                            $(document).on("click", "#remove-from-favorites", function () {
                                $.post(url + "/favorites.php", { action: 'remove_location', code: travelCode, user: localStorage.getItem('userId') }, function (data) {
                                    if (data["error"] != null) {
                                        alert(data["error"]);
                                    }
                                    else {
                                        $("#remove-from-favorites").hide();
                                        $("#add-to-favorites").show();
                                    }
                                }, "json");
                            });
                            $(document).on("click", "#return-button", function () {
                                window.location.hash = sessionStorage.getItem("previousHash") || "#home";
                            });
                            waitForGoogleMaps(() => {
                                const myLatLng = { lat: 48.85, lng: 2.35 };
                                map3 = new google.maps.Map(document.getElementById("map3"), {
                                    zoom: 4,
                                    center: myLatLng,
                                    mapTypeId: 'hybrid',
                                    disableDefaultUI: true
                                });
                                for (let j = 0; j < data[0].lat.length; j++) {
                                    var lat = data[0].lat[j];
                                    var lng = data[0].lng[j];
                                    new google.maps.Marker({
                                        position: { lat: lat, lng: lng },
                                        map: map3,
                                        icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                                        title: data[0].address[j] || "Point sélectionné"
                                    });
                                }
                                lat = parseFloat(data[0].latStart);
                                lng = parseFloat(data[0].lngStart);
                                new google.maps.Marker({
                                    position: { lat: lat, lng: lng },
                                    map: map3,
                                    icon: 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png'
                                });
                            });
                        }, "json");
                    }, "html");
                    break;
                }
        }
    }
    route();
});


function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


function waitForGoogleMaps(callback) {
    if (window.google && google.maps) {
        callback();
    } else {
        setTimeout(() => waitForGoogleMaps(callback), 100);
    }
}
