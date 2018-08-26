"use strict";

/*import photos start*/
$(document).ready(function() {
    document
        .getElementById("pro-image")
        .addEventListener("change", readImage, false);
    $(document).on("click", ".image-cancel", function() {
        let no = $(this).data("no");
        $(".preview-image.preview-show-" + no).remove();
    });
    // Set the username in display
    $("#username")
        .eq(0)
        .html(Cookies.get("UIID"));

    $(".input-font").css("font-weight", "bold");
});

$(document).on("mouseover", "#ul li input", function() {
    // alert($(this).val());
    $("#notedata").html("<p>" + $(this).attr("note") + "</p>");
});

/**
 * get JSON file from backend according to userId and modelId
 */
function getJSONFile() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/" + userId + "/" + modelId;
    $.ajax(url, {
        // the API of upload pictures
        type: "GET",
        headers: { Authorization: "Bearer " + token },
        success: function(data) {
            window.jsonData = JSON.parse(JSON.parse(JSON.stringify(data)));
            $("#model_name strong").html(
                jsonData.GoalModelProject.ProjectName +
                    " - " +
                    jsonData.GoalModelProject.ModelName
            );
            loadData();
            loadImages();
            //activate drag function
            drag();

            $(".dd").nestable({
                callback: function(l, e) {
                    // l is the main container
                    // e is the element that was moved
                    appendCluster();
                },
                scroll: true
            });
        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}

// picture numbers
let num = 1;

/**
 * read image from local and show on the page
 */
function readImage() {
    if (window.File && window.FileList && window.FileReader) {
        let files = event.target.files; //FileList object
        let output = $(".preview-images-zone");
        let formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            // check file type
            if (!file.type.match("image")) continue;
            // add file to formData
            formData.append("image", file);

            let picReader = new FileReader();
            picReader.addEventListener("load", function(event) {
                let picFile = event.target;
                // generate the picture html
                let html =
                    '<div class="preview-image preview-show-' +
                    num +
                    '">' +
                    '<div class="image-cancel" data-no="' +
                    num +
                    '">x</div>' +
                    '<div class="image-zone"><img id="pro-img-' +
                    num +
                    '" src="' +
                    picFile.result +
                    '"></div>' +
                    // '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' + num + '" class="btn btn-light btn-edit-image">edit</a></div>' +
                    "</div>";

                output.append(html);
                num = num + 1;
            });
            picReader.readAsDataURL(file);
        }
        // alert(formData.getAll('picture'));
        uploadPictures(formData);
        $("#pro-image").val("");
    } else {
        $("#warning-alert").html(
            "Browser supporting issue, please try another browser."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }
}

/**
 * Upload pictures function
 * @param formData
 */
function uploadPictures(formData) {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/images/" + userId + "/" + modelId;
    $.ajax(url, {
        // the API of upload pictures
        type: "POST",
        contentType: false,
        data: formData,
        processData: false,
        async: true,
        headers: { Authorization: "Bearer " + token },
        success: function(data) {
            $("#success-alert").html("Image successfully Uploaded.");
            $("#success-alert")
                .slideDown()
                .delay(3000)
                .slideUp();
        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    });
}
/*import photos end*/

/*JSON data start*/
// window.jsonData = {
//     GoalModelProject: {
//         UserID: "10001",
//         GoalModelID: "1",
//         ProjectName: "My first goal model",
//
//         //Goal list: [five goal types]
//         GoalList: {
//             FunctionalNum: 3,
//             EmotionalNum: 3,
//             QualityNum: 3,
//             NegativeNum: 2,
//             StakeholderNum: 2,
//             Functional: [
//                 {
//                     GoalID: "F_1",
//                     GoalType: "Functional",
//                     GoalContent: "This is Functional Goal F_1",
//                     GoalNote: "Goal F_1 Note",
//                     SubGoals: []
//                 },
//                 {
//                     GoalID: "F_2",
//                     GoalType: "Functional",
//                     GoalContent: "This is Functional Goal F_2",
//                     GoalNote: "Goal F_2 Note",
//                     SubGoals: []
//                 },
//                 {
//                     GoalID: "F_3",
//                     GoalType: "Functional",
//                     GoalContent: "This is Functional Goal F_3",
//                     GoalNote: "Goal F_3 Note",
//                     SubGoals: []
//                 }
//             ],
//             Quality: [
//                 {
//                     GoalID: "Q_1",
//                     GoalType: "Quality",
//                     GoalContent: "This is Quality Goal Q_1",
//                     GoalNote: "Goal Q_1 Note"
//                 },
//                 {
//                     GoalID: "Q_2",
//                     GoalType: "Quality",
//                     GoalContent: "This is Quality Goal Q_2",
//                     GoalNote: "Goal Q_2 Note"
//                 }
//             ],
//             Emotional: [
//                 {
//                     GoalID: "E_1",
//                     GoalType: "Emotional",
//                     GoalContent: "This is Emotional Goal E_1",
//                     GoalNote: "Goal E_1 Note"
//                 },
//                 {
//                     GoalID: "E_2",
//                     GoalType: "Emotional",
//                     GoalContent: "This is Emotional Goal E_2",
//                     GoalNote: "Goal E_2 Note"
//                 }
//             ],
//             Negative: [
//                 {
//                     GoalID: "N_1",
//                     GoalType: "Negative",
//                     GoalContent: "This is Negative Goal N_1",
//                     GoalNote: "Goal N_1 Note"
//                 },
//                 {
//                     GoalID: "N_2",
//                     GoalType: "Negative",
//                     GoalContent: "This is Negative Goal N_2",
//                     GoalNote: "Goal N_2 Note"
//                 }
//             ],
//             Stakeholder: [
//                 {
//                     GoalID: "S_1",
//                     GoalType: "Stakeholder",
//                     GoalContent: "This is Stakeholder Goal S_1",
//                     GoalNote: "Goal S_1 Note"
//                 },
//                 {
//                     GoalID: "S_2",
//                     GoalType: "Stakeholder",
//                     GoalContent: "This is Stakeholder Goal S_2",
//                     GoalNote: "Goal S_2 Note"
//                 }
//             ]
//         },
//
//         //Cluster
//         Cluster: [
//             {
//                 ClusterID: "cluster_1",
//                 ClusterGoals: [
//                     {
//                         GoalID: "F_1",
//                         GoalType: "Functional",
//                         GoalContent: "This is Functional Goal F_1",
//                         GoalNote: "Goal F_1 Note",
//                         SubGoals: []
//                     },
//                     {
//                         GoalID: "F_2",
//                         GoalType: "Functional",
//                         GoalContent: "This is Functional Goal F_2",
//                         GoalNote: "Goal F_2 Note",
//                         SubGoals: []
//                     },
//                     {
//                         GoalID: "F_3",
//                         GoalType: "Functional",
//                         GoalContent: "This is Functional Goal F_3",
//                         GoalNote: "Goal F_3 Note",
//                         SubGoals: [
//                             {
//                                 GoalID: "F_1",
//                                 GoalType: "Functional",
//                                 GoalContent: "This is Functional Goal F_1",
//                                 GoalNote: "Goal F_1 Note",
//                                 SubGoals: []
//                             },
//                             {
//                                 GoalID: "E_2",
//                                 GoalType: "Emotional",
//                                 GoalContent: "This is Emotional Goal E_2",
//                                 GoalNote: "Goal E_2 Note"
//                             },
//                             {
//                                 GoalID: "Q_3",
//                                 GoalType: "Quality",
//                                 GoalContent: "This is Quality Goal Q_3",
//                                 GoalNote: "Goal Q_3 Note"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             {
//                 ClusterID: "cluster_2",
//                 ClusterGoals: [
//                     {
//                         GoalID: "E_2",
//                         GoalType: "Emotional",
//                         GoalContent: "This is Emotional Goal E_2",
//                         GoalNote: "Goal E_2 Note"
//                     },
//                     {
//                         GoalID: "Q_3",
//                         GoalType: "Quality",
//                         GoalContent: "This is Quality Goal Q_3",
//                         GoalNote: "Goal Q_3 Note"
//                     }
//                 ]
//             },
//             {
//                 ClusterID: "cluster_3",
//                 ClusterGoals: [
//                     {
//                         GoalID: "E_2",
//                         GoalType: "Emotional",
//                         GoalContent: "This is Emotional Goal E_2",
//                         GoalNote: "Goal E_2 Note"
//                     },
//                     {
//                         GoalID: "Q_3",
//                         GoalType: "Quality",
//                         GoalContent: "This is Quality Goal Q_3",
//                         GoalNote: "Goal Q_3 Note"
//                     }
//                 ]
//             },
//             {
//                 ClusterID: "cluster_4",
//                 ClusterGoals: [
//                     {
//                         GoalID: "E_2",
//                         GoalType: "Emotional",
//                         GoalContent: "This is Emotional Goal E_2",
//                         GoalNote: "Goal E_2 Note"
//                     },
//                     {
//                         GoalID: "Q_3",
//                         GoalType: "Quality",
//                         GoalContent: "This is Quality Goal Q_3",
//                         GoalNote: "Goal Q_3 Note"
//                     }
//                 ]
//             },
//             {
//                 ClusterID: "cluster_5",
//                 ClusterGoals: []
//             }
//         ]
//     }
// };
/*JSON data end*/

/*Count goals numbers*/
let FunctionalNum = 0;
let EmotionalNum = 0;
let NegativeNum = 0;
let QualityNum = 0;
let StakeholderNum = 0;

/*Three clusters at start*/
let clusterNumber = 1;

/*Load data start*/
/**
 * load goals from JSON
 */
function loadData() {
    $("#functionaldata").append(
        parseNodes(jsonData.GoalModelProject.GoalList.Functional)
    );
    $("#qualitydata").append(
        parseNodes(jsonData.GoalModelProject.GoalList.Quality)
    );
    $("#emotionaldata").append(
        parseNodes(jsonData.GoalModelProject.GoalList.Emotional)
    );
    $("#negativedata").append(
        parseNodes(jsonData.GoalModelProject.GoalList.Negative)
    );
    $("#stakeholderdata").append(
        parseNodes(jsonData.GoalModelProject.GoalList.Stakeholder)
    );

    // get goal numbers from JSON
    FunctionalNum = jsonData.GoalModelProject.GoalList.FunctionalNum;
    EmotionalNum = jsonData.GoalModelProject.GoalList.EmotionalNum;
    QualityNum = jsonData.GoalModelProject.GoalList.QualityNum;
    NegativeNum = jsonData.GoalModelProject.GoalList.NegativeNum;
    StakeholderNum = jsonData.GoalModelProject.GoalList.StakeholderNum;
    loadCluster();
}
/*Load data end*/

/*Add new cluster start*/
/**
 * load clusters according to JSON
 */
function loadCluster() {
    let clusterNum = jsonData.GoalModelProject.Clusters.length;
    // add new clusters according to cluster numbers
    if (clusterNum > 1) {
        for (let i = 0; i < clusterNum - 1; i++) {
            addCluster();
        }
    }

    // add goals to clusters
    for (let i = 0; i < clusterNum; i++) {
        let clusterID = jsonData.GoalModelProject.Clusters[i].ClusterID;
        if (
            jsonData.GoalModelProject.Clusters[i].ClusterGoals !== undefined &&
            jsonData.GoalModelProject.Clusters[i].ClusterGoals.length > 0
        ) {
            document
                .getElementById(clusterID)
                .appendChild(
                    parseClusterNodes(
                        jsonData.GoalModelProject.Clusters[i].ClusterGoals
                    )
                );

            //console.log($('.dd-empty').length);
            $("div").remove(".dd-empty");
        }
    }
}
/*Add new cluster end*/

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
        '<div class="inside-scrollbar dd" id=cluster_' +
            clusterNumber.toString() +
            ">" +
            "</div>"
    );

    //activate drag and drop function
    drop_zone(clusterNumber);
    $(".dd").nestable({
        callback: function(l, e) {
            // l is the main container
            // e is the element that was moved
            appendCluster();
        },
        scroll: true
    });
}
/*Add new cluster end*/

/*Show JSON data on edit page start*/
/**
 * parse parent node in goal list
 * @param nodes
 * @returns {HTMLElement}
 */
function parseNodes(nodes) {
    // takes a nodes array and turns it into a <ul>
    let ul = document.createElement("UL");
    ul.setAttribute("id", "ul");
    ul.setAttribute("class", "drag-list");
    for (let i = 0; i < nodes.length; i++) {
        //ul.innerHTML = '<div>'+ node.GoalDescription + '</div>';
        ul.appendChild(parseNode(nodes[i]));
    }
    return ul;
}

/*parse Cluster nodes start*/
/**
 * parse parent node in cluster
 * @param nodes
 * @returns {HTMLElement}
 */
function parseClusterNodes(nodes) {
    let ol = document.createElement("OL");
    ol.setAttribute("class", "dd-list");
    for (let i = 0; i < nodes.length; i++) {
        //ul.innerHTML = '<div>'+ node.GoalDescription + '</div>';
        ol.appendChild(parseClusterNode(nodes[i]));
    }
    return ol;
}
/*parse Cluster nodes end*/

/**
 * parse children goals in goal list
 * @param node
 * @returns {HTMLElement}
 */
function parseNode(node) {
    // takes a node object and turns it into a <li>
    let li = document.createElement("LI");
    li.setAttribute("class", node.GoalType);
    li.setAttribute("class", "dragger");
    li.setAttribute("draggable", "true");
    let fontWeight = "bold";
    if (node.Used) {
        fontWeight = "normal";
    }
    // li.setAttribute('id', node.GoalID);
    li.innerHTML =
        '<input id= "' +
        node.GoalID +
        '" class="' +
        node.GoalType +
        " " +
        "input-font" +
        '" value = "' +
        node.GoalContent +
        '" placeholder="New goal" style="font-weight: ' +
        fontWeight +
        '" ' +
        'note="' +
        node.GoalNote +
        '"' +
        "/>";

    //countID(node.GoalType);

    // recursion to add sub goal
    if (node.SubGoals !== undefined && node.SubGoals.length > 0)
        li.appendChild(parseNodes(node.SubGoals));
    return li;
}
/*Show JSON data on edit page end*/

/*parse Cluster node start*/
/**
 * parse children goals in cluster
 * @param node
 * @returns {HTMLElement}
 */
function parseClusterNode(node) {
    let li = document.createElement("LI");
    li.setAttribute("class", "dd-item");

    li.innerHTML =
        '<input id= "' +
        node.GoalID +
        '" class="' +
        node.GoalType +
        " " +
        "input-font" +
        " " +
        "dd-handle" +
        '" value = "' +
        node.GoalContent +
        '" placeholder="New goal" style="font-weight: bold"" ' +
        'note="' +
        node.GoalNote +
        '"' +
        "/>";

    // recursion to add sub goal
    if (node.SubGoals !== undefined && node.SubGoals.length > 0) {
        li.appendChild(parseClusterNodes(node.SubGoals));
    }

    return li;
}
/*parse Cluster node end*/

/*Add new goal by pressing 'Enter' start*/
/**
 * add new goal by pressing 'Enter'
 * @param event
 */
document.onkeydown = function(event) {
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
            "input-font" +
            '" placeholder="New goal" note="notes" value="" style="font-weight: bold"/></li>';

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
document.onkeyup = function(event) {
    let goalID;
    //when the user press the 'enter' button
    if (document.activeElement.tagName === "INPUT" && event.key === "Escape") {
        //make the default enter invalid
        let parent = document.activeElement.parentNode;
        let grandparent = parent.parentNode;
        // if parent not null, delete child
        if (parent.previousElementSibling != null) {
            grandparent.removeChild(parent);
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
        b.innerHTML = "Render";
    } else {
        p.style.display = "none";
        t.style.display = "none";
        c.setAttribute("class", "col-3 showborder scrollbar");
        c.style.display = "block";
        r.style.display = "block";
        g.style.display = "block";
        b.innerHTML = "Back";
    }
}

/*render the goal model start*/
function render() {}
/*render the goal model end*/

/*drag and drop start*/
let nowCopying;

function drag() {
    $(".dragger").on("dragstart", function(e) {
        nowCopying = e.target;
        //console.log(nowCopying);
    });
}

function drop_zone(clusterNumber) {
    $("#cluster_" + clusterNumber).on("dragover", function(e) {
        e.preventDefault();
    });

    $("#cluster_" + clusterNumber).on("drop", function(e) {
        e.preventDefault();
        let fromGoallist = $(nowCopying.parentNode.parentNode).hasClass(
            "goal-list"
        );

        $(".dd").nestable({
            callback: function(l, e) {
                // l is the main container
                // e is the element that was moved
                appendCluster();
            },
            scroll: true
        });

        let draggableWrapper = '<ol class="dd-list">';
        draggableWrapper += '<li class="dd-item">';
        let newNode = createElementFromHTML($(nowCopying).html());

        $(newNode).css("font-weight", "bold");

        newNode.classList.add("dd-handle");

        $(newNode).attr("value", $(nowCopying).children("input")[0].value);

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
    callback: function(l, e) {
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

$("#edit").click(function() {
    $("#cluster")
        .find("input")
        .removeClass("dd-handle");

    $("#edit").hide();
    $("#drag").show();
});

$("#drag").click(function() {
    $("#cluster")
        .find("input")
        .addClass("dd-handle");

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
            callback: function(l, e) {
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
$("#signout").click(function(evt) {
    evt.preventDefault();
    Cookies.remove("LOKIDIED");
    Cookies.remove("UIID");
    Cookies.remove("MID");
    Cookies.remove("PID");
    window.location.href = "/";
});

/*Hide and show section end*/

/*Send data to backend start*/
$("#save").click(function(evt) {
    evt.preventDefault();
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let model = window.jsonData;
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/" + userId + "/" + modelId;
    getData();
    // ajax starts
    $.ajax(url, {
        type: "PUT",
        data: JSON.stringify(model),
        dataType: "json",
        contentType: "application/json",
        headers: { Authorization: "Bearer " + token },
        success: function(data) {
            $("#success-alert").html("Successfully Saved.");
            $("#success-alert")
                .slideDown()
                .delay(3000)
                .slideUp();
        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html("Save Failed.<br>Please try again.");
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}); // end submit
/*Send data to backend end*/

/*Get data from HTML to JSON start */
/**
 * get data from HTML to JSON
 */
function getData() {
    // get all data from HTML (in goal list)
    const functionalData = $($("#functionaldata").children("ul")[0]).children(
        "li"
    );
    const qualityData = $($("#qualitydata").children("ul")[0]).children("li");
    const emotionalData = $($("#emotionaldata").children("ul")[0]).children(
        "li"
    );
    const negetiveData = $($("#negativedata").children("ul")[0]).children("li");
    const stakeholderData = $($("#stakeholderdata").children("ul")[0]).children(
        "li"
    );

    let functionalList = [];
    let qualityList = [];
    let emotionalList = [];
    let negativeList = [];
    let stakeholderList = [];
    // get the all parts of JSON
    listParseGoalsToJSON(functionalData, functionalList, "Functional");
    listParseGoalsToJSON(qualityData, qualityList, "Quality");
    listParseGoalsToJSON(emotionalData, emotionalList, "Emotional");
    listParseGoalsToJSON(negetiveData, negativeList, "Negative");
    listParseGoalsToJSON(stakeholderData, stakeholderList, "Stakeholder");

    // change the json data for storing
    window.jsonData.GoalModelProject.GoalList.Functional = functionalList;
    window.jsonData.GoalModelProject.GoalList.Quality = qualityList;
    window.jsonData.GoalModelProject.GoalList.Emotional = emotionalList;
    window.jsonData.GoalModelProject.GoalList.Negative = negativeList;
    window.jsonData.GoalModelProject.GoalList.Stakeholder = stakeholderList;

    // change json data according to the current process
    window.jsonData.GoalModelProject.GoalList.FunctionalNum = FunctionalNum;
    window.jsonData.GoalModelProject.GoalList.QualityNum = QualityNum;
    window.jsonData.GoalModelProject.GoalList.EmotionalNum = EmotionalNum;
    window.jsonData.GoalModelProject.GoalList.NegativeNum = NegativeNum;
    window.jsonData.GoalModelProject.GoalList.StakeholderNum = StakeholderNum;

    // get all data from HTML clusters
    let $clusters = $(".dd");
    let clusterList = [];
    for (let i = 0; i < $clusters.length; i++) {
        let $cluster = $($clusters[i]);
        if ($($cluster.children(".dd-empty")).length !== 0) {
            continue;
        }
        let clusterJSON = {
            ClusterID: $cluster.attr("id"),
            ClusterGoals: []
        };
        // if there're goals in the cluster
        if ($cluster.children("ol")) {
            let listItems = $($cluster.children("ol")).children("li");
            let $listItems = $(listItems);
            // iterate all list items and their subgoals if there is one
            for (let i = 0; i < $listItems.length; i++) {
                let $goal = $($(listItems[i]).children("input")[0]);
                let type = getType($goal);
                let goals = [];
                if ($($(listItems[i]).children("ol")).length !== 0) {
                    getAllSubgoals($(listItems[i]), goals);
                } else {
                    let innerClusterGoalJSON = clusterParseGoalToJSON(
                        $goal.attr("id"),
                        type,
                        $goal.val(),
                        $goal.attr("note"),
                        []
                    );
                    goals.push(innerClusterGoalJSON);
                }
                console.log(goals);
                clusterJSON.ClusterGoals.push(goals[0]);
            }
        }
        console.log(clusterJSON);
        clusterList.push(clusterJSON);
    }
    // change the cluster JSON data
    window.jsonData.GoalModelProject.Clusters = clusterList;
}
/* Get data from HTML to JSON end */

/* Parse all goals for a certain type in goal list start */
/**
 * Parse all goals for a certain type in goal list
 * @param data
 * @param list
 * @param type
 */
function listParseGoalsToJSON(data, list, type) {
    for (let i = 0; i < data.length; i++) {
        let $goal = $($(data).children("input")[i]);
        let used = false;
        // alert($goal.css("font-weight"));
        if ($goal.css("font-weight") == 400) {
            used = true;
        }
        list.push(
            listParseGoalToJSON(
                $goal.attr("id"),
                type,
                $goal.val(),
                $goal.attr("note"),
                used
            )
        );
    }
}
/* Parse all goals for a certain type in goal list end */

/* Parse a single goal to JSON in goal list start */
/**
 * Parse a single goal to JSON in goal list
 * @param id
 * @param type
 * @param content
 * @param note
 * @returns {{GoalID: *, GoalType: *, GoalContent: *, GoalNote: *}}
 */
function listParseGoalToJSON(id, type, content, note, used) {
    let resultJSON = {
        GoalID: id,
        GoalType: type,
        GoalContent: content,
        GoalNote: note,
        Used: used
    };
    return resultJSON;
}
/* Parse a single goal in goal list to JSON end */

/* Parse a single goal in clusters to JSON start */
/**
 * Parse a single goal in clusters to JSON
 * @param id
 * @param type
 * @param content
 * @param note
 * @param subGoals
 * @returns {{GoalID: *, GoalType: *, GoalContent: *, GoalNote: *, SubGoals: *}}
 */
function clusterParseGoalToJSON(id, type, content, note, subGoals) {
    let resultJSON = {
        GoalID: id,
        GoalType: type,
        GoalContent: content,
        GoalNote: note,
        SubGoals: subGoals
    };
    return resultJSON;
}
/* Parse a single goal in clusters to JSON end */

/* Find type of the goal start*/
/**
 * Find type of the goal
 * @param $goal
 * @returns {string}
 */
function getType($goal) {
    if ($goal.hasClass("Functional")) {
        return "Functional";
    } else if ($goal.hasClass("Quality")) {
        return "Quality";
    } else if ($goal.hasClass("Negative")) {
        return "Negative";
    } else if ($goal.hasClass("Emotional")) {
        return "Emotional";
    } else {
        return "Stakeholder";
    }
}
/* Find type of the goal end*/

/* Get all sub goals of a goal in the cluster start*/
/**
 * Use recursive function to get all subgoals
 * @param $goalList
 * @param goals
 */
function getAllSubgoals($goalList, goals) {
    let $goal = $($goalList.children("input")[0]);
    let type = getType($goal);
    let newSubGoals = [];
    let innerClusterGoalJSON = clusterParseGoalToJSON(
        $goal.attr("id"),
        type,
        $goal.val(),
        $goal.attr("note"),
        newSubGoals
    );
    if ($($goalList.children("ol")).length !== 0) {
        let listItems = $($goalList.children("ol")).children("li");
        let $listItems = $(listItems);
        for (let i = 0; i < $listItems.length; i++) {
            getAllSubgoals($(listItems[i]), newSubGoals);
        }
        goals.push(innerClusterGoalJSON);
    } else {
        goals.push(innerClusterGoalJSON);
    }
}
/* Get all sub goals of a goal in the cluster end*/

/* Load images from server */
/**
 * Load images from server
 */
function loadImages() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/images/" + userId + "/" + modelId;
    $.ajax(url, {
        // the API of upload pictures
        type: "GET",
        headers: { Authorization: "Bearer " + token },
        success: function(stream) {
            let images = JSON.parse(stream)._streams;
            let output = $(".preview-images-zone");
            let number = 1;
            for (let i in images) {
                if (images[i] && images[i][0] !== "-") {
                    let html =
                        '<div class="preview-image preview-show-' +
                        number +
                        '">' +
                        '<div class="image-cancel" data-no="' +
                        number +
                        '">x</div>' +
                        '<div class="image-zone"><img id="pro-img-' +
                        number +
                        '" src="' +
                        "data:image/png;base64," +
                        images[i] +
                        '"></div>' +
                        "</div>";
                    output.append(html);
                    number++;
                }
            }
        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}

function sendXML() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/xml/" + userId + "/" + modelId;

    let encoder = new mxCodec();
    let node = encoder.encode(graph.getModel());
    let xml = mxUtils.getXml(node);
    mxUtils.popup(xml, true);
    $.ajax(url, {
        // the API of upload pictures
        type: 'POST',
        contentType: 'application/xml',
        data: xml,
        async: true,
        headers: { Authorization: 'Bearer ' + token },
        success: function() {

        }
    }).fail(function(jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}