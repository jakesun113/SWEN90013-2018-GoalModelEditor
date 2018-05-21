/*import photos start*/
$(document).ready(function() {
    document.getElementById('pro-image').addEventListener('change', readImage, false);
    $(document).on('click', '.image-cancel', function() {
        let no = $(this).data('no');
        $(".preview-image.preview-show-"+no).remove();
    });
    $('#username').eq(0).html(Cookies.get('UIID'));
});


var num = 1;
function readImage() {
    if (window.File && window.FileList && window.FileReader) {
        var files = event.target.files; //FileList object
        var output = $(".preview-images-zone");

        for (let i = 0; i < files.length; i++) {
            var file = files[i];
            if (!file.type.match('image')) continue;

            var picReader = new FileReader();
            picReader.addEventListener('load', function (event) {
                var picFile = event.target;
                var html =  '<div class="preview-image preview-show-' + num + '">' +
                    '<div class="image-cancel" data-no="' + num + '">x</div>' +
                    '<div class="image-zone"><img id="pro-img-' + num + '" src="' + picFile.result + '"></div>' +
                    // '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' + num + '" class="btn btn-light btn-edit-image">edit</a></div>' +
                    '</div>';

                output.append(html);
                num = num + 1;
            });
            picReader.readAsDataURL(file);
        }
        $("#pro-image").val('');
    } else {
        console.log('Browser not support');
    }
}
/*import photos end*/

