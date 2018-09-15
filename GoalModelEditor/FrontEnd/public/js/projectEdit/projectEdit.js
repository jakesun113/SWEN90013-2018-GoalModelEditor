"use strict";

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
        .html(Cookies.get("UIID"));

    $(".non-draggable").attr("draggable", "false");
});

//when mouse over the specific goals, show corresponding notes
$(document).on("mouseover", "#ul li input", function () {
    // alert($(this).val());
    $("#notedata").html("<p class=\"non-draggable dragger\">" + $(this).attr("note") + "</p>");
    $(".non-draggable").attr("draggable", "false");
    getDraggingElement();
});

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
        callback: function (l, e) {
            // l is the main container
            // e is the element that was moved
            appendCluster();
            removeCluster();
        },
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
    //when the user press the 'enter' button
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
            '<li draggable="true" class="dragger"><input id="' +
            goalID +
            '" class="' +
            goalType +
            " " +
            '" placeholder="' + placeholderText + '" note="notes" oninput="changeFontWeight(this)" value="" style="font-weight: bold"/></li>';

        // add new goal node to its parent node
        $(event.target).parent().after(newList);

        $("#" + goalID).focus();

        //activate drag and drop
        getDraggingElement();
    }
};

/**
 * get goal type
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

/*Add new goal by pressing 'Enter' end*/

/*Delete goal by pressing 'Escape' when empty start*/
/**
 * delete goal by pressing 'Escape' when empty
 * @param event
 */
let activeElement;
document.onkeyup = function (event) {
    //when the user press the 'ESC' button in the goal list
    if (document.activeElement.tagName === "INPUT" && event.key === "Escape") {
        //make the default enter invalid
        let parent = document.activeElement.parentNode;
        let grandparent = parent.parentNode;
        // if parent not null, delete child
        if (grandparent.childNodes.length > 1) {
            grandparent.removeChild(parent);
            event.preventDefault();
        }
    }
    //when the user press the 'ESC' button in the cluster
    if (document.activeElement.tagName === "DIV" && event.key === "Escape") {
        //make the default enter invalid
        let ddHandleDiv = document.activeElement.parentNode;
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
    }

    //if press "backspace" make the goal empty, delete that goal
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

    if (document.activeElement.tagName === "DIV" && event.key === "Backspace") {
        if (event.target.textContent === "") {
            activeElement = document.activeElement;
            //show warning modal
            $("#deleteGoalWarning").modal();
        }
    }
};

/*Delete goal by pressing 'Escape' when empty end*/
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

/*Hide and show section start*/
/**
 * next button in the first page
 * [image section hide]
 * [cluster section show]
 */
function handleNextToCluster() {
    let p = document.getElementById("photo");
    let n = document.getElementById("notes");
    let c = document.getElementById("cluster");
    // let g = document.getElementById('generator');
    let b = document.getElementById("photoNextBtn");
    //when clicking "next" button, save current work
    saveJSON();

    if (p.style.display === "none") {
        p.style.display = "block";
        n.style.display = "none";
        c.style.display = "none";
        // g.style.display = 'none';
        b.innerHTML = "Next";
    } else {
        p.style.display = "none";
        // goal.removeAttributeNode('style');
        // goal.addAttributes('goalscrollbar');
        n.style.display = "block";
        c.style.display = "block";
        // g.style.display = 'block';
        b.innerHTML = "Back";
    }
}

/**
 * next button in the second page, the Render button
 * [goal list section hide]
 * [mxgraph section show]
 */
function handleNextToRender() {
    let p = document.getElementById("photo");
    let t = document.getElementById("todolist");
    let c = document.getElementById("cluster");
    let g = document.getElementById("generator");
    let b = document.getElementById("clusterNextBtn");
    let r = document.getElementById("renderbtn");
    //when clicking "next" button, save current work
    saveJSON();

    if (t.style.display === "none") {
        p.style.display = "none";
        t.style.display = "block";
        c.style.display = "block";
        c.setAttribute("class", "col-7 showborder scrollbar");
        r.style.display = "none";
        g.style.display = "none";
        b.innerHTML = "Next";
    } else {
        p.style.display = "none";
        t.style.display = "none";
        c.setAttribute("class", "col-3 showborder scrollbar");
        c.style.display = "block";
        r.style.display = "inline-block";
        g.style.display = "block";
        b.innerHTML = "Back";
        // renderGraph(document.getElementById("graphContainer"));
    }
}

/*drag and drop start*/
let nowCopying;

//get the dragging element
function getDraggingElement() {
    $(".dragger").on("dragstart", function (e) {

        //only when the current dragging element is "input"
        if (document.activeElement.tagName === "INPUT") {
            //if input has value
            if ($(e.target).children("input")[0].value) {
                nowCopying = e.target;
                //console.log(nowCopying);
            }
            else {
                nowCopying = "";
            }
        }
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
            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                appendCluster();
                removeCluster();
            },
            scroll: true
        });

        //console.log(nowCopying);

        //only when the input of the goal is not empty
        if (nowCopying) {
            //whether the dropping element is from the goal list or the cluster
            let fromGoalList = $(nowCopying.parentNode.parentNode).hasClass(
                "goal-list"
            );

            let draggableWrapper = '<ol class="dd-list">';
            draggableWrapper += '<li class="dd-item">';
            //copy the id, class, and value from the original dragged goal
            let newNode = document.createElement("div");
            newNode.className = $(nowCopying).children("input")[0].className;
            $(newNode).attr("id", ($(nowCopying).attr("id")));

            //add font weight, class name to the new goal element
            $(newNode).css("font-weight", "bold");

            newNode.classList.add("dd-handle");
            newNode.classList.add("dd-handle-style");

            //based on the type of the goal, show different images
            let type = getType($($(nowCopying).children("input")[0]));

            let imagePath = getTypeIconPath(type);

            $(newNode).html('<img src=' + imagePath + ' class="mr-1 typeIcon" >' +
                '<div class="goal-content">' +
                $(nowCopying).children("input")[0].value) + '</div>';

            draggableWrapper += newNode.outerHTML;
            draggableWrapper += "</li></ol>";
            let node = createElementFromHTML(draggableWrapper);

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
    callback: function (l, e) {
        // l is the main container
        // e is the element that was moved
        appendCluster();
        removeCluster();
    },
    scroll: true
});

function createElementFromHTML(htmlString) {
    let div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

//at first, hide the "dragAll" button
$("#drag").hide();

//handle operation of clicking "editAll"
$("#edit").click(function () {
    saveJSON();
    $(".dd-handle-style").removeClass("dd-handle");
    $(".goal-content").attr("contenteditable", "true");
    // when editing, cannot press "Enter"
    $(".goal-content").keypress(function (e) {
        return e.which !== 13;
    });
    $(".goal-content").css("font-weight", "normal");

    $("#edit").hide();
    $("#drag").show();
});

//handle operation of clicking "dragAll"
$("#drag").click(function () {

    $(".dd-handle-style").addClass("dd-handle");
    $(".goal-content").attr("contenteditable", "false");
    $(".goal-content").css("font-weight", "bold");

    $("#drag").hide();
    $("#edit").show();
});

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
            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                appendCluster();
                removeCluster();
            },
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
            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                removeCluster();
            },
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
    sendXML();
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