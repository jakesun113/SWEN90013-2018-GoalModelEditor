// load user's file after loading the page content - handled by the front-end server
// GET ('/project/fetch_file_system?userid=')
$(document).ready(function () {
    var url = '/project/fetch_file_system?userid='+ Cookies.get('LOKIDIED');
    $.ajax(url, {
        type: "GET",
        success: function(files) {
            $('#username').val(Cookies.get('UIID'));
            var filelistHTML = '';
            $.each(files, function (index, file) {
                filelistHTML += '<div class="row border-bottom py-3 file-item" id="'
                    + file.id + '">';
                filelistHTML = filelistHTML + '<div class="col-3 text-center">'
                    + file.fileName + '</div>';
                filelistHTML = filelistHTML + '<div class="col-3 text-center text-color">'
                    + file.owner + '</div>';
                filelistHTML = filelistHTML + '<div class="col-3 text-center text-color">'
                    + file.lastModified + '</div>';
                filelistHTML = filelistHTML + '<div class="col-3 text-center text-color">'
                    + file.fileSize + '</div>';
                filelistHTML += '</div>';
            }); // end each
            filelistHTML += '</div>';
            $('#fileList').html(filelistHTML);
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText + ". Please contact us.");
    }); // end ajax
}); // end ready

// reload user's file list after the user has created a new file
// i.e. handle the "CREATE" button
// POST ('/project/create')
$('#create-project').submit(function(evt){
   evt.preventDefault();
   var secret = JSON.parse((Cookies.get('LOKIDIED')));
   var token = secret.token;
   var id = secret.uid;
   var url = '/project/create/'+ id;
   var formData = $(this).serialize();
    $.ajax(url, {
        data: formData,
        type: "POST",
        headers: {"Authorization": "Bearer " + token},
        success: function(file){

        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});// end submit

// TODO: not working, need upgrade on the route
// handle double click on the file item
// send get request
// GET ('/user/:userid/myfile/:fileid')
$('#fileList').dblclick(function(event){
    // act on the clicked file-time only
    // front-end server create the cookie and redirect to the edit page
    if($(event.target).hasClass("file-item")) {
        var url = '/user/' + Cookies.get('AUTH') + '/myfile/' + $(event.target).id;
        $.ajax(url, {
            type: "GET",
            success: function (file) {
            }// no need to handle success callback - user will be routed to another page
        }).fail(function(jqXHR){
            alert(jqXHR.statusText);
        });// end ajax
    } else if($(event.target.parentNode).hasClass("file-item")){
        var url = '/user/' + Cookies.get('AUTH') + '/myfile/' + $(event.target.parentNode).id;
        $.ajax(url, {
            type: "GET",
            success: function (file) {
            }// no need to handle success callback - user will be routed to another page
        }).fail(function(jqXHR){
            alert(jqXHR.statusText);
        });// end ajax
    }
});


$(window).click(function (event) {

});