/*JSON data start*/
// window.jsonData = {
//     "GoalModelProject":
//         {
//             "UserID":"10001",
//             "ProjectID":"1" ,
//             "ProjectName":"My first goal model",
//
//             //Goal list: [five goal types][used goal][deleted goal]
//             "GoalList":{
//                 "FunctionalNum":3,
//                 "EmotionalNum":3,
//                 "QualityNum":3,
//                 "NegativeNum":2,
//                 "StakeholderNum":2,
//                 "Functional":[
//                     {
//                         "GoalID":"F_1",
//                         "GoalType":"Functional",
//                         "GoalDescription":"This is Functional Goal F_1",
//                         "SubGoals":[]
//                     },
//                     {
//                         "GoalID":"F_2",
//                         "GoalType":"Functional",
//                         "GoalDescription":"This is Functional Goal F_2",
//                         "SubGoals":[]
//                     },
//                     {
//                         "GoalID":"F_3",
//                         "GoalType":"Functional",
//                         "GoalDescription":"This is Functional Goal F_3",
//                         "SubGoals":[]
//                     }
//                 ],
//                 "Quality":[
//                     {
//                         "GoalID":"Q_1",
//                         "GoalType":"Quality",
//                         "GoalDescription":"This is Quality Goal Q_1"
//                     },
//                     {
//                         "GoalID":"Q_2",
//                         "GoalType":"Quality",
//                         "GoalDescription":"This is Quality Goal Q_2"
//                     }
//                 ],
//                 "Emotional":[
//                     {
//                         "GoalID":"E_1",
//                         "GoalType":"Emotional",
//                         "GoalDescription":"This is Emotional Goal E_1"
//                     },
//                     {
//                         "GoalID":"E_2",
//                         "GoalType":"Emotional",
//                         "GoalDescription":"This is Emotional Goal E_2"
//                     }
//                 ],
//                 "Negative":[
//                     {
//                         "GoalID":"N_1",
//                         "GoalType":"Negative",
//                         "GoalDescription":"This is Negative Goal N_1"
//                     },
//                     {
//                         "GoalID":"N_2",
//                         "GoalType":"Negative",
//                         "GoalDescription":"This is Negative Goal N_2"
//                     }
//                 ],
//                 "Stakeholder":[
//                     {
//                         "GoalID":"S_1",
//                         "GoalType":"Stakeholder",
//                         "GoalDescription":"This is Stakeholder Goal S_1"
//                     },
//                     {
//                         "GoalID":"S_2",
//                         "GoalType":"Stakeholder",
//                         "GoalDescription":"This is Stakeholder Goal S_2"
//                     }
//                 ],
//                 "UsedGoal":[
//                     {
//                         "GoalID":"S_1",
//                         "GoalType":"Stakeholder",
//                         "GoalDescription":"This is Stakeholder Goal S_1"
//                     },
//                     {
//                         "GoalID":"S_2",
//                         "GoalType":"Stakeholder",
//                         "GoalDescription":"This is Stakeholder Goal S_2"
//                     }
//                 ],
//                 "DeletedGoal":[
//                     {
//                         "GoalID":"S_1",
//                         "GoalType":"Stakeholder",
//                         "GoalDescription":"This is Stakeholder Goal S_1"
//                     },
//                     {
//                         "GoalID":"S_2",
//                         "GoalType":"Stakeholder",
//                         "GoalDescription":"This is Stakeholder Goal S_2"
//                     }
//                 ]
//             },
//
//             //Cluster
//             "Cluster":[
//                 {
//                     "ClusterID":"cluster_1",
//                     "ClusterGoals":[
//                         {
//                             "GoalID":"F_1",
//                             "GoalType":"Functional",
//                             "GoalDescription":"This is Functional Goal F_1",
//                             "SubGoals":[]
//                         },
//                         {
//                             "GoalID":"F_2",
//                             "GoalType":"Functional",
//                             "GoalDescription":"This is Functional Goal F_2",
//                             "SubGoals":[]
//                         },
//                         {
//                             "GoalID":"F_3",
//                             "GoalType":"Functional",
//                             "GoalDescription":"This is Functional Goal F_3",
//
//                             "SubGoals":[
//                                 {
//                                     "GoalID":"F_1",
//                                     "GoalType":"Functional",
//                                     "GoalDescription":"This is Functional Goal F_1",
//                                     "SubGoals":[]
//                                 },
//                                 {
//                                     "GoalID":"E_2",
//                                     "GoalType":"Emotional",
//                                     "GoalDescription":"This is Emotional Goal E_2"
//                                 },
//                                 {
//                                     "GoalID":"Q_3",
//                                     "GoalType":"Quality",
//                                     "GoalDescription":"This is Quality Goal Q_3"
//                                 }
//                             ]
//                         }
//                     ]
//
//                 },
//                 {
//                     "ClusterID":"cluster_2",
//                     "ClusterGoals":[
//                         {
//                             "GoalID":"E_2",
//                             "GoalType":"Emotional",
//                             "GoalDescription":"This is Emotional Goal E_2"
//                         },
//                         {
//                             "GoalID":"Q_3",
//                             "GoalType":"Quality",
//                             "GoalDescription":"This is Quality Goal Q_3"
//                         }
//                     ]
//                 },
//                 {
//                     "ClusterID":"cluster_3",
//                     "ClusterGoals":[
//                         {
//                             "GoalID":"E_2",
//                             "GoalType":"Emotional",
//                             "GoalDescription":"This is Emotional Goal E_2"
//                         },
//                         {
//                             "GoalID":"Q_3",
//                             "GoalType":"Quality",
//                             "GoalDescription":"This is Quality Goal Q_3"
//                         }
//                     ]
//                 },
//                 {
//                     "ClusterID":"cluster_4",
//                     "ClusterGoals":[
//                         {
//                             "GoalID":"E_2",
//                             "GoalType":"Emotional",
//                             "GoalDescription":"This is Emotional Goal E_2"
//                         },
//                         {
//                             "GoalID":"Q_3",
//                             "GoalType":"Quality",
//                             "GoalDescription":"This is Quality Goal Q_3"
//                         }
//                     ]
//                 },
//                 {
//                     "ClusterID":"cluster_5",
//                     "ClusterGoals":[]
//                 }
//             ],
//
//             //Hierarchy
//             "Hierarchy":{
//                 "MainGoal":[
//                     {
//                         "GoalID":"F_1",
//                         "GoalType":"Functional",
//                         "GoalDescription":"This is Functional Goal F_1",
//
//                         "SubGoals":[
//                             {
//                                 "GoalID":"F_2",
//                                 "GoalType":"Functional",
//                                 "GoalDescription":"This is Functional Goal F_2",
//                                 "SubGoals":[]
//                             },
//                             {
//                                 "GoalID":"F_3",
//                                 "GoalType":"Functional",
//                                 "GoalDescription":"This is Functional Goal F_3",
//                                 "SubGoals":[]
//                             },
//                             {
//                                 "GoalID":"F_4",
//                                 "GoalType":"Functional",
//                                 "GoalDescription":"This is Functional Goal F_4",
//
//                                 "SubGoals":[
//                                     {
//                                         "GoalID":"F_5",
//                                         "GoalType":"Functional",
//                                         "GoalDescription":"This is Functional Goal F_5",
//                                         "SubGoals":[]
//                                     },
//                                     {
//                                         "GoalID":"E_2",
//                                         "GoalType":"Emotional",
//                                         "GoalDescription":"This is Emotional Goal E_2"
//                                     },
//                                     {
//                                         "GoalID":"Q_3",
//                                         "GoalType":"Quality",
//                                         "GoalDescription":"This is Quality Goal Q_3"
//                                     }
//                                 ]
//                             }
//                         ]
//                     }]
//             }
//
//         }
// };
/*JSON data end*/

