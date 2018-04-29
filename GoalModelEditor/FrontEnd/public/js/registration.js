function formValidation() {
    var passid = document.registration.passid;
    var uname = document.registration.username;
    var uemail = document.registration.email;
    var ufirstname = document.registration.firstname;
    var ulastname = document.registration.lastname;

    if (allLetter(uname)) {
        if (allLetter(ufirstname)) {
            if (allLetter(ulastname)) {
                if (ValidateEmail(uemail)) {
                    if (passid_validation(passid, 6, 18)) {
                        alert('Form Succesfully Submitted');
                        window.location = "login.html"
                        return true;
                    }
                }
            }
        }
    }
    else {
        return false;
    }

}

function passid_validation(passid,mx,my)
{
    var passid_len = passid.value.length;
    if (passid_len == 0 ||passid_len >= my || passid_len < mx)
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
        alert('Username must have alphabet characters only');
        uname.focus();
        return false;
    }
}

function allLetter(ufirstname)
{
    var letters = /^[A-Za-z]+$/;
    if(ufirstname.value.match(letters))
    {
        return true;
    }
    else
    {
        alert('First name must have alphabet characters only');
        uname.focus();
        return false;
    }
}

function allLetter(ulastname)
{
    var letters = /^[A-Za-z]+$/;
    if(ulastname.value.match(letters))
    {
        return true;
    }
    else
    {
        alert('Last name must have alphabet characters only');
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

