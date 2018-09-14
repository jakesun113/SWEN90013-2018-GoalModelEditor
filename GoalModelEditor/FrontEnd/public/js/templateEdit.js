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
const UNAME = Cookies.get("UIID");

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