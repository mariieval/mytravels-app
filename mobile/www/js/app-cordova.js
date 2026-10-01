document.addEventListener("deviceready", init, false);

function init() {
    console.log("Device is ready !");
}

function setOptions(srcType) {
    var options = {
        // Some common settings are 20, 50, and 100
        quality: 10,
        destinationType: Camera.DestinationType.FILE_URI,
        // In this app, dynamically set the picture source, Camera or photo gallery
        sourceType: srcType,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true  // Corrects Android orientation quirks
    }
    return options;
}

function openCamera(selection) {
    if (selection == "album") {
        var srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
    } else if (selection == "camera") {
        var srcType = Camera.PictureSourceType.CAMERA;
    } else {
        return;
    }

    var options = setOptions(srcType);

    navigator.camera.getPicture(
        function (imageURI) {
            resolveLocalFileSystemURL(imageURI, function (fileEntry) {
                // fileEntry is usable for uploading without holding image in memory...
                fileEntry.file(function (file) {
                    var reader = new FileReader();

                    reader.onloadend = function () {
                        displayImage(this.result);
                    }

                    reader.readAsDataURL(file);
                }, cameraError);
            }, cameraError);
        }, cameraError, options);
}

function cameraError(error) {
    console.debug("Unable to obtain picture: " + error, "app");

}

function displayImage(imgUri) {
    $('#myImage').attr("src", imgUri);
}

function uploadImg() {
    // récupérez ici la valeur de l'attribut SRC de votre image avec Jquery (src qui a été mis via la fonction displayImage)
    var imageData = $('#myImage').attr('src');
    // récupérez ici l'access_token oAuth de l'utilisateur - on ne veut pas que n'importe qui charge des images sur notre serveur !
    var accessToken = localStorage.getItem("access_token");
    // on envoie notre image et notre token au fichier upload.php que nous allons créer ensuite
    $.post(url + "/upload.php", {
        image: imageData,
        access_token : accessToken,
        code : sessionStorage.getItem("codeNewTravel")
    }, function (data) {
 
        if (data.success) {
            alert("Publication réussie !");
        }

        if (data.error) {
            alert(data.error);
        }
 
    });
}