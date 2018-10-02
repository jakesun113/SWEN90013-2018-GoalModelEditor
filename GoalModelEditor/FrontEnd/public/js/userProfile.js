/***
 * JavaScript For get and edit user profile functions
 */

"use strict";

/**
 * Define all variables and constants used across functions
 */

//define actions when click "edit"
$("#edit").click(function() {
    $("#username").hide();

    $("#title").html("<strong>Edit personal info</strong>");

    //when clicking "edit", can edit these fields
    $("#fnametxt").removeAttr("readonly");
    $("#lnametxt").removeAttr("readonly");
    $("#emailtxt").removeAttr("readonly");

    $("#edit").hide();
    $("#return").hide();
    $("#changepwd").hide();
    $("#confirm1").show();
    $("#cancel1").show();
});

//define actions when click "change password"
$("#changepwd").click(function() {
    $("#username").hide();
    $("#pwdform").show();

    $("#title").html("<strong>Change password</strong>");
    //clear the value of password field
    $("#orpwdtxt").val("");
    $("#newpwdtxt").val("");
    $("#cfpwdtxt").val("");

    $("#firstname").hide();
    $("#lastname").hide();
    $("#email").hide();

    $("#edit").hide();
    $("#changepwd").hide();
    $("#return").hide();
});

//define actions when click "cancel", opposite to the "edit"
$("#cancel1").click(function() {
    //reload page
    location.reload(true);

    $("#username").show();

    $("#title").html("<strong>Personal info</strong>");

    $("#fnametxt").val("");
    $("#lnametxt").val("");
    $("#emailtxt").val("");

    $("#fnametxt").attr("readonly", "readonly");
    $("#lnametxt").attr("readonly", "readonly");
    $("#emailtxt").attr("readonly", "readonly");

    $("#edit").show();
    $("#changepwd").show();
    $("#return").show();
    $("#confirm1").hide();
    $("#cancel1").hide();
});

//define actions when click "cancel", opposite to the "edit"
$("#cancel2").click(function() {
    //reload page
    location.reload(true);

    $("#username").show();
    $("#pwdform").hide();

    $("#firstname").show();
    $("#lastname").show();
    $("#email").show();

    $("#title").html("<strong>Personal info</strong>");

    $("#orpwdtxt").val("");
    $("#newpwdtxt").val("");
    $("#cfpwdtxt").val("");

    $("#fnametxt").attr("readonly", "readonly");
    $("#lnametxt").attr("readonly", "readonly");
    $("#emailtxt").attr("readonly", "readonly");

    $("#edit").show();
    $("#changepwd").show();
    $("#return").show();
});

//at first, load data from server using ajax
$(document).ready(function() {

    //when page is first loaded, set these fields as "read only"
    $("#usernametext").attr("readonly", "readonly");
    $("#fnametxt").attr("readonly", "readonly");
    $("#lnametxt").attr("readonly", "readonly");
    $("#emailtxt").attr("readonly", "readonly");

    //get token and user id from the cookie
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let id = secret.uid;
    let url = "/user/profile/" + id;
    //get method to request data from the backend
    $.ajax(url, {
        headers: { Authorization: "Bearer " + token },
        type: "GET",
        success: function(profile) {
            $("#usernametext").val(profile.username);
            $("#fnametxt").val(profile.firstname);
            $("#lnametxt").val(profile.lastname);
            $("#emailtxt").val(profile.email);
        }
    }).fail(function(jqXHR) {
        alert(jqXHR.statusText + ". Please contact us.");
    }); // end ajax
}); // end ready

//when clicking "submit" of editing profile, after validation success, put data to the backend
$("#profile").validator().on("submit", function (evt) {
        //by default, when the form is invalid, .preventDefault() is called
        //so when the form is valid
        if (!evt.isDefaultPrevented()) {
            // make the original submit invalid
            evt.preventDefault();
            //do the page transaction
            $("#username").show();

            $("#title").html("<strong>Personal info</strong>");

            $("#fnametxt").attr("readonly", "readonly");
            $("#lnametxt").attr("readonly", "readonly");
            $("#emailtxt").attr("readonly", "readonly");

            $("#edit").show();
            $("#return").show();
            $("#changepwd").show();
            $("#confirm1").hide();
            $("#cancel1").hide();

            //send the updated data to server using ajax
            let formData = $(this).serialize();
            let secret = JSON.parse(Cookies.get("LOKIDIED"));
            let token = secret.token;
            let id = secret.uid;
            let url = "/user/profile/" + id;
            $.ajax(url, {
                data: formData,
                type: "PUT",
                headers: { Authorization: "Bearer " + token },
                success: function(result) {
                    $("#firstname").val(result.firstname);
                    $("#lastname").val(result.lastname);
                    $("#email").val(result.email);
                }
            }).fail(function(jqXHR) {
                alert(jqXHR.responseJSON.message);
            }); // end ajax
        }
    });

//when clicking "submit" of changing password, after validation success, put data to the backend
$("#pwdform").validator().on("submit", function (evt) {
        //by default, when the form is invalid, .preventDefault() is called
        //so when the form is valid
        if (!evt.isDefaultPrevented()) {
            // make the original submit invalid
            evt.preventDefault();
            //do the page transaction
            $("#username").show();
            $("#pwdform").hide();

            $("#title").html("<strong>Personal info</strong>");

            $("#firstname").show();
            $("#lastname").show();
            $("#email").show();

            $("#fnametxt").attr("readonly", "readonly");
            $("#lnametxt").attr("readonly", "readonly");
            $("#emailtxt").attr("readonly", "readonly");

            $("#edit").show();
            $("#return").show();
            $("#changepwd").show();

            //send the updated data to server using ajax
            let formData = $(this).serialize();
            let secret = JSON.parse(Cookies.get("LOKIDIED"));
            let token = secret.token;
            let id = secret.uid;
            let url = "/user/cred/" + id;
            $.ajax(url, {
                data: formData,
                type: "PUT",
                headers: { Authorization: "Bearer " + token },
                success: function(result) {
                    //send original pwd and new pwd to the server
                    $("#notice")
                        .slideDown()
                        .delay(3000)
                        .slideUp();
                }
            }).fail(function(jqXHR) {
                alert(jqXHR.responseJSON.message);
            }); // end ajax
        }
    });
