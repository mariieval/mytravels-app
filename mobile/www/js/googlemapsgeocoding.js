let map2;
let marker;
let geocoder;
let responseDiv;
let response;
let map;
let map3;


function initMap() {
    const myLatLng = { lat: 48.85, lng: 2.35 };
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 4,
        center: myLatLng,
        mapTypeId: 'hybrid',
        disableDefaultUI: true

    });

    map2 = new google.maps.Map(document.getElementById("geocoding-map"), {
        zoom: 5,
        center: { lat: 48, lng: 2 },
        mapTypeControl: false,
    });
    geocoder = new google.maps.Geocoder();


    const inputText = document.getElementById("search-input");
    submitButton = document.getElementById("search-button");
    clearButton = document.getElementById("clear");

    response = document.createElement("pre");
    response.id = "response";
    response.innerText = "";


    marker = new google.maps.Marker({
        map2,
    });
    map2.addListener("click", (e) => {
        geocode({ location: e.latLng });
    });
    submitButton.addEventListener("click", () =>
        geocode({ address: inputText.value }),

    );
    clearButton.addEventListener("click", () => {
        clear();
    });
    clear();
}

function clear() {
    marker.setMap(null);
    selectedGeocodingResult = null;
}

function geocode(request) {
    clear();
    geocoder
        .geocode(request)
        .then((result) => {
            const { results } = result;

            const loc = results[0].geometry.location;

            map2.setCenter(loc);
            marker.setPosition(loc);
            marker.setMap(map2);

            selectedGeocodingResult = {
                lat: loc.lat(),
                lng: loc.lng(),
                address: results[0].formatted_address,
            };

            return results;
        })
        .catch((e) => {
            alert("Geocode was not successful for the following reason: " + e);
        });
}


