// picture numbers
let numOfImages = 1;

/**
 * read image from local and show on the page
 */
function readImage() {
    if (window.File && window.FileList && window.FileReader) {
        let files = event.target.files; //FileList object
        let output = $(".preview-images-zone");
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            // check file type
            if (!file.type.match("image")) continue;
            // add file to formData
            formData.append("image", file);

            let picReader = new FileReader();
            picReader.addEventListener("load", function(event) {
                let picFile = event.target;
                // generate the picture html
                let html =
                    '<div class="preview-image preview-show-' +
                    numOfImages +
                    '">' +
                    '<div class="image-cancel" data-no="' +
                    numOfImages +
                    '">x</div>' +
                    '<div class="image-zone"><img id="pro-img-' +
                    numOfImages +
                    '" src="' +
                    picFile.result +
                    '"></div>' +
                    // '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' + num + '" class="btn btn-light btn-edit-image">edit</a></div>' +
                    "</div>";

                output.append(html);
                numOfImages = numOfImages + 1;
            });
            picReader.readAsDataURL(file);
        }
        uploadPictures(formData);
        $("#pro-image").val("");
    } else {
        $("#warning-alert").html(
            "Browser supporting issue, please try another browser."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }
}

/**
 * Upload pictures function
 * @param formData
 */
function uploadPictures(formData) {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/images/" + userId + "/" + modelId;
    $.ajax(url, {
        // the API of upload pictures
        type: "POST",
        contentType: false,
        data: formData,
        processData: false,
        async: true,
        headers: { Authorization: "Bearer " + token },
        success: function(data) {
            $("#success-alert").html("Image successfully Uploaded.");
            $("#success-alert")
                .slideDown()
                .delay(3000)
                .slideUp();
            goalClick();
        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    });
}

/* Load images from server */
/**
 * Load images from server
 */
function loadImages() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/images/" + userId + "/" + modelId;
    $.ajax(url, {
        // the API of upload pictures
        type: "GET",
        headers: { Authorization: "Bearer " + token },
        success: function(stream) {
            console.log(stream);
            let images = JSON.parse(stream)._streams;
            let output = $(".preview-images-zone");
            let number = 1;
            for (let i in images) {
                if (images[i] && images[i][0] !== "-") {
                    let html =
                        '<div class="preview-image preview-show-' +
                        number +
                        '">' +
                        '<div class="image-cancel" data-no="' +
                        number +
                        '">x</div>' +
                        '<div class="image-zone"><img id="pro-img-' +
                        number +
                        '" src="' +
                        "data:image/png;base64," +
                        images[i] +
                        '"></div>' +
                        "</div>";
                    output.append(html);
                    number++;
                }
            }
        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}