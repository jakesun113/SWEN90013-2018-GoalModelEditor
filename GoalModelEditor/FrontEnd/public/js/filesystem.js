// load user's file after loading the page content - handled by the front-end server
// GET ('/project/fetch_file_system?userid=')
$(document).ready(function () {
    var url = '/project/fetch_file_system?userid='+ Cookies.get('UID');
    $.ajax(url, {
        type: "GET",
        success: function(files) {
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
$('#createFile').submit(function(evt){
   evt.preventDefault();
   var url = '/project/create';
   var formData = $(this).serialize();
    $.ajax(url, {
        data: formData,
        type: "POST",
        success: function(file){
            console.log(file);
            var fileItem = JSON.parse(file);
            console.log(fileItem);
            var filelistHTML = '<div class="row border-bottom py-3 file-item" id="'
                + fileItem.id + '">' + '<div class="col-3 text-center">'
                + fileItem.project_name + '</div>' + '<div class="col-3 text-center text-color">'
                + fileItem.owner + '</div>' + '<div class="col-3 text-center text-color">'
                + fileItem.lastModified + '</div>' + '<div class="col-3 text-center text-color">'
                + fileItem.fileSize + '</div>' + '</div>';
            $('#fileList').append(filelistHTML);
            $('#addFile').modal('toggle');
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


// handle click on the window
// only when the clicked item is a file item, the background color will change
$(window).click(function(event) {
    // change all files background color back
    const files = $('.file-item');
    $.each(files, function(index, file){
        file.style.backgroundColor = "white";
    });// end each

    // change the background-color if the click item is a file-item
    if($(event.target).hasClass("file-item")) {
        event.target.style.backgroundColor = "#4285f4";
    } else if($(event.target.parentNode).hasClass("file-item")){
        event.target.parentNode.style.backgroundColor = "#4285f4";
    }
});


