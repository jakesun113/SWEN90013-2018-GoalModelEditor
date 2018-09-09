// Setup form validation on all forms
$.validate({
    modules : 'security',
    reCaptchaSiteKey: '...',
    reCaptchaTheme: 'light'
});

// Register submit
// send the request to front-end server with {username, firstname, lastname, email, password}
// if successful redirect the user to home page
$("#register").submit(function(evt) {
    evt.preventDefault();
    let url = "/user/register";
    let formData = $(this).serialize();
    $.ajax(url, {
        data: formData,
        type: "POST",
        success: function() {
            window.location.href = "/login";
        }
    }).fail(function(jqXHR) {
        if (jqXHR.statusText === "OK") {
            window.location.href = "/login";
        } else {
            alert(jqXHR.responseJSON.message);
        }
    }); // end ajax
}); // end submit
