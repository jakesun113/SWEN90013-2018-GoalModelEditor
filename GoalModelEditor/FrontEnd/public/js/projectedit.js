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
            $('#model_name strong').html(jsonData.GoalModelProject.ProjectName + ' - '
                + jsonData.GoalModelProject.ModelName);
            loadData();
            loadImages();
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

let num = 1;
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
        // alert(formData.getAll("picture"));
        uploadPictures(formData);
        $("#pro-image").val("");
    } else {
        console.log("Browser not support");
    }
}

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
            $("#success-alert").html(
                "Image successfully Uploaded."
            );
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

/*Count goals num*/
let FunctionalNum = 0;
let EmotionalNum = 0;
let NegativeNum = 0;
let QualityNum = 0;
let StakeholderNum = 0;

/*Three clusters at start*/
let clusterNumber = 1;

/*read goal from html and transform them to JSON start*/
function readData() {}
/*read goal from html and transform them to JSON end*/

/*Load data start*/
function loadData() {
    console.log(window.jsonData);
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

    // getData();
    FunctionalNum = jsonData.GoalModelProject.GoalList.FunctionalNum;
    EmotionalNum = jsonData.GoalModelProject.GoalList.EmotionalNum;
    QualityNum = jsonData.GoalModelProject.GoalList.QualityNum;
    NegativeNum = jsonData.GoalModelProject.GoalList.NegativeNum;
    StakeholderNum = jsonData.GoalModelProject.GoalList.StakeholderNum;
    loadCluster();
}
/*Load data end*/

/*Load images start*/
// function loadImages() {
//     // https://blog.csdn.net/ZteenMozart/article/details/80790920
//     let secret = JSON.parse(Cookies.get("LOKIDIED"));
//     let token = secret.token;
//     let userId = secret.uid;
//     let modelId = Cookies.get("MID");
//     let reg = "/" + userId + modelId + "/";
//
//     var tbsource = "1"; //本地文件夹路径
//
//     var hdfiles = "";
//     var objFSO = new ActiveXObject("Scripting.FileSystemObject");
//     if (!objFSO.FolderExists(tbsource)) {
//         alert("<" + tbsource + ">该文件夹路径不存在，或者路径不能含文件名！");
//         objFSO = null;
//     }
//
//     var objFolder = objFSO.GetFolder(tbsource);
//
//     var colFiles = new Enumerator(objFolder.Files);
//     //读取文件夹下文件
//     for (; !colFiles.atEnd(); colFiles.moveNext()) {
//         var objFile = colFiles.item();
//
//         if (reg.test(objFile.Name.toLowerCase())) {
//             hdfiles = hdfiles + "<img src='1/" + objFile.Name + "'>";
//         }
//     }
//
//     let output = $(".preview-images-zone");
//     let html =
//         '<div class="preview-image preview-show-' +
//         num +
//         '">' +
//         '<div class="image-cancel" data-no="' +
//         num +
//         '">x</div>' +
//         '<div class="image-zone"><img id="pro-img-' +
//         num +
//         '" src="' +
//         picFile.result +
//         '"></div>' +
//         // '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' + num + '" class="btn btn-light btn-edit-image">edit</a></div>' +
//         "</div>";
//
//     output.append(html);
//     num = num + 1;
// }
/*Load images end*/

/*Add new cluster start*/
function loadCluster() {
    let clusterNum = jsonData.GoalModelProject.Clusters.length;
    if (clusterNum > 1) {
        for (let i = 0; i < clusterNum - 1; i++) {
            addCluster();
        }
    }

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

            //console.log($(".dd-empty").length);
            $("div").remove(".dd-empty");
        }
    }
}
/*Add new cluster end*/

