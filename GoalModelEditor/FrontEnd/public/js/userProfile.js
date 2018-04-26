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

var fname = document.getElementById("firstname");
var lname = document.getElementById("lastname");
var company = document.getElementById("company");
var email = document.getElementById("email");

ccl.style.visibility = 'hidden';

fname.setAttribute("readOnly", 'true');
lname.setAttribute("readOnly", 'true');
company.setAttribute("readOnly", 'true');
email.setAttribute("readOnly", 'true');

button.onclick = function () {
    Show_Hidden(username);
    Show_Hidden(orpwd);
    Show_Hidden(newpwd);
    Show_Hidden(cfpwd);

    Show_Cancel(ccl);

    Change_Title(title);

    if (button.value == "Edit") {
        button.value = "Confirm";
        button.type = "button";
    }
    else {
        button.value = "Edit";
        button.type = "submit";

    }
    Change_Readonly(fname);
    Change_Readonly(lname);
    Change_Readonly(company);
    Change_Readonly(email);

}

ccl.onclick = function () {
    Show_Hidden(username);
    Show_Hidden(orpwd);
    Show_Hidden(newpwd);
    Show_Hidden(cfpwd);

    Show_Cancel(ccl);

    Change_Title(title);

    if (button.value == "Edit")
        button.value = "Confirm";
    else button.value = "Edit";

    Change_Readonly(fname);
    Change_Readonly(lname);
    Change_Readonly(company);
    Change_Readonly(email);

}
