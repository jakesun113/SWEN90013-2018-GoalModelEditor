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
    $("#username")
        .eq(0)
        .html(Cookies.get("UIID"));
});

$(document).on("mouseover", "#ul li input", function() {
    // alert($(this).val());
    $("#notedata").html("<p>" + $(this).attr("note") + "</p>");
});

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
    $.ajax({
        // the API of upload pictures
        url: "goal_model/images/" + userId + "/" + modelId,
        type: "POST",
        contentType: false,
        data: formData,
        processData: false,
        async: true,
        headers: { Authorization: "Bearer " + token },
        success: function(data) {
            alert("Upload Successfully");
        },
        error: function(data) {
            alert("Fail to upload");
        }
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
        document
            .getElementById(clusterID)
            .appendChild(
                parseNodes(jsonData.GoalModelProject.Clusters[i].ClusterGoals)
            );
    }
}
/*Add new cluster end*/

/*Add new cluster start*/
function addCluster() {
    let cluster = $("#cluster");
    clusterNumber++;

    cluster.append(
        '<div class="cluster showborder inside-scrollbar" style="background-color: white" id=cluster_' +
            clusterNumber.toString() +
            ">" +
            "</div>"
    );
}
/*Add new cluster end*/

/*Show JSON data on edit page start*/
// takes a nodes array and turns it into a <ul>
function parseNodes(nodes) {
    let ul = document.createElement("UL");
    ul.setAttribute("id", "ul");
    for (let i = 0; i < nodes.length; i++) {
        //ul.innerHTML = '<div>'+ node.GoalDescription + '</div>';
        ul.appendChild(parseNode(nodes[i]));
    }
    return ul;
}

// takes a node object and turns it into a <li>
function parseNode(node) {
    let li = document.createElement("LI");
    li.setAttribute("class", node.GoalType);
    // li.setAttribute("id", node.GoalID);
    li.innerHTML =
        '<input id= "' +
        node.GoalID +
        '" class="' +
        node.GoalType +
        '" value = "' +
        node.GoalContent +
        '" placeholder="New goal" note="' +
        node.GoalNote +
        '"' +
        "/>";

    //countID(node.GoalType);

    // recursion to add sub goal
    if (node.SubGoals) li.appendChild(parseNodes(node.SubGoals));
    return li;
}
/*Show JSON data on edit page end*/

/*Add new goal by pressing "Enter" start*/
document.onkeydown = function(event) {
    let goalID;
    let goalType;
    //when the user press the "enter" button
    if (document.activeElement.tagName === "INPUT" && event.key === "Enter") {
        //make the default enter invalid
        goalType = document.activeElement.attributes["class"].nodeValue;
        goalID = getID(goalType);
        event.preventDefault();

        let newlist =
            '<li><input id="' +
            goalID +
            '" class="' +
            goalType +
            '" placeholder="New goal" note="notes" value=""/></li>';

        if ($(event.target).parent().length > 0) {
            let parent = $(event.target).parent();
            parent.after(newlist);
        } else {
            $(event.target)
                .parent()
                .after(newlist);
        }
        $("#" + goalID).focus();
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
$("#save").submit(function(evt) {
    evt.preventDefault();
    let url = "";
    let data = window.jsonData;
    $.ajax(url, {
        data: data,
        type: "POST",
        success: function() {}
    }).fail(function(jqXHR) {
        if (jqXHR.statusText === "OK") {
            alert("Upload successfully");
        } else {
            alert(jqXHR.responseJSON.message);
        }
    }); // end ajax
}); // end submit
/*Send data to backend end*/

/*Get data from HTML to JSON start*/
function getData() {
    // var functionaldata = $("#functionaldata").ul.childNodes;
    // for (let i = 0; i < functionaldata.size(); i++) {
    //     console.log(functionaldata[i].textContent);
    // }
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
}
/*Get data from HTML to JSON end*/

// the mock JSON data
window.jsonData = {
    GoalModelProject: {
        UserID: "10001",
        GoalModelID: "1",
        ProjectName: "My first goal model",

        //Goal list: [five goal types][used goal][deleted goal]
        GoalList: {
            FunctionalNum: 1,
            EmotionalNum: 1,
            QualityNum: 1,
            NegativeNum: 1,
            StakeholderNum: 1,
            Functional: [
                {
                    GoalID: "F_1",
                    GoalType: "Functional",
                    GoalContent: "",
                    GoalNote: "Goal F_1 Note",
                    SubGoals: []
                }
            ],
            Quality: [
                {
                    GoalID: "Q_1",
                    GoalType: "Quality",
                    GoalContent: "",
                    GoalNote: "Goal Q_1 Note"
                }
            ],
            Emotional: [
                {
                    GoalID: "E_1",
                    GoalType: "Emotional",
                    GoalContent: "",
                    GoalNote: "Goal E_1 Note"
                }
            ],
            Negative: [
                {
                    GoalID: "N_1",
                    GoalType: "Negative",
                    GoalContent: "",
                    GoalNote: "Goal N_1 Note"
                }
            ],
            Stakeholder: [
                {
                    GoalID: "S_1",
                    GoalType: "Stakeholder",
                    GoalContent: "",
                    GoalNote: "Goal S_1 Note"
                }
            ]
        },

        Clusters: [
            {
                ClusterID: "cluster_1",
                ClusterGoals: [
                    {
                        GoalID: "F_1",
                        GoalType: "Functional",
                        GoalContent: "This is Functional Goal F_1",
                        GoalNote: "Goal F_1 Note",
                        SubGoals: []
                    },
                    {
                        GoalID: "F_2",
                        GoalType: "Functional",
                        GoalContent: "This is Functional Goal F_2",
                        GoalNote: "Goal F_2 Note",
                        SubGoals: []
                    },
                    {
                        GoalID: "F_3",
                        GoalType: "Functional",
                        GoalContent: "This is Functional Goal F_3",
                        GoalNote: "Goal F_3 Note",
                        SubGoals: [
                            {
                                GoalID: "F_4",
                                GoalType: "Functional",
                                GoalContent: "This is Functional Goal F_4",
                                GoalNote: "Goal F_4 Note",
                                SubGoals: []
                            },
                            {
                                GoalID: "E_2",
                                GoalType: "Emotional",
                                GoalContent: "This is Emotional Goal E_2",
                                GoalNote: "Goal E_2 Note"
                            },
                            {
                                GoalID: "Q_3",
                                GoalType: "Quality",
                                GoalContent: "This is Quality Goal Q_3",
                                GoalNote: "Goal Q_3 Note"
                            }
                        ]
                    }
                ]
            },
            {
                ClusterID: "cluster_2",
                ClusterGoals: [
                    {
                        GoalID: "E_2",
                        GoalType: "Emotional",
                        GoalContent: "This is Emotional Goal E_2",
                        GoalNote: "Goal E_2 Note"
                    },
                    {
                        GoalID: "Q_3",
                        GoalType: "Quality",
                        GoalContent: "This is Quality Goal Q_3",
                        GoalNote: "Goal Q_3 Note"
                    }
                ]
            }
        ]
    }
};
