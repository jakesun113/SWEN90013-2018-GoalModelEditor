/***
 * JavaScript For Registration and eventListeners
 * @author SICHENG LIU
 */

/**
 * Setup form validation on the registration form
 */
$.validate({
    modules : 'security',
    reCaptchaSiteKey: '...',
    reCaptchaTheme: 'light'
});

/**
 * Register submit (click) EventListener
 * send the request to front-end server with {username, firstname, lastname, email, password}
 * if successful redirect the user to home page
 * @trigger {id:register|HTMLForm}
 */
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
            warningMessageSlide(jqXHR.responseJSON.message);
        }
    }); // end ajax
}); // end submit


/**
 * Function for warning notifications to show with given message
 *
 * @param {String} message
 */
function warningMessageSlide(message) {
    $("#warning-alert").html(message);
    $("#warning-alert")
        .slideDown()
        .delay(3000)
        .slideUp();
}