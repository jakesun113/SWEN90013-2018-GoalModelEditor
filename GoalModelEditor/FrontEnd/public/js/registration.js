// function validation() {
//     var passid = document.registration.passid;
//     var uname = document.registration.username;
//     var uemail = document.registration.email;
//     var ufirstname = document.registration.firstname;
//     var ulastname = document.registration.lastname;
//
//     if (allLetter(uname)) {
//         if (allLetter(ufirstname)) {
//             if (allLetter(ulastname)) {
//                 if (ValidateEmail(uemail)) {
//                     if (passid_validation(passid, 6, 18)) {
//                         if (validatePassword()){
//                             alert('Form Successfully Submitted');
//                             window.location = "login.html"
//                             return true;
//                         }
//                     }
//                 }
//             }
//         }
//     }
//     else {
//         return false;
//     }
//
// }



function passid_validation(passid,mx,my)
{
    var passwid_len = passid.value.length;
    if (passwid_len == 0 ||passid_len >= my || passid_len < mx)
    {
        alert("Password should not be empty / length be between "+mx+" to "+my);
        passid.focus();
        return false;
    }
    return true;
}

function allLetter(uname)
{
    var letters = /^[A-Za-z]+$/;
    if(uname.value.match(letters))
    {
        return true;
    }
    else
    {
        alert('Name must have alphabet characters only');
        uname.focus();
        return false;
    }
}

function ValidateEmail(uemail)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(uemail.value.match(mailformat))
    {
        return true;
    }
    else
    {
        alert("You have entered an invalid email address!");
        uemail.focus();
        return false;
    }
}

function validatePassword(){
    var password = document.getElementById("password");
    var confirm_password = document.getElementById("confirm_password");
    if(password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
        return false;
    } else {
        confirm_password.setCustomValidity('');
        return true;
    }
}


