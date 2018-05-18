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
            for(var i in projects.projects) {
                const project = projects.projects[i];
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
                        projectHTML = projectHTML + '<div class="col-6 text-center text-color small">' + model.last_modified +
                            '</div> </div>';
                    }
                });// end each
                projectHTML = projectHTML + '</div>';
                projectHTML = projectHTML + '<img src="/img/buffer.svg" alt="project-icon" class="project-icon">';
                projectHTML = projectHTML + '<h6>' + project.project_name + '</h6>';
                projectHTML = projectHTML + '<div class="text-center create-goal-model">';
                projectHTML = projectHTML + '<button class="btn btn-sm mb-2 new-model" ' +
                    'type="button" data-toggle="modal" data-target="#add-model" ' +
                    'style="background-color: transparent">' +
                    '<img src="/img/add-outline.svg" title="Add new goal model"></button>';
                projectHTML = projectHTML + '<button class="btn btn-sm mb-2 rename-project" ' +
                    'type="button" data-toggle="modal" data-target="#rename-project" ' +
                    'style="background-color: transparent">' +
                    '<img src="/img/compose.svg" title="Rename the project"></button>';
                projectHTML = projectHTML + '<button class="btn btn-sm mb-2 delete-project" ' +
                    'type="button" data-toggle="modal" data-target="#delete-project" ' +
                    'style="background-color: transparent">' +
                    '<img src="/img/close-outline.svg" title="Delete the project"></button>';
                projectHTML = projectHTML + '</div>';
                $('#projects-container').append(projectHTML);
            };// end each
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
            projectHTML = projectHTML + '<button class="btn btn-sm mb-2 new-model" ' +
                'type="button" data-toggle="modal" data-target="#add-model" ' +
                'style="background-color: transparent">' +
                '<img src="/img/add-outline.svg" title="Add new goal model"></button>';
            projectHTML = projectHTML + '<button class="btn btn-sm mb-2 rename-project" ' +
                'type="button" data-toggle="modal" data-target="#rename-project" ' +
                'style="background-color: transparent">' +
                '<img src="/img/compose.svg" title="Rename the project"></button>';
            projectHTML = projectHTML + '<button class="btn btn-sm mb-2 delete-project" ' +
                'type="button" data-toggle="modal" data-target="#delete-project" ' +
                'style="background-color: transparent">' +
                '<img src="/img/close-outline.svg" title="Delete the project"></button>';
            projectHTML = projectHTML + '</div>';
            $('#projects-container').append(projectHTML);
            $('#add-project').modal('toggle');
            // send create goal model request
            var create_model_url = '/goal_model/create/' + id + '/' + project.project_id;
            // start ajax
            $.ajax(create_model_url, {
                data: formData,
                type: "POST",
                headers: {"Authorization": "Bearer " + token},
                success: function (model) {
                    var modelHTML = '';
                    modelHTML = modelHTML + '<div class="row goal-model py-1" id="' + model.model_id + '">';
                    modelHTML = modelHTML + '<div class="col-6 text-center">' + model.model_name + '</div>';
                    modelHTML = modelHTML + '<div class="col-6 text-center text-color small">' + model.last_modified +
                        '</div> </div>';
                    $('#'+ project.project_id+ ' .goal-list').eq(0).append(modelHTML);
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
// POST '/goal_model/create/:userid/:projectid'
$('#create-model').submit(function(evt) {
    evt.preventDefault();
    var secret = JSON.parse((Cookies.get('LOKIDIED')));
    var token = secret.token;
    var uid = secret.uid;
    var pid = Cookies.get('PID');
    if(typeof pid === "undefined") {
        alert("Please choose a project");
    }
    var url = '/goal_model/create/'+ uid + '/' + pid;
    var formData = $(this).serialize();
    // start ajax
    $.ajax(url, {
        data: formData,
        type: "POST",
        headers: {"Authorization": "Bearer " + token},
        success: function(model){
            var modelHTML = '';
            modelHTML = modelHTML + '<div class="row goal-model py-1" id="' + model.model_id + '">';
            modelHTML = modelHTML + '<div class="col-6 text-center model_name">' + model.model_name + '</div>';
            modelHTML = modelHTML + '<div class="col-6 text-center text-color small model_time">' +
                model.last_modified + '</div> </div>';
            $('#'+pid+ ' .goal-list').eq(0).append(modelHTML);
            $('#add-model').modal('toggle');
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});

/* handle click events */
// handle click on the goal model item, redirect the user to the edit page, set a session cookie for goal model
// handle click on the create goal model button, set a session cookie for project
// handle click on the delete project button, set a session cookie for the project
$('#projects-container').click(function(event){
    // act on the clicked goal model only
    // front-end server create the cookie and redirect to the edit page
    // handle click on the goal model
    if($(event.target).hasClass("goal-model")) {
        console.log(event.target.id);
        Cookies.set('MID', event.target.id);
        window.location.href = '/edit';
    }
    // handle click on the goal model
    else if($(event.target.parentNode).hasClass("goal-model")) {
        console.log(event.target.parentNode.id);
        Cookies.set('MID', event.target.parentNode.id);
        window.location.href = '/edit';
    }
    // handle click on the create goal model button & delete the project button
    else if($(event.target).hasClass("new-model") || $(event.target).hasClass("delete-project")) {
        Cookies.set('PID', $(event.target.parentNode).parent()[0].id);
    }
    else if($(event.target.parentNode).hasClass("new-model") || $(event.target.parentNode).hasClass("delete-project")) {
        Cookies.set('PID', $(event.target.parentNode.parentNode).parent()[0].id);
    }
    // handle click on the rename the project button
    else if($(event.target).hasClass("rename-project")) {
        Cookies.set('PID', $(event.target.parentNode).parent()[0].id);
        $('#rename_project .modal-body input').val($('#' + Cookies.get('PID') + ' h6').html());
    }
    else if($(event.target.parentNode).hasClass("rename-project")) {
        Cookies.set('PID', $(event.target.parentNode.parentNode).parent()[0].id);
        $('#rename_project .modal-body input').val($('#' + Cookies.get('PID') + ' h6').html());
        var $target = $('#rename-project');
        $target.data('triggered',true);
        setTimeout(function() {
            if ($target.data('triggered')) {
                $target.modal('show').data('triggered',false);
            };
        }, 300); // milliseconds
        return false;

    }
});

// handle sign off button
$('#signout').click(function (evt) {
    evt.preventDefault();
    Cookies.remove('LOKIDIED');
    Cookies.remove('UIID');
    Cookies.remove('MID');
    Cookies.remove('PID');
    window.location.href = '/';
});

// rename project
// PUT ('/project/edit/:userid/:projectid')
$('#rename_project').submit(function(evt){
   evt.preventDefault();
   var secret = JSON.parse((Cookies.get('LOKIDIED')));
   var token = secret.token;
   var uid = secret.uid;
   var pid = Cookies.get('PID');
   if(typeof pid === "undefined") {
       alert("Please choose a project");
   }
   var url = '/project/edit/' + uid + '/' + pid;
   var formData = $(this).serialize();
   // start ajax
    $.ajax(url, {
        data: formData,
        type: "PUT",
        headers: {"Authorization": "Bearer " + token},
        success: function(project){
            $('#' + pid + ' h4').eq(0).innerHTML(project.project_name);
            $('#rename-project').modal('toggle');
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});


// rename goal model
// PUT ('/goal_model/edit/:userid/:projectid/:goalmodelid')
// $('#rename_goalmodel').submit(function(evt){
//     evt.preventDefault();
//     var secret = JSON.parse((Cookies.get('LOKIDIED')));
//     var token = secret.token;
//     var uid = secret.uid;
//     var pid = Cookies.get('PID');
//     var mid = Cookies.get('MID');
//     if(typeof pid === "undefined") {
//         alert("Please choose a project");
//     }
//     if(typeof mid === "undefined") {
//         alert("Please choose a goal model");
//     }
//     var url = '/goal_model/edit/' + uid + '/' + pid + '/' + mid;
//     var formData = $(this).serialize();
//     // start ajax
//     $.ajax(url, {
//         data: formData,
//         type: "PUT",
//         headers: {"Authorization": "Bearer " + token},
//         success: function(res){
//             $('#' + mid + '.model_name').eq(0).innerHTML(res.model_name);
//             $('#' + mid + '.model_time').eq(0).innerHTML(res.last_modified);
//             $('#rename-goalmodel').modal('toggle');
//         }
//     }).fail(function(jqXHR){
//         alert(jqXHR.statusText);
//     });// end ajax
// });

// delete project
// DELETE '/project/:userid/:projectid'
$('#delete_project').submit(function(evt){
    evt.preventDefault();
    var secret = JSON.parse((Cookies.get('LOKIDIED')));
    var token = secret.token;
    var uid = secret.uid;
    var pid = Cookies.get('PID');
    if(typeof pid === "undefined") {
        alert("Please choose a project");
    }
    var url = '/project/' + uid + '/' + pid;
    var formData = $(this).serialize();
    // start ajax
    $.ajax(url, {
        data: formData,
        type: "DELETE",
        headers: {"Authorization": "Bearer " + token},
        success: function(res){
            $('#' + pid).hide();
            $('#delete-project').modal('toggle');
        }
    }).fail(function(jqXHR){
        alert(jqXHR.statusText);
    });// end ajax
});
