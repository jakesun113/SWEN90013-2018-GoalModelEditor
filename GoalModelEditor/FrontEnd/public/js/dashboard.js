/***
 * JavaScript For Dashboard functions and eventListeners
 * @author SICHENG LIU
 */

"use strict";

/**
 * Define all variables and constants used accross functions
 */

/* Constants */
const SECRET = JSON.parse(Cookies.get("LOKIDIED"));
const TOKEN = SECRET.token;
const UID = SECRET.uid;
const UNAME = Cookies.get("UIID");
const GET_PROJECT_URL = "/project/list/" + UID;
const POST_PROJECT_URL = "/project/" + UID;

/**
 * Page onReady EventListener
 * Load user's file after loading the page content
 */
$(document).ready(() => {
    retriveProjects();
});

/**
 * Create-project submit (click) EventListener
 *
 * @trigger {id:create-project|HTMLForm}
 */
$("#create-project").submit(evt => {
    evt.preventDefault();
    let formData = $("#create-project").serialize();
    createProject(formData);

    // Close the modal
    $("#add-project").modal("toggle");
});

/**
 * Create-model submit (click) EventListener
 *
 * @trigger {id:creat-model|HTMLForm}
 */
$("#create-model").submit(evt => {
    evt.preventDefault();
    const PID = getPID();
    if (typeof PID === "undefined") {
        warningMessageSlide("Please choose a project");
    }
    const CREATE_MODEL_URL = "/goal_model/" + UID + "/" + PID;
    let formData = $("#create-model").serialize();
    createGoalModel(CREATE_MODEL_URL, PID, formData);

    // Close the modal
    $("#add-model").modal("toggle");
});

/**
 * Rename-project submit (click) EventListener
 *
 * @trigger {id:rename_project|HTMLForm}
 */
$("#rename_project").submit(evt => {
    evt.preventDefault();
    const PID = getPID();
    if (typeof PID === "undefined") {
        warningMessageSlide("Please choose a project");
    }
    const RENAME_PROJECT_URL = "/project/" + UID + "/" + PID;
    let formData = JSON.parse($("#rename_project").serializeJSON());
    formData.description = "";
    formData.size = 0;
    renameProject(RENAME_PROJECT_URL, PID, formData);

    // Close the modal
    $("#rename-project").modal("toggle");
});

/**
 * Delete-preject submit (click) EventListener
 *
 * @trigger {id:delete_project|HTMLForm}
 */
$("#delete_project").submit(evt => {
    evt.preventDefault();
    const PID = getPID();
    if (typeof PID === "undefined") {
        warningMessageSlide("Please choose a project");
    }
    const DELETE_PROJECT_URL = "/project/" + UID + "/" + PID;
    let formData = $("#delete_project").serialize();
    deleteProject(DELETE_PROJECT_URL, PID, formData);

    // Close the modal
    $("#delete-project").modal("toggle");
});

/**
 * Handle all click events in {id:projects-container|HTMLElement}
 * 1.Handle click on the goal model item, redirect the user to the edit page, set a session cookie for goal model
 * 2.Handle click on the create goal model button, set a session cookie for project
 * 3.Handle click on the delete project button, set a session cookie for the project
 *
 * The EventListener is set to the parent node of all targets - to make sure all new HTMLElements added work
 *
 * @trigger {id:projects-container|HTMLElement}
 */
$("#projects-container").click(evt => {
    /* Handle click on the goal model, act on the clicked goal model only, set cookies for the clicked goal model */
    if ($(evt.target).hasClass("goal-model")) {
        setMID(evt.target.id);
        window.location.href = "/goal_model/edit";
    } else if ($(event.target.parentNode).hasClass("goal-model")) {
        setMID(evt.target.parentNode.id);
        window.location.href = "/goal_model/edit/";
    } else if (
        /* Handle click on the create goal model button & on the delete the project button */
        $(evt.target).hasClass("new-model") ||
        $(evt.target).hasClass("delete-project")
    ) {
        setPID($(evt.target.parentNode).parent()[0].id);
    } else if (
        $(evt.target.parentNode).hasClass("new-model") ||
        $(evt.target.parentNode).hasClass("delete-project")
    ) {
        setPID($(evt.target.parentNode.parentNode).parent()[0].id);
    } else if ($(evt.target).hasClass("rename-project")) {
        /* Handle click on the rename the project button */
        setPID($(event.target.parentNode).parent()[0].id);
        putNameInModal($("#" + getPID() + " h6").html());
    } else if ($(evt.target.parentNode).hasClass("rename-project")) {
        setPID($(evt.target.parentNode.parentNode).parent()[0].id);
        putNameInModal($("#" + getPID() + " h6").html());
    }
});

