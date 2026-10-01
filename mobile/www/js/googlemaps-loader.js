(function () {
    var script = document.createElement("script");
    var params = new URLSearchParams({
        key: APP_CONFIG.googleMapsApiKey,
        callback: "initMap",
        v: "weekly"
    });

    script.src = "https://maps.googleapis.com/maps/api/js?" + params.toString();
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
}());
