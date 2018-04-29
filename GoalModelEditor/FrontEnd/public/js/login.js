function validate(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    if ( username == "Formget" && password == "formget#123"){
        alert ("Login successfully");
        window.location = "filesystem.html";
        return false;
    }
    else {
        if (username == null || username == "") {
            alert("Please enter the username.");
            return false;
        }
        if (password == null || password == "") {
            alert("Please enter the password.");
            return false;
        }
        else{
            alert("Error Password or Username")/*displays error message*/

            }
    }
}