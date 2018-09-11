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
    if (typeof PID === undefined) {
        warningMessageSlide("Please choose a project");
        return;
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
    if (typeof PID === undefined) {
        warningMessageSlide("Please choose a project");
        return;
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
    if (typeof PID === undefined) {
        warningMessageSlide("Please choose a project");
        return;
    }
    const DELETE_PROJECT_URL = "/project/" + UID + "/" + PID;
    let formData = $("#delete_project").serialize();
    deleteProject(DELETE_PROJECT_URL, PID, formData);

    // Close the modal
    $("#delete-project").modal("toggle");
});

/**
 * Rename-model submit (click) EventListener
 *
 * @trigger {id:rename_model|HEMLForm}
 */
$("#rename_model").submit(evt => {
    evt.preventDefault();
    const MID = getMID();
    if (typeof MID === undefined) {
        warningMessageSlide("Please choose a model");
        return;
    }
    const RENAME_MODEL_URL = "/goal_model/info/" + UID + "/" + MID;
    let formData = $("#rename_model").serialize();
    renameModel(RENAME_MODEL_URL, MID, formData);

    // Close the modal
    $("#rename-model").modal("toggle");
});

/**
 * Delete-model submit (click) EventListener
 *
 * @trigger {id:delete_model|HTMLForm}
 */
$("#delete_model").submit(evt => {
    evt.preventDefault();
    const MID = getMID();
    if (typeof MID === undefined) {
        warningMessageSlide("Please choose a model");
        return;
    }
    const RENAME_MODEL_URL = "/goal_model/" + UID + "/" + MID;
    let formData = $("#delete_model").serialize();
    deleteModel(RENAME_MODEL_URL, MID, formData);

    // Close the modal
    $("#delete-model").modal("toggle");
});


/**
 * Add click EventListener for 'projects' nav
 *
 * @trigger {id:v-pills-projects-tab|HTML:a}
 */
$("#v-pills-projects-tab").click(evt => {
    $("#new-project-button").show();
    $("#new-template-button").hide();
    $("#v-pills-templates").hide();
    $("#v-pills-projects").show();
});

/**
 * Add click EventListener for 'templates' nav
 *
 * @trigger {id:v-pills-templates-tab|HTML:a}
 */
$("#v-pills-templates-tab").click(evt => {
    $("#new-project-button").hide();
    $("#new-template-button").show();
    $("#v-pills-templates").show();
    $("#v-pills-projects").hide();
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
        '<div class="project" id="' + project.project_id + '">';

    // Project-header
    projectHTML += '<div class="project_header">';

    // Collapse button
    projectHTML =
        projectHTML +
        '<div class="row border-bottom py-3">' +
        '<div class="col-1">' +
        '<button class="btn btn-sm collapse-btn fas fa-plus-square" type="button">' +
        '</button>' +
        '</div>';

    // Project name
    projectHTML =
        projectHTML +
        '<div class="col-3">' +
        '<div class="row">' +
        '<div class="col-2 text-right"><i class="far fa-folder"></i></div>' +
        '<div class="project_name col-8">' + project.project_name + '</div></div></div>';

    // Last modified
    projectHTML =
        projectHTML +
        '<div class="col-4 text-center text-color project_last_modified"></div>';

    // To make the view better
    projectHTML = projectHTML + '<div class="col-2 text-center text-color"></div>';

    // Add new model button
    projectHTML =
        projectHTML +
        '<div class="col-1 text-center new-model" data-toggle="modal"' +
        'data-target="#add-model" title="Add a new model">' +
        '<i class="fas fa-plus"></i>' +
        '</div>';

    // More options - rename/delete
    projectHTML =
        projectHTML +
        '<div class="col-1 text-center more">' +
        '<a class="dropdown" data-toggle="dropdown" aria-haspopup="true"' +
        'aria-expanded="false"><i class="fas fa-align-justify"></i></a>' +
        '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">\n' +
        '<a class="dropdown-item rename-project"><i class="fas fa-edit"></i>Rename</a>' +
        '<a class="dropdown-item delete-project"><i class="fas fa-trash"></i>Delete</a>' +
        '</div></div>';

    // Close the row and header div
    projectHTML = projectHTML + '</div></div>';

    // Goal model list
    projectHTML = projectHTML + '<div id="models_'+ project.project_id +'" class="collapse model-list">';

    // Goal models if any
    if (project.models) {
        projectHTML = parseGoalModelList(project.models, projectHTML);
    }

    // Close the goal model list
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

    // The model div
    let modelHTML =
        '<div class="row model py-3 border-bottom" id="'+ model.model_id +'">';

    // To make the view better
    modelHTML = modelHTML + '<div class="col-1"></div>';

    // Model name
    modelHTML = modelHTML +
        '<div class="col-3">' +
        '<div class="row">' +
        '<div class="col-2 text-right"><i class="far fa-image"></i></div>' +
        '<div class="model_name col-8">' + model.model_name + '</div></div></div>';

    // Model last modified
    modelHTML = modelHTML +
        '<div class="col-4 text-center text-color model_last_modified">' + model.last_modified + '</div>';

    // Model type
    modelHTML = modelHTML + '<div class="col-2 text-center model_type"></div>'

    // To make the view better
    modelHTML = modelHTML + '<div class="col-1"></div>';

    // More options - rename/delete
    modelHTML = modelHTML +
        '<div class="col-1 text-center more">' +
        '<a class="dropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
        '<i class="fas fa-align-justify"></i></a>' +
        '<div class="dropdown-menu" aria-labelledby="dropdownMenuLink">' +
        '<a class="dropdown-item rename-model">' +
        '<i class="fas fa-edit"></i>Rename</a>' +
        '<a class="dropdown-item delete-model">' +
        '<i class="fas fa-trash"></i>Delete</a>' +
        '</div></div>';

    // Close the model div
    modelHTML = modelHTML + '</div>';

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
            console.log(projects);
            // Set the username
            setUserName(UNAME);

            // Append the projects to current UI
            for (let i in projects.projects) {
                let projectHTML = parseProject(projects.projects[i]);
                $("#projects-container").append(projectHTML);
            }

            // Add listeners
            addListenersToNewItem();
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

            // Append the project to current UI
            let projectHTML = parseProject(newProject);
            $("#projects-container").append(projectHTML);
            successMessageSlide("Project: " + newProject.project_name + " successfully created.");

            // add Listeners
            removeCustomizedEventListeners();
            addListenersToNewItem();
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(jqXHR.responseJSON.message + "<br>Please try again.");
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

            // Append the new model to the UI
            let modelHTML = parseGoalModel(model);
            appendToProject(modelHTML, pid);

            successMessageSlide("Model: " + model.model_name + " successfully created.");

            // add listeners
            removeCustomizedEventListeners();
            addListenersToNewItem();
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(jqXHR.responseJSON.message + "<br>Please try again.");
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
                    $("#" + pid).find(".project_name").eq(0).html() +
                    " successfully renamed to " + project.project_name + "."
            );

            // Make the new project name shown in UI
            $("#" + pid).find(".project_name").eq(0).html(project.project_name);
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
                $("#" + pid).find(".project_name").eq(0).html() +
                    " successfully deleted."
            );

            // Hide the corresponding HTML
            $("#" + pid).hide();
        }
    }).fail(function(jqXHR) {
        warningMessageSlide(jqXHR.responseJSON.message + "<br>Please try again.");
    });
}

