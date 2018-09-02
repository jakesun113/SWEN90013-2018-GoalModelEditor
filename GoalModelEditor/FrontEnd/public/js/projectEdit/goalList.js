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
            getXML();
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
        '" value = "' +
        node.GoalContent +
        '" placeholder="New goal" style="font-weight: ' +
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
        " dd-handle dd-handle-style" + '"' +
        'note="' +
        node.GoalNote +
        '"' +
        ">" +
        '<img src="' + iconPath +'" class="mr-1 typeIcon">' +
        '<div class="goal-content">' + node.GoalContent + '</div>' +
        "</div>";

    // recursion to add sub goal
    if (node.SubGoals !== undefined && node.SubGoals.length > 0) {
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
}
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
    switch(type){
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