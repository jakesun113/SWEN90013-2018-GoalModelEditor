/***
 * JavaScript For Registration and eventListeners
 * @author SICHENG LIU
 */

"use strict";

// Variable for username Exist validator
let username = "";

/**
 * Setup form validation on the registration form
 */
$.formUtils.addValidator({
    name: 'usernameExist',
    validatorFunction: function (value, $el, config, language, $form) {
        return value !== username;
    },
});

$.validate({
    modules: 'security',
    reCaptchaSiteKey: '...',
    reCaptchaTheme: 'light'
});

/**
 * Register submit (click) EventListener
 * send the request to front-end server with {username, firstname, lastname, email, password}
 * if successful redirect the user to home page
 * @trigger {id:register|HTMLForm}
 */
$("#register").submit(function (evt) {
    evt.preventDefault();
    let url = "/user/register";
    let formData = $(this).serialize();
    $.ajax(url, {
        data: formData,
        type: "POST",
        success: function () {
            window.location.href = "/login";
        }
    }).fail(function (jqXHR) {
        if (jqXHR.status === 200) {
            window.location.href = "/login";
        } else if (jqXHR.status === 409) {
            usernameExistHandler();
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

/**
 * Function for error message customization when username exists
 *
 */
function usernameExistHandler() {
    username = $("#username").val();
    $("#username").attr("data-validation-error-msg", "User name already exists. Please choose another one");
    $("#username").focus();
    $("#password").focus();
    $("#username").focus();
    $("#username").attr("data-validation-error-msg", "Please enter an alphanumeric value (3-12 characters)");
}