/*Count goals num*/
var FunctionalNum = 0;
var EmotionalNum = 0;
var NegativeNum = 0;
var QualityNum = 0;
var StakeholderNum = 0;

/*Three clusters at start*/
var clusterNumber = 3;

/*Load data start*/
function loadData() {
    document.getElementById("functionaldata").appendChild(parseNodes(jsonData.GoalModelProject.GoalList.Functional));
    document.getElementById("qualitydata").appendChild(parseNodes(jsonData.GoalModelProject.GoalList.Quality));
    document.getElementById("emotionaldata").appendChild(parseNodes(jsonData.GoalModelProject.GoalList.Emotional));
    document.getElementById("negativedata").appendChild(parseNodes(jsonData.GoalModelProject.GoalList.Negative));
    document.getElementById("stakeholderdata").appendChild(parseNodes(jsonData.GoalModelProject.GoalList.Stakeholder));
    document.getElementById("usedgoaldata").appendChild(parseNodes(jsonData.GoalModelProject.GoalList.UsedGoal));
    document.getElementById("deletedgoaldata").appendChild(parseNodes(jsonData.GoalModelProject.GoalList.DeletedGoal));
    document.getElementById("hierarchydata").appendChild(parseNodes(jsonData.GoalModelProject.Hierarchy.MainGoal));
    FunctionalNum = jsonData.GoalModelProject.GoalList.FunctionalNum;
    EmotionalNum = jsonData.GoalModelProject.GoalList.EmotionalNum;
    QualityNum = jsonData.GoalModelProject.GoalList.QualityNum;
    NegativeNum = jsonData.GoalModelProject.GoalList.NegativeNum;
    StakeholderNum = jsonData.GoalModelProject.GoalList.StakeholderNum;
    loadCluster();
}

/*Load data end*/

/*Add new cluster start*/
function loadCluster(){
    var clusterNum = jsonData.GoalModelProject.Cluster.length;
    if(clusterNum>3){
        for (var i=0;i<(clusterNum-3);i++){
            addCluster();
        }
    }

    for(var i=0;i<clusterNum;i++){
        var clusterID = jsonData.GoalModelProject.Cluster[i].ClusterID;
        document.getElementById(clusterID).appendChild(parseNodes(jsonData.GoalModelProject.Cluster[i].ClusterGoals));
    }
}
/*Add new cluster end*/

/*Add new cluster start*/
function addCluster(){
    var cluster = $("#cluster");
    clusterNumber++;

    cluster.append('<div class="cluster showborder inside-scrollbar bgwhite" id=cluster_'+clusterNumber.toString()+'>'+'</div>');
}
/*Add new cluster end*/

/*Show JSON data on edit page start*/
// takes a nodes array and turns it into a <ul>
function parseNodes(nodes) {
    var ul = document.createElement("UL");
    for(var i=0; i<nodes.length; i++) {
        //ul.innerHTML = '<div>'+ node.GoalDescription + '</div>';
        ul.appendChild(parseNode(nodes[i]));
    }
    return ul;
}
// takes a node object and turns it into a <li>
function parseNode(node) {
    var li = document.createElement("LI");
    li.setAttribute("class", node.GoalType);
    li.setAttribute("id", node.GoalID);
    li.innerHTML = '<input id= "'+node.GoalID+'" class="'+node.GoalType+'" value = "'+node.GoalDescription+'" placeholder="New goal"' + '/>';
    //countID(node.GoalType);
    if(node.SubGoals) li.appendChild(parseNodes(node.SubGoals));
    return li;
}
/*Show JSON data on edit page end*/

