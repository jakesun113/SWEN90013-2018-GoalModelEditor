/***
 * JavaScript For goal model page (drag and drop function)
 * @author Jiacheng Sun
 * @author Xuelin Zhao
 */

"use strict";

/**
 * Page onReady EventListener
 *
 */
/*import photos start*/
$(document).ready(function () {
    document
        .getElementById("pro-image")
        .addEventListener("change", readImage, false);
    $(document).on("click", ".image-cancel", function () {
        let no = $(this).data("no");
        $(".preview-image.preview-show-" + no).remove();
    });
    // Set the username in display
    $("#username")
        .eq(0)
        .html(JSON.parse(Cookies.get("LOKIDIED")).uiid);

    $(".non-draggable").attr("draggable", "false");
});

//when mouse over the specific goals, show corresponding notes
$(document).on("mouseover", "#ul li input", function () {
    // alert($(this).val());
    $("#notedata").html("<p class=\"non-draggable dragger\">" + $(this).attr("note") + "</p>");
    //dynamically set elements as not draggable
    $(".non-draggable").attr("draggable", "false");
    //when trying to drag the texts of note, trigger getDraggingElement method
    getDraggingElement();
});

//when mouse enter the specific goal in the cluster, show corresponding button
function showButton(event) {
    $(event).children(".editButton").show();
    $(event).children(".deleteButton").show();
}

//when mouse enter the specific goal in the cluster, hide corresponding button
function hideButton(event) {
    $(event).children(".editButton").hide();
    $(event).children(".deleteButton").hide();
}

//when mouse enter the specific goal in the list, show corresponding button
function showBtnInList(event) {
    $(event).children(".deleteBtnInList").show();
}

//when mouse enter the specific goal in the list, hide corresponding button
function hideBtnInList(event) {
    $(event).children(".deleteBtnInList").hide();
}

/*Add new cluster start*/
/**
 * add new cluster
 */
function addCluster() {
    let cluster = $("#cluster");
    // count cluster number
    clusterNumber++;

    // add cluster html
    cluster.append(
        '<div class="dd py-3" id=cluster_' +
        clusterNumber.toString() +
        ">" +
        "</div>"
    );

    //activate drag and drop function
    drop_zone(clusterNumber);
    $(".dd").nestable({
        onDragStart: function (l, e) {
            // get type of dragged element
            // let type = $(e).children(".dd-handle").attr("class").split(" ")[0];
            // console.log(type);
            //when start dragging, trigger addNoChildrenClass method
            addNoChildrenClass();
        },
        callback: function (l, e) {
            // l is the main container
            // e is the element that was moved
            //when finish dropping, trigger these methods to make "dd-empty" is always one
            appendCluster();
            removeCluster();
        },
        //enable auto scrolling method while dragging
        scroll: true
    });
}
/*Add new cluster end*/

/*Add new goal by pressing 'Enter' start*/
/**
 * add new goal by pressing 'Enter'
 * @param event
 */
document.onkeydown = function (event) {
    let goalID;
    let goalType;
    //when the user press the 'enter' button,
    //the target element must be input in the goal list, its value is not empty
    //and it is the last element of the goal list
    if (
        document.activeElement.tagName === "INPUT" &&
        event.target.value !== "" &&
        $(event.target.parentNode).is(':last-child') &&
        event.key === "Enter" &&
        $(event.target.parentNode.parentNode).hasClass("drag-list")
    ) {
        //make the default enter invalid
        goalType = document.activeElement.attributes["class"].nodeValue.split(
            " "
        )[0];
        goalID = getID(goalType);
        event.preventDefault();

        let placeholderText = getPlaceholder(goalType);

        // new goal html
        let newList =
            '<li draggable="true" class="dragger drag-style" ' +
            'onmouseenter="showBtnInList(this)" onmouseleave="hideBtnInList(this)">' +
            '<input id="' +
            goalID +
            '" class="' +
            goalType +
            " " +
            '" placeholder="' + placeholderText + '" ' +
            'note="notes" oninput="changeFontWeight(this)" value="" style="font-weight: bold"/>' +
            '<img class="deleteBtnInList non-draggable dragger" style="display: none" src="/img/trash-alt-solid.svg"' +
            'onclick="deleteGoalInList(this)" /></li>';

        // add new goal node to its parent node
        $(event.target).parent().after(newList);
        //set mouse auto focus on the new goal
        $("#" + goalID).focus();
        //activate drag and drop
        getDraggingElement();
    }
};
/*Add new goal by pressing 'Enter' end*/

/**
 * get goal ID
 * @param type
 * @returns {string}
 */
