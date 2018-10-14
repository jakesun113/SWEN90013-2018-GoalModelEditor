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
            getModelInfo();
            loadData();
            loadImages();
            //activate drag function
            getDraggingElement();
            //at first, trigger addNoChildrenClass method
            addNoChildrenClass();
            //activate nestable2 function
            $(".dd").nestable({

                onDragStart: function (l, e) {
                    // get type of dragged element
                    // let type = $(e).children(".dd-handle").attr("class").split(" ")[0];
                    // console.log(type);
                    //at first, trigger addNoChildrenClass method
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
            getXML();
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

/**
 * get model info from backend according to userId and modelId
 */
function getModelInfo() {
    let secret = JSON.parse(Cookies.get("LOKIDIED"));
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/info/" + userId + "/" + modelId;
    $.ajax(url, {
        // the API of upload pictures
        type: "GET",
        headers: {Authorization: "Bearer " + token},
        success: function (data) {
            let modelName = data.ProjectName +
                " - " +
                data.ModelName;
            $("#model_name strong").html(modelName);
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

/*current active element to delete*/
let activeElement;
/*set cluster number*/
let clusterNumber = 1;

/*Load data start*/
/**
 * load goals from JSON
 */
function loadData() {
    $("#notetext").val(jsonData.GoalModelProject.notes);

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
    li.setAttribute("onmouseenter", "showBtnInList(this)");
    li.setAttribute("onmouseleave", "hideBtnInList(this)");
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
        "/>" +
        '<img class="deleteBtnInList" style="display: none" src="/img/trash-alt-solid.svg"' +
        ' onclick="deleteGoalInList(this)"' +
        '/>';

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
        ' onmouseenter="showButton(this)" ' +
        ' onmouseleave="hideButton(this)" note="' +
        node.GoalNote +
        '"' +
        ">" +
        '<img src="' + iconPath + '" class="mr-1 typeIcon">' +
        '<div class="goal-content"  tabindex="-1" ' +
        'onblur="finishEditGoalInCluster($(this));">' + node.GoalContent + '</div>' +
        '<img class="editButton" style="display: none" src="/img/edit-solid.svg"' +
        ' onclick="event.stopImmediatePropagation(); editGoalInCluster(this)"' +
        ' onmousemove="event.stopImmediatePropagation()" onmouseup="event.stopImmediatePropagation()"' +
        ' onmousedown="event.stopImmediatePropagation()"/>' +
        '<img class="deleteButton" style="display: none" src="/img/trash-alt-solid.svg"' +
        ' onclick="event.stopImmediatePropagation(); handleDeleteGoalInCluster(this)"' +
        ' onmousemove="event.stopImmediatePropagation()" onmouseup="event.stopImmediatePropagation()"' +
        ' onmousedown="event.stopImmediatePropagation()"/>' +
        "</div>";

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
    // save note
    let notedata = $("#notetext").val();
    model.GoalModelProject.Notes = notedata;
    let token = secret.token;
    let userId = secret.uid;
    let modelId = Cookies.get("MID");
    let url = "/goal_model/" + userId + "/" + modelId;
    $("#saveJSONLoading").show();
    $("#savingLabel").show();
    $("#savedLabel").hide();

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
                $("#savingLabel").hide();
                $("#savedLabel").show();
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
        // && !($goalList.attr("class").includes("collapsed"))
       ) {
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
 * Make goals in cluster editable by clicking the edit icon
 *
 */
function editGoalInCluster(element) {
    $(".dd-handle-style").removeClass("dd-handle");
    $(".dd-handle-style").css("cursor", "auto");
    let target = $(element.parentNode).children(".goal-content");
    target.attr("contenteditable", "true");
    // when editing, if press "Enter", finish editing
    target.keypress(function (e) {
        if (e.which === 13) {
            e.preventDefault();
            finishEditGoalInCluster(target);
        }
    });
    $(element.parentNode).css("background-color", "rgba(0,0,0,0.1)");
    setCaret(target[0]);

    target.css("font-weight", "normal");
}

/**
 * If do something else, make div not editable again
 *
 */
function finishEditGoalInCluster($element) {
    //console.log("in finish");
    $(".dd-handle-style").addClass("dd-handle");
    $(".dd-handle-style").css("cursor", "move");
    $element.attr("contenteditable", "false");
    $element.css("font-weight", "bold");
    $element.parent().css("background-color", "#fafafa");
    //save the contents when finishing editing
    saveJSON();
}

/**
 * handle function when clicking "delete goal" button
 *
 */
function handleDeleteGoalInCluster(element) {
    //console.log(element);
    $(".dd-handle-style").removeClass("dd-handle");
    $(".dd-handle-style").css("cursor", "auto");
    //make the default enter invalid
    let ddHandleDiv = element.parentNode;
    let ddItemLi = ddHandleDiv.parentNode;
    //set current active element
    activeElement = ddItemLi;

    //if this target goal has child, trigger the warning
    if ($(ddItemLi).children("ol").length) {
        $("#deleteGoalWithChildWarning").modal();
    }
    //otherwise, delete that goal
    else {
        deleteGoalInCluster(activeElement);
    }
}

/**
 * delete goals in the cluster
 *
 */
function deleteGoalInCluster(element) {

    let ddListOl = element.parentNode;
    //if parent not null, delete child
    if (ddListOl.childNodes.length > 0) {
        ddListOl.removeChild(element);
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

/**
 * SetCaret to the end of the div
 */
function setCaret(div) {
    let length = $(div).html().length;
    let range = document.createRange();
    let sel = window.getSelection();
    range.setStart(div.childNodes[0], length);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
}