/**
 * Handle click EventListener on {id:signout|Button}
 *
 * @trigger {id:signout|Button}
 */
$("#signout").click(evt => {
    evt.preventDefault();
    signOut();
    window.location.href = "/";
});

/**
 * Function for parsing the project JSON
 *
 * @param {object/json} project
 * @return HTMLElement
 */
function parseProject(project) {
    // Single project container
    let projectHTML =
        '<div class="project text-center" id="' + project.project_id + '">';

    // Goal model list container
    projectHTML += '<div class="goal-list">';

    // Goal model list header
    projectHTML =
        projectHTML +
        '<div class="row goal-model-nav py-2">' +
        '<div class="col-6 text-center text-color">Name</div>' +
        '<div class="col-6 text-center text-color">Last modified</div> </div>';

    // Goal models if any
    if (project.models) {
        projectHTML = parseGoalModelList(project.models, projectHTML);
    }

    // Close the goal model list
    projectHTML = projectHTML + "</div>";

    // Project file icon
    projectHTML =
        projectHTML +
        '<img src="/img/buffer.svg" alt="project-icon" class="project-icon">';

    // Project name
    projectHTML = projectHTML + "<h6>" + project.project_name + "</h6>";

    // Project tools - add / rename / delete
    projectHTML = projectHTML + '<div class="text-center create-goal-model">';
    projectHTML =
        projectHTML +
        '<button class="btn btn-sm mb-2 new-model" ' +
        'type="button" data-toggle="modal" data-target="#add-model" ' +
        'style="background-color: transparent">' +
        '<img src="/img/add-outline.svg" title="Add new goal model"></button>';
    projectHTML =
        projectHTML +
        '<button class="btn btn-sm mb-2 rename-project" ' +
        'type="button" data-toggle="modal" data-target="#rename-project" ' +
        'style="background-color: transparent">' +
        '<img src="/img/compose.svg" title="Rename the project"></button>';
    projectHTML =
        projectHTML +
        '<button class="btn btn-sm mb-2 delete-project" ' +
        'type="button" data-toggle="modal" data-target="#delete-project" ' +
        'style="background-color: transparent">' +
        '<img src="/img/close-outline.svg" title="Delete the project"></button>';

    // Close Project tools
    projectHTML = projectHTML + "</div>";

    return projectHTML;
}

/**
 * Function for parsing JSON(model) to ModelHTML{HTMLElement}
 *
 * @param {object/json} model
 * @return {HTMLElement} modelHTML - after adding the model
 */
function parseGoalModel(model) {
    let modelHTML =
        '<div class="row goal-model py-1" id="' + model.model_id + '">';
    modelHTML =
        modelHTML +
        '<div class="col-6 text-center model_name">' +
        model.model_name +
        "</div>";
    modelHTML =
        modelHTML +
        '<div class="col-6 text-center text-color small model_time">' +
        model.last_modified +
        "</div> </div>";
    return modelHTML;
}

/**
 * Function for parsing JSON(models) to ProjectHTML{HTMLElement}
 *
 * @param {object/json} models
 * @param {HTMLElement} projectHTML
 * @return {HTMLElement} projectHTML - after adding all models
 */
function parseGoalModelList(models, projectHTML) {
    // Loop the models, render them in the goal model list container
    $.each(models, (index, model) => {
        if (model.model_id) {
            projectHTML += parseGoalModel(model);
        }
    });
    return projectHTML;
}

/**
 * Ajax function for retrieving all projects
 */
