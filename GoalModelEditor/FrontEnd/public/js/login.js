/***
 * JavaScript For Login and eventListeners
 * @author SICHENG LIU
 */

"use strict";

/**
 * Login submit (click) EventListener
 * send the request to the server with {username, password}
 * store the response (username) into cookies - Name: UID
 * store the response (token) into cookies - Name: LOKIDIED
 *
 * @trigger {id:register|HTMLForm}
 */
$("#login").submit(function(evt) {
    evt.preventDefault();
    let url = "/user/login";
    let formData = $(this).serialize();
    $.ajax(url, {
        data: formData,
        type: "POST",
        success: function(res) {
            let tokenP = JSON.parse(JSON.stringify(res));
            let cookie = { token: tokenP.token, uid: tokenP.user_id };
            Cookies.set("LOKIDIED", JSON.stringify(cookie), {
                expires: 1,
                path: "/"
            });
            Cookies.set("UIID", $("#username").val(), {
                expires: 1,
                path: "/"
            });
            window.location.href = "/dashboard";
        }
    }).fail(function(jqXHR) {
        $("#login-error").html(
            "You have entered an invalid username or password.<br>Please try again."
        );
        $("#login-error")
            .slideDown()
            .delay(3000)
            .slideUp();
    });
});
