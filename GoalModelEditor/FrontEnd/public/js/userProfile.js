function Show_Hidden(obj) {
    if (obj.style.display === "block") {
        obj.style.display = 'none';
    }
    else {
        obj.style.display = 'block';
    }
}

function Show_Cancel(obj) {
    if (obj.style.visibility === 'hidden') {
        obj.style.visibility = 'visible';
    }
    else {
        obj.style.visibility = 'hidden';
    }
}

function Change_Title(obj) {
    if (obj.innerHTML === "Personal info") {
        obj.innerHTML = "Edit personal info";
    }
    else {
        obj.innerHTML = "Personal info";
    }
}

function Change_Readonly(obj) {
    if (obj.getAttribute("readOnly") === 'true') {
        obj.removeAttribute("readOnly");
    }
    else {
        obj.setAttribute("readOnly", 'true');
    }
}

var button = document.getElementById('edit');
var ccl = document.getElementById("cancel");

var title = document.getElementById("title");

var username = document.getElementById("username");
var orpwd = document.getElementById("orpwd");
var newpwd = document.getElementById("newpwd");
var cfpwd = document.getElementById("cfpwd");

var nametext = document.getElementById("usernametext");
var newpwdtxt = document.getElementById("newpwdtxt");
var cfpwdtxt = document.getElementById("cfpwdtxt");

var errmsg = document.getElementById("errmsg");

var fname = document.getElementById("firstname");
var lname = document.getElementById("lastname");
var email = document.getElementById("email");

ccl.style.visibility = 'hidden';

nametext.setAttribute("readOnly", 'true');
fname.setAttribute("readOnly", 'true');
lname.setAttribute("readOnly", 'true');
email.setAttribute("readOnly", 'true');

button.onclick = function () {

    if (newpwdtxt.value != cfpwdtxt.value) {
        errmsg.style.display = 'block';
        cfpwdtxt.focus();
        return false;
    }
    else {
        errmsg.style.display = 'none';

        Show_Hidden(username);
        Show_Hidden(orpwd);
        Show_Hidden(newpwd);
        Show_Hidden(cfpwd);

        Show_Cancel(ccl);

        Change_Title(title);

        if (button.value == "Edit") {
            orpwd.value = "";
            newpwdtxt.value = "";
            cfpwdtxt.value = "";
            button.value = "Confirm";
            button.type = "button";
        }
        else {
            button.value = "Edit";
            button.type = "submit";
        }
        Change_Readonly(fname);
        Change_Readonly(lname);
        Change_Readonly(email);
    }
}

ccl.onclick = function () {
    Show_Hidden(username);
    Show_Hidden(orpwd);
    Show_Hidden(newpwd);
    Show_Hidden(cfpwd);

    Show_Cancel(ccl);

    Change_Title(title);

    errmsg.style.display = 'none';
    newpwdtxt.value = "";
    cfpwdtxt.value = "";

    if (button.value == "Edit")
        button.value = "Confirm";
    else button.value = "Edit";

    Change_Readonly(fname);
    Change_Readonly(lname);
    Change_Readonly(email);

}

$(document).ready(function () {
    $.ajax('/user/profile/profile', {
        type: "GET",
        success: function (profile) {
            nametext.value = profile[0].Username;
            fname.value = profile[0].FirstName;
            lname.value = profile[0].LastName;
            email.value = profile[0].Email;
        }
    }).fail(function (jqXHR) {
        alert(jqXHR.statusText + ". Please contact us.");
    }); // end ajax

}); // end ready

$("#profile").submit(function (evt) {
    evt.preventDefault();
    var formData = $(this).serialize();
    $.ajax('/user/profile', {
        data: formData,
        type: "POST",
        success: function (result) {
            console.log(result);
            fname.value = result[0].FirstName;
            lname.value = result[0].LastName;
            email.value = result[0].Email;
            $("#notice").slideDown().delay(3000).slideUp();
        }
    }).fail(function (jqXHR) {
        alert(jqXHR.statusText + ". Please contact us.");
    });// end ajax
});

$.validate({
    form : '#profile',
    validateOnBlur : false,
    modules : 'html5'
});