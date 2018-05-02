//at first, hide "cancel" button
$("#cancel").hide();

//set these fields as "read only"
$('#usernametext').attr("readonly", "readonly");
$('#firstname').attr("readonly", "readonly");
$('#lastname').attr("readonly", "readonly");
$('#email').attr("readonly", "readonly");

//define actions when click "edit"
$("#edit").click(function () {

    $("#username").hide();
    $("#orpwd").show();
    $("#newpwd").show();
    $("#cfpwd").show();

    $("#cancel").show();

    $("#title").html("Edit personal info");
    //clear the value of password field
    $("#orpwdtxt").val("");
    $("#newpwdtxt").val("");
    $("#cfpwdtxt").val("");

    $('#firstname').removeAttr("readonly");
    $('#lastname').removeAttr("readonly");
    $('#email').removeAttr("readonly");

    $("#edit").hide();
    $("#return").hide();
    $("#confirm").show();
    $("#cancel").show();

});

//define actions when click "cancel", opposite to the "edit"
$("#cancel").click(function () {

    //reload page
    location.reload(true);

    $("#username").show();
    $("#orpwd").hide();
    $("#newpwd").hide();
    $("#cfpwd").hide();

    $("#cancel").hide();

    $("#title").html("Personal info");

    $("#errmsg").hide();

    $("#orpwdtxt").val("");
    $("#newpwdtxt").val("");
    $("#cfpwdtxt").val("");

    $('#firstname').attr("readonly", "readonly");
    $('#lastname').attr("readonly", "readonly");
    $('#email').attr("readonly", "readonly");

    $("#edit").show();
    $("#return").show();
    $("#confirm").hide();
    $("#cancel").hide();


});


//at first, load data from server using ajax
$(document).ready(function () {
    $.ajax('/user/profile/profile', {
        type: "GET",
        success: function (profile) {
            $('#usernametext').val(profile[0].Username);
            $('#firstname').val(profile[0].FirstName);
            $('#lastname').val(profile[0].LastName);
            $('#email').val(profile[0].Email);
        }
    }).fail(function (jqXHR) {
        alert(jqXHR.statusText + ". Please contact us.");
    }); // end ajax

}); // end ready


$('#profile').validator().on('submit', function (evt) {
    //by default, when the form is invalid, .preventDefault() is called
    //so when the form is valid
    if (!evt.isDefaultPrevented()) {

        // make the original submit invalid
        evt.preventDefault();
        //do the page transaction
        $("#username").show();
        $("#orpwd").hide();
        $("#newpwd").hide();
        $("#cfpwd").hide();

        $("#cancel").hide();

        $("#title").html("Personal info");

        $("#errmsg").hide();

        $("#orpwdtxt").val("");
        $("#newpwdtxt").val("");
        $("#cfpwdtxt").val("");

        $('#firstname').attr("readonly", "readonly");
        $('#lastname').attr("readonly", "readonly");
        $('#email').attr("readonly", "readonly");

        $("#edit").show();
        $("#return").show();
        $("#confirm").hide();
        $("#cancel").hide();

        //send the updated data to server using ajax
        var formData = $(this).serialize();
        $.ajax('/user/profile', {
            data: formData,
            type: "POST",
            success: function (result) {
                $('#firstname').val(result[0].FirstName);
                $('#lastname').val(result[0].LastName);
                $('#email').val(result[0].Email);
                $("#notice").slideDown().delay(3000).slideUp();
            }
        }).fail(function (jqXHR) {
            alert(jqXHR.statusText + ". Please contact us.");
        });// end ajax
    }
});