/*Add new goal by pressing "Enter" start*/
document.onkeydown=function(event) {
    var goalID;
    var goalType;
    //when the user press the "enter" button
    if (document.activeElement.tagName === 'INPUT' && event.key === "Enter") {
        //make the default enter invalid
        goalType = document.activeElement.attributes['class'].nodeValue;
        goalID = getID(goalType);
        event.preventDefault();
        var newlist = '<li id=L_"'+goalID+'"><input id="'+goalID+'" class="'+goalType+'" placeholder="New goal"/></li>';
        if ($(event.target).parent().length > 0) {
            var parent = $(event.target).parent();
            parent.after(newlist);
        }
        else {
            $(event.target).parent().after(newlist);
        }
        $('#'+goalID).focus();
    }
};

function getID(type) {
    switch (type){
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
document.onkeyup=function(event) {
    var goalID;
    //when the user press the "enter" button
    if (document.activeElement.tagName === 'INPUT' && event.key === "Escape") {
        //make the default enter invalid
        var parent = document.activeElement.parentNode;
        var grandparent = parent.parentNode;
        if(parent.previousElementSibling != null){
            grandparent.removeChild(parent);
            event.preventDefault();
        }

    }
};
/*Delete goal by pressing "Backspace" when empty end*/

/*Hide and show section start*/
function photonextbtn() {
    var p = document.getElementById("photo");
    var goal = document.getElementById("goals");
    var u = document.getElementById("usedgoal");
    var d = document.getElementById("deletedgoal")
    var c = document.getElementById("cluster");
    var h = document.getElementById("hierarchy");
    // var g = document.getElementById("generator");
    var b = document.getElementById("photonextbtn");

    if (p.style.display === "none") {
        p.style.display = "block";
        u.style.display = "none";
        d.style.display = "none";
        c.style.display = "none";
        h.style.display = "none";
        // g.style.display = "none";
        b.innerHTML = "Next";
    } else {
        p.style.display = "none";
        // goal.removeAttributeNode("style");
        // goal.addAttributes("goalscrollbar");
        u.style.display = "block";
        d.style.display = "block";
        c.style.display = "block";
        h.style.display = "block";
        // g.style.display = "block";
        b.innerHTML = "Back";
    }
}

function hierachynextbtn() {
    var p = document.getElementById("photo");
    var t = document.getElementById("todolist");
    var c = document.getElementById("cluster");
    var h = document.getElementById("hierarchy");
    var g = document.getElementById("generator");
    var b = document.getElementById("hierachynextbtn");

    if (h.style.display === "none") {
        p.style.display = "none";
        t.style.display = "block"
        c.style.display = "block";
        h.style.display = "block";
        g.style.display = "none";
        b.innerHTML = "Next";
    } else {
        p.style.display = "none";
        t.style.display = "none"
        c.style.display = "none";
        h.style.display = "none";
        g.style.display = "block";
        b.innerHTML = "Back";
    }
}
/*Hide and show section end*/

/*Get data from HTML to JSON start*/

/*Get data from HTML to JSON end*/

window.jsonData = {
    "GoalModelProject":
        {
            "UserID":"10001",
            "ProjectID":"1" ,
            "ProjectName":"My first goal model",

            //Goal list: [five goal types][used goal][deleted goal]
            "GoalList":{
                "FunctionalNum":1,
                "EmotionalNum":1,
                "QualityNum":1,
                "NegativeNum":1,
                "StakeholderNum":1,
                "Functional":[
                    {
                        "GoalID":"F_1",
                        "GoalType":"Functional",
                        "GoalDescription":"",
                        "SubGoals":[]
                    }
                ],
                "Quality":[
                    {
                        "GoalID":"Q_1",
                        "GoalType":"Quality",
                        "GoalDescription":""
                    },
                ],
                "Emotional":[
                    {
                        "GoalID":"E_1",
                        "GoalType":"Emotional",
                        "GoalDescription":""
                    },
                ],
                "Negative":[
                    {
                        "GoalID":"N_1",
                        "GoalType":"Negative",
                        "GoalDescription":""
                    },
                ],
                "Stakeholder":[
                    {
                        "GoalID":"S_1",
                        "GoalType":"Stakeholder",
                        "GoalDescription":""
                    },
                ],

            },


        }
};