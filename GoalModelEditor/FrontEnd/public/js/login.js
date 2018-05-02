// function validate(){
//     var username = document.getElementById("username").value;
//     var password = document.getElementById("password").value;
//     if ( username == "Formget" && password == "formget#123"){
//         alert ("Login successfully");
//         window.location = "filesystem.html";
//         return false;
//     }
//     else {
//         if (username == null || username == "") {
//             alert("Please enter the username.");
//             return false;
//         }
//         if (password == null || password == "") {
//             alert("Please enter the password.");
//             return false;
//         }
//         else{
//             alert("Error Password or Username");/*displays error message*/
//             }
//     }
// }

// Login submit
// send the request to front-end server with {username, password}
// store the response (id) into cookies - Name: UID
$('#login').submit(function(evt){
    evt.preventDefault();
    var url = '/user/login';
    var formData = $(this).serialize();
    $.ajax(url, {
        data: formData,
        type: "POST",
        success: function(res){
            var tokenP = JSON.parse(JSON.stringify(res));
            Cookies.set('LOKIDIED', tokenP.token, { expires: 1, path: '/' });
            window.location.href = '/dashboard';
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});// end submit