function getID(type) {
    switch (type) {
        case "Functional":
            FunctionalNum++;
            return "F_" + FunctionalNum;
        case "Emotional":
            EmotionalNum++;
            return "E_" + EmotionalNum;
        case "Quality":
            QualityNum++;
            return "Q_" + QualityNum;
        case "Negative":
            NegativeNum++;
            return "N_" + NegativeNum;
        case "Stakeholder":
            StakeholderNum++;
            return "S_" + StakeholderNum;
    }
}

/**
 * delete goal by pressing "delete" image
 * @param event
 */
function deleteGoalInList(element) {
    //make the default enter invalid
    let parent = element.parentNode;
    let grandparent = parent.parentNode;
    // if parent not null, delete child
    if (grandparent.childNodes.length > 1) {
        grandparent.removeChild(parent);
        event.preventDefault();
    }
    //if this is the only goal left, clear the goal content
    if (grandparent.childNodes.length === 1) {
        //console.log(event.target);
        $(element.parentNode).children("input").val("");
        $(element.parentNode).children("input").css("font-weight", "bold");
    }
}

/*detect event when pressing "Backspace" start*/
document.onkeyup = function (event) {
    //in the goal list, if press "backspace" make the goal empty, delete that goal
    if (document.activeElement.tagName === "INPUT" && event.key === "Backspace") {
        if (event.target.value === "") {
            let parent = document.activeElement.parentNode;
            let grandparent = parent.parentNode;
            // if parent not null, delete child
            if (grandparent.childNodes.length > 1) {
                grandparent.removeChild(parent);
                event.preventDefault();
            }
        }
    }
    //in the cluster, if press "backspace" make the goal empty, show warning
    if (document.activeElement.tagName === "DIV" && event.key === "Backspace") {
        if (event.target.className === "goal-content" && event.target.textContent === "") {
            activeElement = document.activeElement;
            //show warning modal
            $("#deleteGoalWarning").modal();
        }
    }
};
/*detect event when pressing "Backspace" end*/
/**
 * function when click "delete goal" button
 */
$("#deleteGoalBtn").click(function () {
    //console.log(activeElement);
    let ddHandleDiv = activeElement.parentNode;
    let ddItemLi = ddHandleDiv.parentNode;
    let ddListOl = ddItemLi.parentNode;
    // if parent not null, delete child
    if (ddListOl.childNodes.length > 0) {
        ddListOl.removeChild(ddItemLi);
        event.preventDefault();
    }
    //if ol is empty, remove this ol
    if (ddListOl.childNodes.length === 0) {
        let clusterNumDiv = ddListOl.parentNode;
        $(clusterNumDiv).removeClass("dd-collapsed");
        $(clusterNumDiv).children("[data-action]").remove();
        $(clusterNumDiv).children("ol").remove();
        event.preventDefault();
        //only when the cluster is empty, remove this cluster
        if ($(clusterNumDiv.parentNode).attr('id') === "cluster") {
            let cluster = clusterNumDiv.parentNode;
            cluster.removeChild(clusterNumDiv);
            event.preventDefault();
        }
    }
});
/**
 * function when click "confirm delete" button
 */
$("#confirmDelete").click(function () {
    deleteGoalInCluster(activeElement);
});
/*drag and drop start*/
let nowCopying;

//get the dragging element
function getDraggingElement() {
    $(".dragger").on("dragstart", function (e) {

        //when the current dragging element is "input"
        //or it is the list that has parent of "drag-list"
        if (
            document.activeElement.tagName === "INPUT"
            || $(e.target.parentNode).hasClass("drag-list")
        ) {
            //if input has value
            if ($(e.target).children("input")[0].value) {
                nowCopying = e.target;
                //console.log(nowCopying);
            }
            //otherwise, make the dragging target as empty string
            else {
                nowCopying = "";
            }
        }
        //otherwise, make the dragging target as empty string
        else {
            nowCopying = "";
        }

    });
}

