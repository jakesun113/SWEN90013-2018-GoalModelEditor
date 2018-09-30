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
        headers: {Authorization: "Bearer " + token},
        success: function (data) {
            window.jsonData = JSON.parse(JSON.parse(JSON.stringify(data)));
            let modelName = jsonData.GoalModelProject.ProjectName +
                " - " +
                jsonData.GoalModelProject.ModelName;
            $("#model_name strong").html(modelName);
            loadData();
            loadImages();
            //activate drag function
            getDraggingElement();

            addNoChildrenClass();

            $(".dd").nestable({

                onDragStart: function (l, e) {
                    // get type of dragged element
                    var type = $(e).children(".dd-handle").attr("class").split(" ")[0];
                    console.log(type);
                    addNoChildrenClass();
                },

                callback: function (l, e) {
                    // l is the main container
                    // e is the element that was moved
                    appendCluster();
                    removeCluster();
                },
                scroll: true
            });
            getXML();
            setTitle(modelName);
        }
    }).fail(function (jqXHR) {
        $("#warning-alert").html(
            jqXHR.responseJSON.message + " <br>Please try again."
        );
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}

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
    appendCluster();
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
        let clusterID = "cluster_" + (i + 1);
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
    li.setAttribute("class", "dragger" + " drag-style");
    li.setAttribute("draggable", "true");
    let fontWeight = "bold";
    if (node.Used) {
        fontWeight = "normal";
    }
    let placeholderText = getPlaceholder(node.GoalType);


    // li.setAttribute('id', node.GoalID);
    li.innerHTML =
        '<input id= "' +
        node.GoalID +
        '" class="' +
        node.GoalType +
        " " +
        '" value = "' +
        node.GoalContent +
        '" placeholder="' + placeholderText + '" ' +
        'style="font-weight: ' +
        fontWeight +
        '" ' +
        'note="' +
        node.GoalNote +
        '" ' +
        'oninput="changeFontWeight(this)"' +
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

    let iconPath = getTypeIconPath(node.GoalType);

    li.innerHTML =
        '<div id= "' +
        node.GoalID +
        '" class="' +
        node.GoalType +
        " dd-handle dd-handle-style" + '" ' +
        'note="' +
        node.GoalNote +
        '"' +
        ">" +
        '<img src="' + iconPath + '" class="mr-1 typeIcon">' +
        '<div class="goal-content"  tabindex="-1" ' +
        'onblur="finishEditGoalInCluster(this);">' + node.GoalContent + '</div>' +
        "</div>" +
        '<button class="btn btn-outline-primary" onclick="editGoalInCluster(this)">' + "edit" +'</button>';

    // recursion to add sub goal
    if (node.SubGoals !== undefined && node.SubGoals.length > 0) {
        // make sure NOT showing two or more sets data-action buttons
        $(li).children("[data-action]").remove();
        $(li).prepend($('<button class="dd-expand" data-action="expand">Expand</button>'));
        $(li).prepend($('<button class="dd-collapse" data-action="collapse">Collapse</button>'));

        li.appendChild(parseClusterNodes(node.SubGoals));
    }

    return li;
}

/*parse Cluster node end*/

/**
 * save goal model to backend
 */
function saveJSON() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let model = window.jsonData;
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/" + userId + "/" + modelId;
    $("#saveJSONLoading").show();
    $("#savedLabel").show();

    getData();
    // ajax starts
    $.ajax(url, {
        type: "PUT",
        data: JSON.stringify(model),
        dataType: "json",
        contentType: "application/json",
        headers: {Authorization: "Bearer " + token},
        success: function (data) {
            setTimeout(function () {
                $("#saveJSONLoading").hide();
                $("#savedLabel").hide();
            }, 1000);
        }
    }).fail(function (jqXHR) {
        $("#saveJSONLoading").hide();
        $("#warning-alert").html("Save Failed.<br>Please try again.");
        $("#warning-alert")
            .slideDown()
            .delay(3000)
            .slideUp();
    }); // end ajax
}

/*Send data to backend end*/

/*Get data from HTML to JSON start */
/**
 * get data from HTML to JSON
 */
