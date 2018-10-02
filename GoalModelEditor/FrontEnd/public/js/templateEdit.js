/***
 * JavaScript For templateEdit functions and eventListeners
 * @author SICHENG LIU
 */

"use strict";

/**
 * Define all variables and constants used across functions
 */

/* Constants */
const SECRET = JSON.parse(Cookies.get("LOKIDIED"));
const TOKEN = SECRET.token;
const UID = SECRET.uid;
const UNAME = SECRET.uiid;

/**
 * Page onReady EventListener
 * Load user's file after loading the page content
 */
$(document).ready(() => {
    setUserName(UNAME);
});


/**
 * Function for setting the userName
 *
 * @param {String} username
 */
function setUserName(username) {
    $("#username")
        .eq(0)
        .html(username);
}

/**
 * Helper function to set the title of the page
 *
 * @param {String} title
 */
function setTitle(title) {
    $("title").eq(0).html(title);
}

/**
 * Handle click EventListener on {id:signout|Button}
 *
 * @trigger {id:signout|Button}
 */
$("#signout").click(evt => {
    evt.preventDefault();
    signOut();
    window.location.href = "/";
});

/**
 * Helper Function for signing off
 * Remove all Cookies
 */
function signOut() {
    Cookies.remove("LOKIDIED");
    Cookies.remove("UIID");
    Cookies.remove("MID");
    Cookies.remove("PID");
    Cookies.remove("TID");
}