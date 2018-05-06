/*import photos start*/
$(document).ready(function() {
    document.getElementById('pro-image').addEventListener('change', readImage, false);

    //$( ".preview-images-zone" ).sortable();

    $(document).on('click', '.image-cancel', function() {
        let no = $(this).data('no');
        $(".preview-image.preview-show-"+no).remove();
    });
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
window.jsonData = {
    "GoalModelProject":
        {
            "UserID":"10001",
            "ProjectID":"1" ,
            "ProjectName":"My first goal model",

            //Goal list: [five goal types][used goal][deleted goal]
            "GoalList":{
                "Functional":[
                    {
                        "GoalID":"F_1",
                        "GoalType":"Functional",
                        "GoalDescription":"This is Functional Goal F_1",
                        "SubGoals":[]
                    },
                    {
                        "GoalID":"F_2",
                        "GoalType":"Functional",
                        "GoalDescription":"This is Functional Goal F_2",
                        "SubGoals":[]
                    }
                ],
                "Quality":[
                    {
                        "GoalID":"Q_1",
                        "GoalType":"Quality",
                        "GoalDescription":"This is Quality Goal Q_1"
                    },
                    {
                        "GoalID":"Q_2",
                        "GoalType":"Quality",
                        "GoalDescription":"This is Quality Goal Q_2"
                    }
                ],
                "Emotional":[
                    {
                        "GoalID":"E_1",
                        "GoalType":"Emotional",
                        "GoalDescription":"This is Emotional Goal E_1"
                    },
                    {
                        "GoalID":"E_2",
                        "GoalType":"Emotional",
                        "GoalDescription":"This is Emotional Goal E_2"
                    }
                ],
                "Negative":[
                    {
                        "GoalID":"N_1",
                        "GoalType":"Negative",
                        "GoalDescription":"This is Negative Goal N_1"
                    },
                    {
                        "GoalID":"N_2",
                        "GoalType":"Negative",
                        "GoalDescription":"This is Negative Goal N_2"
                    }
                ],
                "Stakeholder":[
                    {
                        "GoalID":"S_1",
                        "GoalType":"Stakeholder",
                        "GoalDescription":"This is Stakeholder Goal S_1"
                    },
                    {
                        "GoalID":"S_2",
                        "GoalType":"Stakeholder",
                        "GoalDescription":"This is Stakeholder Goal S_2"
                    }
                ],
                "UsedGoal":[
                    {
                        "GoalID":"S_1",
                        "GoalType":"Stakeholder",
                        "GoalDescription":"This is Stakeholder Goal S_1"
                    },
                    {
                        "GoalID":"S_2",
                        "GoalType":"Stakeholder",
                        "GoalDescription":"This is Stakeholder Goal S_2"
                    }
                ],
                "DeletedGoal":[
                    {
                        "GoalID":"S_1",
                        "GoalType":"Stakeholder",
                        "GoalDescription":"This is Stakeholder Goal S_1"
                    },
                    {
                        "GoalID":"S_2",
                        "GoalType":"Stakeholder",
                        "GoalDescription":"This is Stakeholder Goal S_2"
                    }
                ]
            },

            //Cluster
            "Cluster":[
                {
                    "ClusterID":"1",
                    "ClusterGoals":[
                        {
                            "GoalID":"1_1",
                            "GoalType":"Functional",
                            "GoalDescription":"This is Functional Goal 1_1",
                            "SubGoals":[]
                        },
                        {
                            "GoalID":"1_2",
                            "GoalType":"Functional",
                            "GoalDescription":"This is Functional Goal 1_2",
                            "SubGoals":[]
                        },
                        {
                            "GoalID":"1_3",
                            "GoalType":"Functional",
                            "GoalDescription":"This is Functional Goal 1_3",

                            "SubGoals":[
                                {
                                    "GoalID":"1_3_1",
                                    "GoalType":"Functional",
                                    "GoalDescription":"This is Functional Goal 1_3_1",
                                    "SubGoals":[]
                                },
                                {
                                    "GoalID":"1_3_2",
                                    "GoalType":"Emotional",
                                    "GoalDescription":"This is Emotional Goal 1_3_2"
                                },
                                {
                                    "GoalID":"1_3_3",
                                    "GoalType":"Quality",
                                    "GoalDescription":"This is Quality Goal 1_3_3"
                                }
                            ]
                        }
                    ]

                },
                {
                    "ClusterID":"2",
                    "ClusterGoals":[]
                },
                {
                    "ClusterID":"3",
                    "ClusterGoals":[]
                }
            ],

            //Hierarchy
            "Hierarchy":{
                "MainGoal":[
                    {
                        "GoalID":"1",
                        "GoalType":"Functional",
                        "GoalDescription":"This is Main Goal 1",

                        "SubGoals":[
                            {
                                "GoalID":"1_1",
                                "GoalType":"Functional",
                                "GoalDescription":"This is Functional Goal 1_1",
                                "SubGoals":[]
                            },
                            {
                                "GoalID":"1_2",
                                "GoalType":"Functional",
                                "GoalDescription":"This is Functional Goal 1_2",
                                "SubGoals":[]
                            },
                            {
                                "GoalID":"1_3",
                                "GoalType":"Functional",
                                "GoalDescription":"This is Functional Goal 1_3",

                                "SubGoals":[
                                    {
                                        "GoalID":"1_3_1",
                                        "GoalType":"Functional",
                                        "GoalDescription":"This is Functional Goal 1_3_1",
                                        "SubGoals":[]
                                    },
                                    {
                                        "GoalID":"1_3_2",
                                        "GoalType":"Emotional",
                                        "GoalDescription":"This is Emotional Goal 1_3_2"
                                    },
                                    {
                                        "GoalID":"1_3_3",
                                        "GoalType":"Quality",
                                        "GoalDescription":"This is Quality Goal 1_3_3"
                                    }
                                ]
                            }
                        ]
                    }]
            }

        }
};
/*JSON data end*/

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
}
/*Load data end*/

/*Show JSON data on Goal list start*/
function parseNodes(nodes) { // takes a nodes array and turns it into a <ol>
    var ol = document.createElement("UL");
    for(var i=0; i<nodes.length; i++) {
        ol.appendChild(parseNode(nodes[i]));
    }
    return ol;
}
function parseNode(node) { // takes a node object and turns it into a <li>
    var li = document.createElement("LI");
    li.innerHTML = '<div>'+ node.GoalDescription + '</div>';
    li.className = node.GoalType;
    if(node.SubGoals) li.appendChild(parseNodes(node.SubGoals));
    return li;
}
/*Show JSON data on Goal list end*/


/*Add new Cluster start*/
function addCluster(){

}
/*Add new Cluster end*/


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