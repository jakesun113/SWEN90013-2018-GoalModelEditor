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
            $('#username').eq(0).html(Cookies.get('UIID'));
            // start each
            $.each(projects.list, function (index, project) {
                var projectHTML = '';
                projectHTML += '<div class="project text-center" id="' + project.project_id + '">';
                projectHTML = projectHTML + '<div class="goal-list">';
                // goal-list
                projectHTML = projectHTML + '<div class="row goal-model-nav py-2">' +
                    '<div class="col-6 text-center text-color">Name</div>' +
                    '<div class="col-6 text-center text-color">Last modified</div>' +
                    '</div>';

                // goal-list
                // start each
                $.each(project.models, function (index, model) {
                    if(model.model_id) {
                        projectHTML = projectHTML + '<div class="row goal-model py-1" id="' + model.model_id + '">';
                        projectHTML = projectHTML + '<div class="col-6 text-center">' + model.model_name + '</div>';
                        projectHTML = projectHTML + '<div class="col-6 text-center text-color">' + model.last_modified +
                            '</div> </div>';
                    }
                });// end each
                projectHTML = projectHTML + '</div>';
                projectHTML = projectHTML + '<img src="/img/folder.svg" alt="project-icon" class="project-icon">';
                projectHTML = projectHTML + '<h6>' + project.project_name + '</h6>';
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
// create both project and first goal model
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
            projectHTML = projectHTML + '<div class="row goal-model-nav py-2">' +
                '<div class="col-6 text-center text-color">Name</div>' +
                '<div class="col-6 text-center text-color">Last modified</div>' +
                '</div>';

            projectHTML = projectHTML + '</div>';
            projectHTML = projectHTML + '<img src="/img/folder.svg" alt="project-icon" class="project-icon">';
            projectHTML = projectHTML + '<h6>' + project.project_name + '</h6>';
            projectHTML = projectHTML + '<div class="text-center create-goal-model">';
            projectHTML = projectHTML + '<button class="btn btn-primary btn-sm mb-2" ' +
                'type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-model">' +
                'Add New Goal Model</button>';
            projectHTML = projectHTML + '</div>';
            $('#projects-container').append(projectHTML);
            $('#add-project').modal('toggle');
            // send create goal model request
            var create_model_url = '/goal_model/create/' + id + '-' + project.project_id;
            // start ajax
            $.ajax(create_model_url, {
                data: formData,
                type: "POST",
                headers: {"Authorization": "Bearer " + token},
                success: function (model) {
                    var pselector = '#' + project.project_id + ' .goal_list';
                    var modelHTML = '';
                    modelHTML = modelHTML + '<div class="row goal-model py-1" id="' + model.model_id + '">';
                    modelHTML = modelHTML + '<div class="col-6 text-center">' + model.model_name + '</div>';
                    modelHTML = modelHTML + '<div class="col-6 text-center text-color">' + model.last_modified +
                        '</div> </div>';
                    $(pselector).eq(0).append(modelHTML);
                }
            }).fail(function(jqXHR){
                alert(jqXHR.statusText);
            });// end ajax
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});// end submit


// create goal model for a project
// POST '/goal_model/create/:userid-:projectid'
$('#create-model').submit(function(evt) {
    evt.preventDefault();
    var secret = JSON.parse((Cookies.get('LOKIDIED')));
    var token = secret.token;
    var uid = secret.uid;
    var pid = Cookies.get('PID');
    if(typeof pid === "undefined") {
        alert("Please choose a project");
    }
    var url = '/goal_model/create/'+ uid + '-' + pid;
    var formData = $(this).serialize();
    // start ajax
    $.ajax(url, {
        data: formData,
        type: "POST",
        headers: {"Authorization": "Bearer " + token},
        success: function(model){
            var pselector = '#' + pid + ' .goal_list';
            var modelHTML = '';
            modelHTML = modelHTML + '<div class="row goal-model py-1" id="' + model.model_id + '">';
            modelHTML = modelHTML + '<div class="col-6 text-center">' + model.model_name + '</div>';
            modelHTML = modelHTML + '<div class="col-6 text-center text-color">' + model.last_modified +
                '</div> </div>';
            $(pselector).eq(0).append(modelHTML);
            $('#add-model').modal('toggle');
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});


// handle click on the goal model item
// redirect the user to the edit page
// set a session cookie for goal model
$('#projects-container').click(function(event){
    // act on the clicked goal model only
    // front-end server create the cookie and redirect to the edit page
    if($(event.target).hasClass("goal-model")) {
        console.log(event.target.id);
        Cookies.set('MID', event.target.id);
        window.location.href = '/edit';
    } else if($(event.target.parentNode).hasClass("goal-model")){
        console.log(event.target.parentNode.id);
        Cookies.set('MID', event.target.parentNode.id);
        window.location.href = '/edit';
    }
});


// /* Testing block */
// var projects =
//     {
//         "projects": {
//             "PROJECT_ID_1": {
//                 "project_name": "PROJECT_NAME",
//                 "project_id": "PROJECT_ID_1",
//                 "models": [{
//                     "model_name": "MODEL_NAME",
//                     "model_id": "MODEL_ID",
//                     "last_modified": "LAST_MODIFIED"
//                 },
//                     {
//                         "model_name": "MODEL_NAME",
//                         "model_id": "MODEL_ID",
//                         "last_modified": "LAST_MODIFIED"
//                     }
//                 ]
//             },
//             "PROJECT_ID_2": {
//                 "project_name": "PROJECT_NAME",
//                 "project_id": "PROJECT_ID_2",
//                 "models": [{}]
//             }
//         }
//     }
//
// for(var project in projects.projects){
//     var projectHTML = '';
//     projectHTML += '<div class="project text-center" id="' + projects.projects[project].project_id + '">';
//     projectHTML = projectHTML + '<div class="goal-list">';
//     // goal-list
//     projectHTML = projectHTML + '<div class="row goal-model my-2">' +
//         '<div class="col-6 text-center text-color">Version</div>' +
//         '<div class="col-6 text-center text-color">Last modified</div>' +
//         '</div>';
//
//     // goal-list
//     $.each(projects.projects[project].models, function (index, model) {
//         if(model.model_id) {
//             projectHTML = projectHTML + '<div class="row goal-model my-2" id="' + model.model_id + '">';
//             projectHTML = projectHTML + '<div class="col-6 text-center">' + model.model_name + '</div>';
//             projectHTML = projectHTML + '<div class="col-6 text-center text-color">' + model.last_modified +
//                 '</div> </div>';
//         }
//     });
//     projectHTML = projectHTML + '</div>';
//     projectHTML = projectHTML + '<img src="/img/folder.svg" alt="project-icon" class="project-icon">';
//     projectHTML = projectHTML + '<h6 class="pt-2">' + projects.projects[project].project_name + '</h6>';
//     projectHTML = projectHTML + '<div class="text-center create-goal-model">';
//     projectHTML = projectHTML + '<button class="btn btn-primary btn-sm mb-2" ' +
//         'type="button" class="btn btn-primary" data-toggle="modal" data-target="#add-model">' +
//         'Add New Goal Model</button>';
//     projectHTML = projectHTML + '</div>';
//     $('#projects-container').append(projectHTML);
// };

