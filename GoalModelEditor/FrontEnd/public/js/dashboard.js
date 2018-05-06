// <div class="project text-center">
//     <div class="goal-list">
//     <!-- title of goal list -->
// <div class="row goal-model my-2">
//     <div class="col-6 text-center text-color">Version</div>
//     <div class="col-6 text-center text-color">Last modified</div>
// </div>
// <div class="row goal-model my-2" id="abcdefg">
//     <div class="col-6 text-center">V1</div>
//     <div class="col-6 text-center text-color">May 8, 2017</div>
// </div>
// <div class="row goal-model my-2" id="abcdefg">
//     <div class="col-6 text-center">V1</div>
//     <div class="col-6 text-center text-color">May 8, 2017</div>
// </div>
// <div class="row goal-model my-2" id="abcdefg">
//     <div class="col-6 text-center">V1</div>
//     <div class="col-6 text-center text-color">May 8, 2017</div>
// </div>
// <div class="row goal-model my-2" id="abcdefg">
//     <div class="col-6 text-center">V1</div>
//     <div class="col-6 text-center text-color">May 8, 2017</div>
// </div>
// </div>
// <img src="/img/folder.svg" alt="project-icon" class="project-icon">
//     <p class="pt-2">Project</p>
//     <div class="text-center create-goal-model">
//     <button class="btn btn-primary btn-sm mt-1"
// type="button" class="btn btn-primary mb-3 ml-5"
// data-toggle="modal" data-target="#add-model">
//     Add New Goal Model
// </button>
// </div>

// load user's file after loading the page content - handled by the front-end server
// GET ('/project/fetch_file_system')
$(document).ready(function () {

    var url = '/project/list/:userid';
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
        success: function(project){
            var projectHTML = '';
            projectHTML += '<div class="project text-center" id="' + project.project_id + '">';
            projectHTML = projectHTML + '<div class="goal-list">';
            // goal-list
            projectHTML = projectHTML + '<div class="row goal-model my-2">' +
                '<div class="col-6 text-center text-color">Version</div>' +
                '<div class="col-6 text-center text-color">Last modified</div>' +
                '</div>';
            projectHTML = projectHTML + '</div>';
            projectHTML = projectHTML + '<img src="/img/folder.svg" alt="project-icon" class="project-icon">';
            projectHTML = projectHTML + '<p class="pt-2">' + project.project_name + '</p>';
            projectHTML = projectHTML + '<div class="text-center create-goal-model">';
            projectHTML = projectHTML + '<button class="btn btn-primary btn-sm mb-2" ' +
                'type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-model">' +
                'Add New Goal Model</button>';
            projectHTML = projectHTML + '</div>';
            $('#projects-container').append(projectHTML);
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


