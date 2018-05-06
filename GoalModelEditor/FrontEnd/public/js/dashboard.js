// load user's file after loading the page content - handled by the front-end server
// GET ('/project/list/:userid')
$(document).ready(function () {
    var secret = JSON.parse((Cookies.get('LOKIDIED')));
    var token = secret.token;
    var id = secret.uid;
    var url = '/project/list/' + id;
    $.ajax(url, {
        type: "GET",
        headers: {"Authorization": "Bearer " + token},
        success: function(projects) {
            $('#username').val(Cookies.get('UIID'));
            // start each
            $.each(projects.list, function (index, project) {
                var projectHTML = '';
                projectHTML += '<div class="project text-center" id="' + project.project_id + '">';
                projectHTML = projectHTML + '<div class="goal-list">';
                // goal-list
                projectHTML = projectHTML + '<div class="row goal-model my-2">' +
                    '<div class="col-6 text-center text-color">Version</div>' +
                    '<div class="col-6 text-center text-color">Last modified</div>' +
                    '</div>';

                // goal-list
                // start each
                $.each(project.models, function (index, model) {
                    if(model.model_id) {
                        projectHTML = projectHTML + '<div class="row goal-model my-2" id="' + model.model_id + '">';
                        projectHTML = projectHTML + '<div class="col-6 text-center">' + model.model_name + '</div>';
                        projectHTML = projectHTML + '<div class="col-6 text-center text-color">' + model.last_modified +
                            '</div> </div>';
                    }
                });// end each
                projectHTML = projectHTML + '</div>';
                projectHTML = projectHTML + '<img src="/img/folder.svg" alt="project-icon" class="project-icon">';
                projectHTML = projectHTML + '<h6 class="pt-2">' + project.project_name + '</h6>';
                projectHTML = projectHTML + '<div class="text-center create-goal-model">';
                projectHTML = projectHTML + '<button class="btn btn-primary btn-sm mb-2" ' +
                    'type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-model">' +
                    'Add New Goal Model</button>';
                projectHTML = projectHTML + '</div>';
                $('#projects-container').append(projectHTML);
            });// end each
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText + ". Please contact us.");
    }); // end ajax
}); // end ready

// reload user's file list after the user has created a new file
// i.e. handle the "CREATE" button
// POST ('/project/create/:userid')
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
            projectHTML = projectHTML + '<h6 class="pt-2">' + project.project_name + '</h6>';
            projectHTML = projectHTML + '<div class="text-center create-goal-model">';
            projectHTML = projectHTML + '<button class="btn btn-primary btn-sm mb-2" ' +
                'type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-model">' +
                'Add New Goal Model</button>';
            projectHTML = projectHTML + '</div>';
            $('#projects-container').append(projectHTML);
            $('#add-project').modal('toggle');
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

/* Testing block */
var projects =
    {
        "projects": {
            "PROJECT_ID_1": {
                "project_name": "PROJECT_NAME",
                "project_id": "PROJECT_ID_1",
                "models": [{
                    "model_name": "MODEL_NAME",
                    "model_id": "MODEL_ID",
                    "last_modified": "LAST_MODIFIED"
                },
                    {
                        "model_name": "MODEL_NAME",
                        "model_id": "MODEL_ID",
                        "last_modified": "LAST_MODIFIED"
                    }
                ]
            },
            "PROJECT_ID_2": {
                "project_name": "PROJECT_NAME",
                "project_id": "PROJECT_ID_2",
                "models": [{}]
            }
        }
    }

for(var project in projects.projects){
    var projectHTML = '';
    projectHTML += '<div class="project text-center" id="' + projects.projects[project].project_id + '">';
    projectHTML = projectHTML + '<div class="goal-list">';
    // goal-list
    projectHTML = projectHTML + '<div class="row goal-model my-2">' +
        '<div class="col-6 text-center text-color">Version</div>' +
        '<div class="col-6 text-center text-color">Last modified</div>' +
        '</div>';

    // goal-list
    $.each(projects.projects[project].models, function (index, model) {
        if(model.model_id) {
            projectHTML = projectHTML + '<div class="row goal-model my-2" id="' + model.model_id + '">';
            projectHTML = projectHTML + '<div class="col-6 text-center">' + model.model_name + '</div>';
            projectHTML = projectHTML + '<div class="col-6 text-center text-color">' + model.last_modified +
                '</div> </div>';
        }
    });
    projectHTML = projectHTML + '</div>';
    projectHTML = projectHTML + '<img src="/img/folder.svg" alt="project-icon" class="project-icon">';
    projectHTML = projectHTML + '<h6 class="pt-2">' + projects.projects[project].project_name + '</h6>';
    projectHTML = projectHTML + '<div class="text-center create-goal-model">';
    projectHTML = projectHTML + '<button class="btn btn-primary btn-sm mb-2" ' +
        'type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-model">' +
        'Add New Goal Model</button>';
    projectHTML = projectHTML + '</div>';
    $('#projects-container').append(projectHTML);
};
