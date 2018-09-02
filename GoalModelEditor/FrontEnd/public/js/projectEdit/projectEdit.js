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
});

$(document).on("mouseover", "#ul li input", function () {
    // alert($(this).val());
    $("#notedata").html("<p>" + $(this).attr("note") + "</p>");
});
//show loading
$("#loadingModal").modal("show");
//hide loading
// $("#loadingModal").modal("hide");

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
        '<div class="dd" id=cluster_' +
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
        event.key === "Enter" &&
        $(event.target.parentNode.parentNode).hasClass("drag-list")
    ) {
        //make the default enter invalid
        goalType = document.activeElement.attributes["class"].nodeValue.split(
            " "
        )[0];
        goalID = getID(goalType);
        event.preventDefault();

        // new goal html
        let newlist =
            '<li draggable="true" class="dragger"><input id="' +
            goalID +
            '" class="' +
            goalType +
            " " +
            '" placeholder="New goal" note="notes" oninput="changeFontWeight(this)" value="" style="font-weight: bold"/></li>';

        // add new goal node to its parent node
        if ($(event.target).parent().length > 0) {
            let parent = $(event.target).parent();
            parent.after(newlist);
        } else {
            $(event.target)
                .parent()
                .after(newlist);
        }
        $("#" + goalID).focus();

        //activate drag and drop
        drag();
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

/*Delete goal by pressing 'Backspace' when empty start*/
/**
 * delete goal by pressing 'Backspace' when empty
 * @param event
 */
document.onkeyup = function (event) {
    let goalID;
    //when the user press the 'enter' button
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
    if (document.activeElement.tagName === "DIV" && event.key === "Escape") {
        //make the default enter invalid
        let parent = document.activeElement.parentNode;
        let grandparent = parent.parentNode;
        let grandgrandparent = grandparent.parentNode;
        // if parent not null, delete child
        if (grandgrandparent.childNodes.length > 0) {
            grandgrandparent.removeChild(grandparent);
            event.preventDefault();
        }
    }
};
/*Delete goal by pressing 'Backspace' when empty end*/

/*Hide and show section start*/
/**
 * next button in the first page
 * [image section hide]
 * [cluster section show]
 */
function photonextbtn() {
    let p = document.getElementById("photo");
    let goal = document.getElementById("goals");
    let n = document.getElementById("notes");
    let c = document.getElementById("cluster");
    // let g = document.getElementById('generator');
    let b = document.getElementById("photonextbtn");

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
function clusternext() {
    let p = document.getElementById("photo");
    let t = document.getElementById("todolist");
    let c = document.getElementById("cluster");
    let g = document.getElementById("generator");
    let b = document.getElementById("clusternextbtn");
    let r = document.getElementById("renderbtn");

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

function drag() {
    $(".dragger").on("dragstart", function (e) {
        nowCopying = e.target;
        //console.log(nowCopying);
    });
}

function drop_zone(clusterNumber) {
    $("#cluster_" + clusterNumber).on("dragover", function (e) {
        e.preventDefault();
    });

    $("#cluster_" + clusterNumber).on("drop", function (e) {
        e.preventDefault();
        let fromGoallist = $(nowCopying.parentNode.parentNode).hasClass(
            "goal-list"
        );

        $(".dd").nestable({
            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                appendCluster();
            },
            scroll: true
        });

        let draggableWrapper = '<ol class="dd-list">';
        draggableWrapper += '<li class="dd-item">';
        let newNode = document.createElement("div");
        newNode.className = $(nowCopying).children("input")[0].className;
        $(newNode).attr("id", ($(nowCopying).attr("id")));

        $(newNode).css("font-weight", "bold");

        newNode.classList.add("dd-handle");
        newNode.classList.add("dd-handle-style");

        let type = getType($($(nowCopying).children("input")[0]));

        let imagePath = getTypeIconPath(type);

        $(newNode).html('<img src=' + imagePath + ' class="mr-1 typeIcon" >' +
            '<div class="goal-content">' +
            $(nowCopying).children("input")[0].value) + '</div>';

        draggableWrapper += newNode.outerHTML;
        draggableWrapper += "</li></ol>";
        let node = createElementFromHTML(draggableWrapper);

        //if the drag element comes from the goal list
        if (fromGoallist) {
            //if there is dd-empty (first time drag to here)
            if ($(this).children(".dd-empty")[0]) {
                $(this)
                    .children(".dd-empty")[0]
                    .replaceWith(node);

                appendCluster();
            }
            //if no dd-empty, already not first time to drag here, there is ol (alrady has one element)
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

        $(nowCopying)
            .children("input")
            .css("font-weight", "normal");
    });
}

//activate drag function
drag();

drop_zone(clusterNumber);

$(".dd").nestable({
    callback: function (l, e) {
        // l is the main container
        // e is the element that was moved
        appendCluster();
    },
    scroll: true
});

function createElementFromHTML(htmlString) {
    let div = document.createElement("div");
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}

$("#drag").hide();

$("#edit").click(function () {

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

$("#drag").click(function () {

    $(".dd-handle-style").addClass("dd-handle");
    $(".goal-content").attr("contenteditable", "false");
    $(".goal-content").css("font-weight", "bold");

    $("#drag").hide();
    $("#edit").show();
});

function appendCluster() {
    if (!$(".dd-empty").length) {
        let cluster = $("#cluster");
        clusterNumber++;
        cluster.append(
            '<div class="dd" id=cluster_' +
            clusterNumber.toString() +
            ">" +
            "</div>"
        );

        drop_zone(clusterNumber);
        $(".dd").nestable({
            callback: function (l, e) {
                // l is the main container
                // e is the element that was moved
                appendCluster();
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
 * Auto save every 60 seconds
 */
// setInterval("save()", "60000");