//deal with the operation after dropping the element
function drop_zone(clusterNumber) {
    //when drag is over, prevent default event
    $("#cluster_" + clusterNumber).on("dragover", function (e) {
        e.preventDefault();
    });

    $("#cluster_" + clusterNumber).on("drop", function (e) {
        e.preventDefault();

        //activate nestable2 function
        $(".dd").nestable({

            onDragStart: function (l, e) {
                // get type of dragged element
                // var type = $(e).children(".dd-handle").attr("class").split(" ")[0];
                // console.log(type);
                //when start dragging, trigger addNoChildrenClass method
                addNoChildrenClass();
            },

            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                //when finish dropping, trigger these methods to make "dd-empty" is always one
                appendCluster();
                removeCluster();
            },
            //enable auto scrolling method while dragging
            scroll: true
        });

        //console.log(nowCopying);

        //only when the input of the goal is not empty
        if (nowCopying) {
            //whether the dropping element is from the goal list or the cluster
            let fromGoalList = $(nowCopying.parentNode.parentNode).hasClass(
                "goal-list"
            );
            //create new goal element in the cluster
            let draggableWrapper = '<ol class="dd-list">';
            draggableWrapper += '<li class="dd-item">';
            //copy the id, class, and value from the original dragged goal
            let newNode = document.createElement("div");
            newNode.className = $(nowCopying).children("input")[0].className;
            //set new element's id with "C_" prefix
            newNode.setAttribute("id", "C_" + $($(nowCopying).children("input")[0]).attr("id"));
            //console.log($(newNode).attr("id"));
            //add "onmouseenter" and "onmouseleave" to the new element
            newNode.setAttribute("onmouseenter", 'showButton(this)');
            newNode.setAttribute("onmouseleave", 'hideButton(this)');
            //add font weight, class name to the new goal element
            $(newNode).css("font-weight", "bold");
            //add classes to make it draggable and droppable
            newNode.classList.add("dd-handle");
            newNode.classList.add("dd-handle-style");

            //based on the type of the goal, show different images
            let type = getType($($(nowCopying).children("input")[0]));

            let imagePath = getTypeIconPath(type);

            //set new element's inner elements, including an image showing the goal type,
            //goal's content and edit and delete button
            $(newNode).html('<img src=' + imagePath + ' class="mr-1 typeIcon" > ' +
                '<div class="goal-content" tabindex="-1" ' +
                'onblur="finishEditGoalInCluster($(this));"' + '>' +
                $(nowCopying).children("input")[0].value + '</div><img class="editButton non-draggable dragger" style="display: none" src="/img/edit-solid.svg"' +
                'onclick="event.stopImmediatePropagation(); editGoalInCluster(this)" ' +
                'onmousemove="event.stopImmediatePropagation()" onmouseup="event.stopImmediatePropagation()"' +
                'onmousedown="event.stopImmediatePropagation()"/><img class="deleteButton non-draggable dragger" style="display: none"' +
                'src="/img/trash-alt-solid.svg" onclick="event.stopImmediatePropagation(); handleDeleteGoalInCluster(this)"' +
                'onmousemove="event.stopImmediatePropagation()" onmouseup="event.stopImmediatePropagation()"' +
                'onmousedown="event.stopImmediatePropagation()"/>');

            draggableWrapper += newNode.outerHTML;

            draggableWrapper += "</li></ol>";
            let node = createElementFromHTML(draggableWrapper);

            //console.log(node);
            //if the drag element comes from the goal list
            if (fromGoalList) {
                //if there is dd-empty (first time drag to here)
                if ($(this).children(".dd-empty")[0]) {
                    $(this)
                        .children(".dd-empty")[0]
                        .replaceWith(node);

                    //adding one new cluster after dropping
                    appendCluster();
                }
                //if no dd-empty, already not first time to drag here, there is ol (already has one element)
                else {
                    $(this)
                        .children("ol")[0]
                        .appendChild(
                            createElementFromHTML(
                                '<li class="dd-item">' + newNode.outerHTML + "</li>"
                            )
                        );
                }
                //before start dragging, trigger addNoChildrenClass method
                addNoChildrenClass();
            }

            //after dropping finished, change font style of the dragged element
            $(nowCopying).children("input").css("font-weight", "normal");
        }
    });
}

//activate drag function
getDraggingElement();
//activate the drop function
drop_zone(clusterNumber);

//activate nestable2 function
$(".dd").nestable({

    onDragStart: function (l, e) {
        // get type of dragged element
        //let type = $(e).children(".dd-handle").attr("class").split(" ")[0];
        //console.log(type);
        //when start dragging, trigger addNoChildrenClass method
        addNoChildrenClass();
    },
    callback: function (l, e) {
        // l is the main container
        // e is the element that was moved
        //when finish dropping, trigger these methods to make "dd-empty" is always one
        appendCluster();
        removeCluster();
    },
    //enable auto scrolling method while dragging
    scroll: true
});

function createElementFromHTML(htmlString) {
    let div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

//if no "dd-empty" is existed, append new cluster
// to make sure there is always at least one "new" cluster
function appendCluster() {
    if (!$(".dd-empty").length) {
        let cluster = $("#cluster");
        clusterNumber++;
        cluster.append(
            '<div class="dd py-3" id=cluster_' +
            clusterNumber.toString() +
            ">" +
            "</div>"
        );

        //activate nestable2 function
        drop_zone(clusterNumber);
        $(".dd").nestable({
            onDragStart: function (l, e) {
                // get type of dragged element
                // let type = $(e).children(".dd-handle").attr("class").split(" ")[0];
                // console.log(type);
                //when start dragging, trigger addNoChildrenClass method
                addNoChildrenClass();
            },
            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                //when finish dropping, trigger these methods to make "dd-empty" is always one
                appendCluster();
                removeCluster();
            },
            //enable auto scrolling method while dragging
            scroll: true
        });
    }
}

