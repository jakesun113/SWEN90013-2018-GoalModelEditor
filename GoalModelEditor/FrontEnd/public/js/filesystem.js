// load user's file after loading the page content - handled by the frontend server GET ('/user/myfile/files')
$(document).ready(function () {
    $.ajax('/user/myfile/files', {
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
$('#createFile').submit(function(evt){
   evt.preventDefault();
   var url = $(this).attr("action");
   var formData = $(this).serialize();
    $.ajax(url, {
        data: formData,
        type: "POST",
        success: function(file){
            console.log(file);
            var filelistHTML = '<div class="row border-bottom py-3 file-item" id="'
                + file[0].id + '">' + '<div class="col-3 text-center">'
                + file[0].fileName + '</div>' + '<div class="col-3 text-center text-color">'
                + file[0].owner + '</div>' + '<div class="col-3 text-center text-color">'
                + file[0].lastModified + '</div>' + '<div class="col-3 text-center text-color">'
                + file[0].fileSize + '</div>' + '</div>';
            $('#fileList').append(filelistHTML);
            $('#addFile').modal('toggle');
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});// end submit

// handle click on the file item
// handle double click on the file item
$('#fileList').dblclick(function(event){
    alert( "Handler for .dblclick() called." + event.target);
});

$('#fileList').click( function(event) {
    // change all files background color back
    const files = $('.file-item');
    $.each(files, function(index, file){
        file.style.backgroundColor = "white";
    });// end each
    var fileItem = event.target.parentNode;
    if(fileItem.id === "fileList") {
        event.target.style.backgroundColor = "#4285f4";
    } else {
        fileItem.style.backgroundColor = "#4285f4";
    }
});