/**
 * Ajax function for renaming a model
 *
 * @param {url} url - to specify the user & model
 * @param {String} mid - modelID - to help rename the model in HTML
 * @param {formData} model - formData with encapsulated model to be renamed
 */
function renameModel(url, mid, model) {
    $.ajax(url, {
        data: model,
        type: "PUT",
        headers: { Authorization: "Bearer" + TOKEN },
        success: () => {
            successMessageSlide(
                "Model:" +
                $("#" + mid).find(".model_name").eq(0).html() +
                " successfully deleted. " +
                model.model_name +
                "."
            );

            // Make the new model name shown in UI
            $("#" + mid).find(".model_name").eq(0).html(model.model_name);
        }
    })
}

/**
 * Ajax function for deleting a model
 *
 * @param {url} url - to specify the user & model
 * @param {String} mid - modelID - to help delete the model in HTML
 * @param {formData} model - formData with encapsulated model to be deleted
 */
function deleteModel(url, mid, model) {
    $.ajax(url, {
        data: model,
        type: "PUT",
        headers: { Authorization: "Bearer" + TOKEN },
        success: () => {
            successMessageSlide(
                "Model:" +
                $("#" + mid).find(".model_name").eq(0).html() +
                " successfully deleted."
            );

            // Hide the corresponding HTML
            $("#" + mid).hide();
        }
    })
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
function putProjectNameInModal(projectName) {
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
 * Helper Function for renaming the model - put the clicked model name in the modal
 *
 * @param {String} modelName -the clicked model name
 */
function putModelNameInModal(modelName) {
    // Set the modal input to the clicked project name
    $("#rename-model .modal-body input").val(modelName);

    /* Set time out so that the project name gets rendered in the modal */
    let $target = $("#rename-model");
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
    $("#" + pid + " #models_" + pid)
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

/**
 * Helper function to be called every time after any change has been made to the page
 * To make sure all newly added items have the right eventListeners
 */
function addListenersToNewItem() {
    addClickOnProject();
    addClickOnNewModel();
    addClickOnModel();
    addClickOnRenameProject();
    addClickOnDeleteProject();
    addClickOnMore();
    addClickOnRenameModel();
    addClickOnDeleteModel();
    addDbClickOnModel();
}

/**
 * Function to add click eventListener to 'project' class
 * To show all the models and change the collapse button style
 */
function addClickOnProject() {
    $(".project").click(evt => {
        let parentNode = null;
        if($(evt.target).hasClass("project")) {
            parentNode = evt.target;
        } else {
            parentNode = $(evt.target).parents(".project")[0];
        }
        setPID($(parentNode).attr("id"));
        let collapseBtn = $(parentNode).find(".collapse-btn")[0];
        changeCollapseStyle(collapseBtn);
        // show/unfold the model list
        $("#models_" + getPID()).collapse('toggle');
    });
}

/**
 * Function to add click eventListener to 'new-model' class
 *
 */
function addClickOnNewModel() {
    $(".new-model").click(evt => {
        evt.stopImmediatePropagation();
        let parentNode = $(evt.target).parents(".project")[0];
        setPID($(parentNode).attr("id"));
        $("#add-model").modal("toggle");
    });
}

/**
 * Function to add click eventListener to 'rename-project' class
 *
 */
function addClickOnRenameProject() {
    $(".rename-project").click(evt => {
        evt.stopImmediatePropagation();
        let parentNode = $(evt.target).parents(".project")[0];
        setPID($(parentNode).attr("id"));
        let projectName = $(parentNode).find(".project_name").eq(0).html();
        console.log(projectName);
        putProjectNameInModal(projectName);
    });
}

/**
 * Function to add click eventListener to 'delete-project' class
 *
 */
function addClickOnDeleteProject() {
    $(".delete-project").click(evt => {
        evt.stopImmediatePropagation();
        let parentNode = $(evt.target).parents(".project")[0];
        setPID($(parentNode).attr("id"));
        $("#delete-project").modal("toggle");
    });
}


/**
 * Function to add click eventListener to 'model' class
 *
 */
function addClickOnModel() {
    $(".model").click(evt => {
        evt.stopImmediatePropagation();
        $(".model").removeClass("model_clicked");
        let parentNode = null;
        if($(evt.target).hasClass("model")) {
            parentNode = evt.target;
        } else {
            parentNode = $(evt.target).parents(".model")[0];
        }
        $(parentNode).addClass("model_clicked");
    })
}

/**
 * Function to add click eventListener to 'more' class -- not collapsing the model list
 */
function addClickOnMore() {
    $(".more").click(evt => {
       evt.stopPropagation();
       let toggleNode = null;
       if($(evt.target).hasClass("dropdown")) {
           toggleNode = evt.target;
       } else if($(evt.target).parents(".dropdown")[0]){
           toggleNode = $(evt.target).parents(".dropdown")[0];
       } else {
           toggleNode = $(evt.target).children(".dropdown")[0];
       }
       $(toggleNode).dropdown("toggle");
    });
}

/**
 * Function to add click eventListener to 'rename-model' class
 *
 */
function addClickOnRenameModel() {
    $(".rename-model").click(evt => {
        evt.stopImmediatePropagation();
        let parentNode = null;
        if($(evt.target).hasClass("model")) {
            parentNode = evt.target;
        } else {
            parentNode = $(evt.target).parents(".model")[0];
        }
        setMID($(parentNode).attr("id"));
        let modelName = $(parentNode).find(".model_name").eq(0).html();
        putModelNameInModal(modelName);
    })
}

/**
 * Function to add click eventListener to 'delete-model' class
 *
 */
function addClickOnDeleteModel() {
    $(".delete-model").click(evt => {
        evt.stopImmediatePropagation();
        let parentNode = null;
        if($(evt.target).hasClass("model")) {
            parentNode = evt.target;
        } else {
            parentNode = $(evt.target).parents(".model")[0];
        }
        setMID($(parentNode).attr("id"));
        $("#delete-model").modal("toggle");
    })
}

/**
 * Function to add dbclick eventListener to 'model' class
 *
 */
function addDbClickOnModel() {
    $(".model").dblclick(evt => {
        evt.stopImmediatePropagation();
        let parentNode = null;
        if($(evt.target).hasClass("model")) {
            parentNode = evt.target;
        } else {
            parentNode = $(evt.target).parents(".model")[0];
        }
        setMID($(parentNode).attr("id"));
        window.location.href = "/goal_model/edit";
    });
}

/**
 * Helper function to change style of collapse-button
 *
 * @param {HTMLElement} collapseBtn
 */
function changeCollapseStyle(collapseBtn) {
    if($(collapseBtn).hasClass("fa-plus-square")) {
        $(collapseBtn).addClass("fa-minus-square");
        $(collapseBtn).removeClass("fa-plus-square");
    } else if($(collapseBtn).hasClass("fa-minus-square")) {
        $(collapseBtn).removeClass("fa-minus-square");
        $(collapseBtn).addClass("fa-plus-square");
    }
}

/**
 * Helper function to remove customized eventListeners so that there would be duplicates
 *
 */
function removeCustomizedEventListeners() {
    $(".project").off("click");
    $(".new-model").off("click");
    $(".model").off("click");
    $(".rename-project").off("click");
    $(".delete-project").off("click");
    $(".more").off("click");
    $(".rename-model").off("click");
    $(".delete-model").off("click");
    $(".mode").off("dblclick");
}