/*Add new cluster start*/
function addCluster() {
    let cluster = $("#cluster");
    clusterNumber++;

    cluster.append(
        '<div class="showborder inside-scrollbar dd" style="background-color: white" id=cluster_' +
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
// takes a nodes array and turns it into a <ul>
function parseNodes(nodes) {
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

// takes a node object and turns it into a <li>
function parseNode(node) {
    let li = document.createElement("LI");
    li.setAttribute("class", node.GoalType);
    li.setAttribute("class", "dragger");
    li.setAttribute("draggable", "true");
    // li.setAttribute("id", node.GoalID);
    li.innerHTML =
        '<input id= "' +
        node.GoalID +
        '" class="' +
        node.GoalType +
        " " +
        "input-font" +
        '" value = "' +
        node.GoalContent +
        '" placeholder="New goal" style="font-weight: bold"" ' +
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

/*Add new goal by pressing "Enter" start*/
document.onkeydown = function(event) {
    let goalID;
    let goalType;
    //when the user press the "enter" button
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

        let newlist =
            '<li draggable="true" class="dragger"><input id="' +
            goalID +
            '" class="' +
            goalType +
            " " +
            "input-font" +
            '" placeholder="New goal" note="notes" value="" style="font-weight: bold"/></li>';

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
/*Add new goal by pressing "Enter" end*/

/*Delete goal by pressing "Backspace" when empty start*/
document.onkeyup = function(event) {
    let goalID;
    //when the user press the "enter" button
    if (document.activeElement.tagName === "INPUT" && event.key === "Escape") {
        //make the default enter invalid
        let parent = document.activeElement.parentNode;
        let grandparent = parent.parentNode;
        if (parent.previousElementSibling != null) {
            grandparent.removeChild(parent);
            event.preventDefault();
        }
    }
};
/*Delete goal by pressing "Backspace" when empty end*/

/*Hide and show section start*/
function photonextbtn() {
    let p = document.getElementById("photo");
    let goal = document.getElementById("goals");
    let n = document.getElementById("notes");
    let c = document.getElementById("cluster");
    // let g = document.getElementById("generator");
    let b = document.getElementById("photonextbtn");

    if (p.style.display === "none") {
        p.style.display = "block";
        n.style.display = "none";
        c.style.display = "none";
        // g.style.display = "none";
        b.innerHTML = "Next";
    } else {
        p.style.display = "none";
        getData();
        // goal.removeAttributeNode("style");
        // goal.addAttributes("goalscrollbar");
        n.style.display = "block";
        c.style.display = "block";
        // g.style.display = "block";
        b.innerHTML = "Back";
    }
}

// cluster to generator
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
    console.log(typeof(model));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/" + userId + "/" + modelId;
    // ajax starts
    $.ajax(url, {
        type: "PUT",
        data: JSON.stringify(model),
        dataType: 'json',
        contentType: 'application/json',
        headers: { Authorization: "Bearer " + token },
        success: function(data) {
            $("#success-alert").html(
                "Successfully Saved."
            );
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
    }); // end ajax
}); // end submit
/*Send data to backend end*/

/*Get data from HTML to JSON start*/
function getData() {
    var functionaldata = $('#functionaldata').find('ul')[0].children;
    //console.log(functionaldata);
    let i = 0;
    for (i = 0; i < functionaldata.length; i++) {
        console.log($(functionaldata[i]).find('input')[0].value);
    }
    // $("#qualitydata").append(
    //     parseNodes(jsonData.GoalModelProject.GoalList.Quality)
    // );
    // $("#emotionaldata").append(
    //     parseNodes(jsonData.GoalModelProject.GoalList.Emotional)
    // );
    // $("#negativedata").append(
    //     parseNodes(jsonData.GoalModelProject.GoalList.Negative)
    // );
    // $("#stakeholderdata").append(
    //     parseNodes(jsonData.GoalModelProject.GoalList.Stakeholder)
    // );
    //
    // FunctionalNum = jsonData.GoalModelProject.GoalList.FunctionalNum;
    // EmotionalNum = jsonData.GoalModelProject.GoalList.EmotionalNum;
    // QualityNum = jsonData.GoalModelProject.GoalList.QualityNum;
    // NegativeNum = jsonData.GoalModelProject.GoalList.NegativeNum;
    // StakeholderNum = jsonData.GoalModelProject.GoalList.StakeholderNum;
    // window.jsonData.
    // console.log("front end get data log => " + $('#qualitydata').find('li').forEach(a,()=>{
    //     console.log(a.value);
    // }))
}
/*Get data from HTML to JSON end*/

// the mock JSON data
// window.jsonData = {
//     GoalModelProject: {
//         UserID: "10001",
//         GoalModelID: "1",
//         ProjectName: "My first goal model",
//
//         //Goal list: [five goal types][used goal][deleted goal]
//         GoalList: {
//             FunctionalNum: 1,
//             EmotionalNum: 1,
//             QualityNum: 1,
//             NegativeNum: 1,
//             StakeholderNum: 1,
//             Functional: [
//                 {
//                     GoalID: "F_1",
//                     GoalType: "Functional",
//                     GoalContent: "",
//                     GoalNote: "Goal F_1 Note",
//                     SubGoals: []
//                 }
//             ],
//             Quality: [
//                 {
//                     GoalID: "Q_1",
//                     GoalType: "Quality",
//                     GoalContent: "",
//                     GoalNote: "Goal Q_1 Note"
//                 }
//             ],
//             Emotional: [
//                 {
//                     GoalID: "E_1",
//                     GoalType: "Emotional",
//                     GoalContent: "",
//                     GoalNote: "Goal E_1 Note"
//                 }
//             ],
//             Negative: [
//                 {
//                     GoalID: "N_1",
//                     GoalType: "Negative",
//                     GoalContent: "",
//                     GoalNote: "Goal N_1 Note"
//                 }
//             ],
//             Stakeholder: [
//                 {
//                     GoalID: "S_1",
//                     GoalType: "Stakeholder",
//                     GoalContent: "",
//                     GoalNote: "Goal S_1 Note"
//                 }
//             ]
//         },
//
//         Clusters: [
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
//                                 GoalID: "F_4",
//                                 GoalType: "Functional",
//                                 GoalContent: "This is Functional Goal F_4",
//                                 GoalNote: "Goal F_4 Note",
//                                 SubGoals: []
//                             },
//                             {
//                                 GoalID: "F_5",
//                                 GoalType: "Functional",
//                                 GoalContent: "This is Functional Goal F_5",
//                                 GoalNote: "Goal F_5 Note",
//                                 SubGoals: []
//                             },
//                             {
//                                 GoalID: "E_2",
//                                 GoalType: "Emotional",
//                                 GoalContent: "This is Emotional Goal E_2",
//                                 GoalNote: "Goal E_2 Note",
//                                 SubGoals: []
//                             },
//                             {
//                                 GoalID: "Q_3",
//                                 GoalType: "Quality",
//                                 GoalContent: "This is Quality Goal Q_3",
//                                 GoalNote: "Goal Q_3 Note",
//                                 SubGoals: []
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
//             }
//         ]
//     }
// };

/* Load images from server */
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
            for (let i in images){
                if(images[i] && images[i][0] !== "-") {
                    console.log(images[i]);
                        let html =
                            '<div class="preview-image preview-show-' +
                            i +
                            '">' +
                            '<div class="image-cancel" data-no="' +
                            i +
                            '">x</div>' +
                            '<div class="image-zone"><img id="pro-img-' +
                            i +
                            '" src="' +
                            'data:image/png;base64,' + images[i] +
                            '"></div>' +
                            // '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' + num + '" class="btn btn-light btn-edit-image">edit</a></div>' +
                            "</div>";
                        output.append(html);
                    }
                }
            }
            //     let html =
            //         '<div class="preview-image preview-show-' +
            //         num +
            //         '">' +
            //         '<div class="image-cancel" data-no="' +
            //         num +
            //         '">x</div>' +
            //         '<div class="image-zone"><img id="pro-img-' +
            //         num +
            //         '" src="' +
            //         '' +
            //         '"></div>' +
            //         // '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' + num + '" class="btn btn-light btn-edit-image">edit</a></div>' +
            //         "</div>";
            //     output.append(html);
            // }
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