//if "dd-empty" is more than one in the cluster, remove one
//to make sure there is at most one "dd-empty" cluster
function removeCluster() {
    if ($(".dd-empty").length > 1) {
        $(".dd-empty").parent()[1].remove();

        //activate nestable2 function
        $(".dd").nestable({

            onDragStart: function (l, e) {
                // get type of dragged element
                // let type = $(e).children(".dd-handle").attr("class").split(" ")[0];
                // console.log(type);
                //when start dragging, trigger addNoChildrenClass method
                addNoChildrenClass();
            },
            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                //when finish dropping, trigger these methods to make "dd-empty" is always one
                removeCluster();
            },
            //enable auto scrolling method while dragging
            scroll: true
        });
    }
}

/*drag and drop end*/

// handle sign off button
$("#signout").click(function (evt) {
    evt.preventDefault();
    Cookies.remove("LOKIDIED");
    Cookies.remove("UIID");
    Cookies.remove("MID");
    Cookies.remove("PID");
    window.location.href = "/";
});

/**
 * Auto save every 120 seconds
 */
setInterval("saveJSON()", "120000");

/**
 * save JSON before close or refresh this page
 * @returns {string}
 */
window.onbeforeunload = function checkLeave(event) {
    event.preventDefault();
    saveJSON();
    sendXML(false);
    console.log("Auto Saved!");
};

/**
 * render warning
 */
$("#renderbtn").click(function () {
    if (isXMLExisted) {
        $("#renderWarning").modal();
    } else {
        renderGraph(document.getElementById('graphContainer'));
    }
});

/**
 * progress bar
 */
function goalClick() {
    if(!$("#goalTab").hasClass("current")){
        $("#goalTab").addClass("current");
    }
    if($("#goalTab").hasClass("done")){
        $("#goalTab").removeClass("done").addClass("current");
        $("#clusterTab").removeClass("current");
        $("#clusterTab").removeClass("done");
        $("#graphTab").removeClass("current");
        $("#graphTab").removeClass("done");
    }
    saveJSON();
    $("#photo").css("display", "block");
    $("#todolist").css("display", "block");
    $("#notes").css("display", "none");
    $("#cluster").css("display", "none");
    $("#generator").css("display", "none");
    $("#renderbtn").css("display", "none");
}

function clusterClick() {
    if(!$("#clusterTab").hasClass("current")){
        $("#clusterTab").addClass("current");
        $("#goalTab").removeClass("current");
        $("#goalTab").removeClass("done").addClass("done");
    }
    if($("#clusterTab").hasClass("done")){
        $("#clusterTab").removeClass("done").addClass("current");
        $("#graphTab").removeClass("current");
    }
    saveJSON();
    $("#photo").css("display", "none");
    $("#todolist").css("display", "block");
    $("#notes").css("display", "block");
    $("#cluster").css("display", "block");
    $("#cluster").removeClass().addClass("col-7 showborder scrollbar");
    $("#generator").css("display", "none");
    $("#renderbtn").css("display", "none");

}

function graphClick() {
    if(!$("#graphTab").hasClass("current")){
        $("#graphTab").addClass("current");
        $("#goalTab").removeClass("current");
        $("#goalTab").removeClass("done").addClass("done");
        $("#clusterTab").removeClass("current");
        $("#clusterTab").removeClass("done").addClass("done");
    }
    saveJSON();
    $("#photo").css("display", "none");
    $("#photo").css("display", "none");
    $("#todolist").css("display", "none")
    $("#notes").css("display", "none");
    $("#cluster").css("display", "block");
    $("#cluster").removeClass().addClass("col-3 showborder scrollbar");
    $("#generator").css("display", "block");
    $("#renderbtn").css("display", "inline-block");
}

$(document).on("drop", evt => {
    $("#graphTab").click();
    $("#clusterTab").click();
});

// read note
$("#notebtn").click(function () {
    $("#noteModal").modal();
    let notedata = window.jsonData.GoalModelProject.Note;
    $("#notetext").val(notedata);
});

// save modal when dismiss
$('#noteModal').on('hide.bs.modal', function () {
    let notedata = $("#notetext").val();
    window.jsonData.GoalModelProject.Note = notedata;
});