function retriveProjects() {
    // Start Retrieving all projects and the associated goal models for the current user
    $.ajax(GET_PROJECT_URL, {
        type: "GET",
        headers: { Authorization: "Bearer " + TOKEN },
        success: projects => {
            // Set the username
            setUserName(UNAME);

            /* Append the projects to current UI */
            for (let i in projects.projects) {
                let projectHTML = parseProject(projects.projects[i]);
                $("#projects-container").append(projectHTML);
            }
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(
            jqXHR.responseJSON.message + "<br>Please try again."
        );
    });
}

/**
 * Ajax function for creating a project
 *
 * @param {formData} project - formData with encapsulated projectName
 */
function createProject(project) {
    $.ajax(POST_PROJECT_URL, {
        data: project,
        type: "POST",
        headers: { Authorization: "Bearer " + TOKEN },
        success: newProject => {
            /* Append the project to current UI */
            let projectHTML = parseProject(newProject);
            $("#projects-container").append(projectHTML);

            successMessageSlide(
                "Project: " + newProject.project_name + " successfully created."
            );
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(
            jqXHR.responseJSON.message + "<br>Please try again."
        );
    });
}

/**
 * Ajax function for creating a goal model
 *
 * @param {url} url - to specify the user & project
 * @param {String} pid - projectID - to help find HTMLElement to append to
 * @param {formData} model - formData with encapsulated modelName
 */
function createGoalModel(url, pid, model) {
    $.ajax(url, {
        data: model,
        type: "POST",
        headers: { Authorization: "Bearer " + TOKEN },
        success: function(model) {
            /* Append the new model to the UI */
            let modelHTML = parseGoalModel(model);
            appendToProject(modelHTML, pid);

            successMessageSlide(
                "Model: " + model.model_name + " successfully created."
            );
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(
            jqXHR.responseJSON.message + "<br>Please try again."
        );
    }); // end ajax
}

/**
 * Ajax function for renaming a project
 *
 * @param {url} url - to specify the user & project
 * @param {String} pid - projectID - to help notifications and the corresponding change in HTML
 * @param {formData} project - formData with encapsulated new projectName
 */
function renameProject(url, pid, project) {
    $.ajax(url, {
        data: JSON.stringify(project),
        type: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + TOKEN
        },
        success: () => {
            successMessageSlide(
                "Project:" +
                    $("#" + pid + " h6")
                        .eq(0)
                        .html() +
                    " successfully renamed to " +
                    project.project_name +
                    "."
            );

            // Make the new project name shown in UI
            $("#" + pid + " h6")
                .eq(0)
                .html(project.project_name);
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(
            jqXHR.responseJSON.message + "<br>Please try again."
        );
    });
}

/**
 * Ajax function for deleting a project
 *
 * @param {url} url - to specify the user & project
 * @param {String} pid - projectID - to help delete the project in HTML
 * @param {formData} project - formData with encapsulated project to be deleted
 */
function deleteProject(url, pid, project) {
    $.ajax(url, {
        data: project,
        type: "DELETE",
        headers: { Authorization: "Bearer " + TOKEN },
        success: () => {
            successMessageSlide(
                "Project: " +
                    $("#" + pid + " h6")
                        .eq(0)
                        .html() +
                    " successfully deleted."
            );

            // Hide the corresponding HTML
            $("#" + pid).hide();
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(
            jqXHR.responseJSON.message + "<br>Please try again."
        );
    });
}

/**
 * Function for setting the PID - in Cookies
 *
 * @param {String} pid - the project id to be saved in Cookies
 */
function setPID(pid) {
    Cookies.set("PID", pid);
}

/**
 * Function for setting the MID - in Cookies
 *
 * @param {String} mid - the model id to be saved in Cookies
 */
function setMID(mid) {
    Cookies.set("MID", mid);
}

/**
 * Function for getting the PID - in Cookies
 * @return {String} project id
 */
function getPID() {
    return Cookies.get("PID");
}

/**
 * Function for getting the MID - in Cookies
 * @return {String} model id
 */
function getMID() {
    return Cookies.get("MID");
}

/**
 * Function for setting the userName
 *
 * @param {String} username
 */
function setUserName(username) {
    $("#username")
        .eq(0)
        .html(username);
}

/**
 * Helper Function for renaming the project - put the clicked project name in the modal
 *
 * @param {String} projectName - the clicked project name
 */
function putNameInModal(projectName) {
    // Set the modal input to the clicked project name
    $("#rename_project .modal-body input").val(projectName);

    /* Set time out so that the project name gets rendered in the modal */
    let $target = $("#rename-project");
    $target.data("triggered", true);
    setTimeout(function() {
        if ($target.data("triggered")) {
            $target.modal("show").data("triggered", false);
        }
    }, 300);
    return false;
}

/**
 * Helper Function for signing off
 * Remove all Cookies
 */
function signOut() {
    Cookies.remove("LOKIDIED");
    Cookies.remove("UIID");
    Cookies.remove("MID");
    Cookies.remove("PID");
}

/**
 * Function for appending modelHTMl to a specific project
 *
 * @param {HTMLElement} modelHTML
 * @param {String} pid - id of the project appended to
 */
function appendToProject(modelHTML, pid) {
    $("#" + pid + " .goal-list")
        .eq(0)
        .append(modelHTML);
}

/**
 * Function for success notifications to show with given message
 *
 * @param {String} message
 */
function successMessageSlide(message) {
    $("#success-alert").html(message);
    $("#success-alert")
        .slideDown()
        .delay(3000)
        .slideUp();
}

/**
 * Function for warning notifications to show with given message
 *
 * @param {String} message
 */
function warningMessageSlide(message) {
    $("#warning-alert").html(message);
    $("#warning-alert")
        .slideDown()
        .delay(3000)
        .slideUp();
}