function getData() {
    // get all data from HTML (in goal list)
    let functionalData = $($("#functionaldata").children("ul")[0]).children(
        "li"
    );
    let qualityData = $($("#qualitydata").children("ul")[0]).children("li");
    let emotionalData = $($("#emotionaldata").children("ul")[0]).children(
        "li"
    );
    let negativeData = $($("#negativedata").children("ul")[0]).children("li");
    let stakeholderData = $($("#stakeholderdata").children("ul")[0]).children(
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
    listParseGoalsToJSON(negativeData, negativeList, "Negative");
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
        if ($cluster.children("ol").length > 0) {
            let listItems = $($cluster.children("ol")).children("li");
            let $listItems = $(listItems);
            // iterate all list items and their subgoals if there is one
            for (let i = 0; i < $listItems.length; i++) {
                let $goal = $($(listItems[i]).children("div")[0]);
                let type = getType($goal);
                let goals = [];
                if ($($(listItems[i]).children("ol")).length !== 0) {
                    getAllSubgoals($(listItems[i]), goals);
                } else {
                    let innerClusterGoalJSON = clusterParseGoalToJSON(
                        $goal.attr("id"),
                        type,
                        $($goal.children("div")[0]).html(),
                        $goal.attr("note"),
                        []
                    );
                    goals.push(innerClusterGoalJSON);
                }
                // console.log(goals);
                clusterJSON.ClusterGoals.push(goals[0]);
            }
            clusterList.push(clusterJSON);
        }
        // console.log(clusterJSON);

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
        if ($goal.css("font-weight") === "400") {
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

/**
 * based on the goal type, set different placeholder
 * @param {string} type of the goal
 * @returns {string} corresponding placeholder
 */
function getPlaceholder(type) {
    switch (type) {
        case "Functional":
            return "New Functional Goal";
        case "Quality":
            return "New Quality Goal";
        case "Negative":
            return "New Negative Goal";
        case "Emotional":
            return "New Emotional Goal";
        case "Stakeholder":
            return "New Role";
        default:
            return "";
    }
}

/* Get all sub goals of a goal in the cluster start*/
/**
 * Use recursive function to get all subgoals
 * @param $goalList
 * @param goals
 */
function getAllSubgoals($goalList, goals) {
    let $goal = $($goalList.children("div")[0]);
    let type = getType($goal);
    let newSubGoals = [];
    let innerClusterGoalJSON = clusterParseGoalToJSON(
        $goal.attr("id"),
        type,
        $($goal.children("div")[0]).html(),
        $goal.attr("note"),
        newSubGoals
    );
    if ($($goalList.children("ol")).length !== 0
        && !($goalList.attr("class").includes("collapsed"))) {
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

/**
 * change font weight to bold when edit
 * @param e
 */
function changeFontWeight(e) {
    e.style.fontWeight = "bold";
}

/**
 *
 * @param {String} type of the goal
 * @return {String} icon path of the corresponding type
 */
function getTypeIconPath(type) {
    switch (type) {
        case "Functional":
            return PATH_FUNCTIONAL;
        case "Quality":
            return PATH_QUALITY;
        case "Negative":
            return PATH_NEGATIVE;
        case "Emotional":
            return PATH_EMOTIONAL;
        case "Stakeholder":
            return PATH_STAKEHOLDER;
        default:
            return "";
    }
}

/**
 * Helper function to set the title of the page
 *
 * @param {String} title
 */
function setTitle(title) {
    $("title").eq(0).html(title);
}

/**
 * Set non-functional goals cannot have children
 *
 */
function addNoChildrenClass() {
    $(".Quality").parent().addClass('dd-nochildren');
    $(".Negative").parent().addClass('dd-nochildren');
    $(".Emotional").parent().addClass('dd-nochildren');
    $(".Stakeholder").parent().addClass('dd-nochildren');
}

/**
 * Make goals in cluster editable by double click
 *
 */
function editGoalInCluster(element){
    console.log("in content");
    console.log(element);
    $(".dd-handle-style").removeClass("dd-handle");
    $(".dd-handle-style").css("cursor", "auto");
    let target = $(element.parentNode).children(".dd-handle-style").children(".goal-content");
    target.attr("contenteditable", "true");
    // when editing, cannot press "Enter"
    target.keypress(function (e) {
        return e.which !== 13;
    });

    target.css("font-weight", "normal");
}
/**
 * If do something else, make div not editable again
 *
 */
function finishEditGoalInCluster(element){
    //console.log("in finish");
    $(".dd-handle-style").addClass("dd-handle");
    $(".dd-handle-style").css("cursor", "move");
    $(element).attr("contenteditable", "false");
    $(element).css("font-weight", "bold");
    saveJSON();
}