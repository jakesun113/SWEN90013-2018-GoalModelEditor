"use strict";

// keybindings
const DELETE_KEYBINDING = 8;

// default width/height of MM symbols
const SYMBOL_WIDTH = 145;
const SYMBOL_HEIGHT = 110;

// default vertical/horizontal spacing between functional goals
const VERTICAL_SPACING = 60;
const HORIZONTAL_SPACING = 60;

// default x and y coord of the MM symbols
const SYMBOL_X_COORD = 0;
const SYMBOL_Y_COORD = 0;

// size of the children functional goals
// relative to the parent goal
const CHILD_SIZE_SCALE = 0.8;

// width and height of the non-functional goals
// relative to the associated functional goal
const SW_EMOTIONAL = 1;
const SH_EMOTIONAL = 1;
const SW_QUALITY = 1;
const SH_QUALITY = 1;
const SW_NEGATIVE = 1;
const SH_NEGATIVE = 1;
const SW_STAKEHOLDER = 0.40;
const SH_STAKEHOLDER = 0.8;

// different types of goals to be rendered
const TYPE_FUNCTIONAL = "Functional";
const TYPE_EMOTIONAL = "Emotional";
const TYPE_NEGATIVE = "Negative";
const TYPE_QUALITY = "Quality";
const TYPE_STAKEHOLDER = "Stakeholder";

// paths to the images of the different types
const PATH_FUNCTIONAL = "/src/images/Function.png";
const PATH_EMOTIONAL = "/src/images/Heart.png";
const PATH_NEGATIVE = "/src/images/Risk.png";
const PATH_QUALITY = "/src/images/Cloud.png";
const PATH_STAKEHOLDER = "/src/images/Stakeholder.png";

// random string, used to store unassociated non-functions in accumulators
const ROOT_KEY = "0723y450nv3-2r8mchwouebfioasedfiadfg";

// variable, stores the identity of the root function
var rootGoal = null;

// accumulators for non-functional goals
var emotionsGlob = {};
var negativesGlob = {};
var qualitiesGlob = {};
var stakeholdersGlob = {};

// create the graph object
var graph = new mxGraph(document.getElementById("graphContainer"));
graph.setPanning(true);
graph.panningHandler.useLeftButtonForPanning = true;
graph.dropEnabled = true;
graph.setConnectable(true);
graph.setMultigraph(true);


// set default edge style
var style = graph.getStylesheet().getDefaultEdgeStyle();
style['strokeColor'] = 'black';
style['fontColor'] = 'black';
style['endArrow'] = 'none';
style['strokeWidth'] = '2';

/**
 * Sidebar
 */
// add graph sidebar
var sidebar = new mxToolbar(document.getElementById("sidebarContainer"));
sidebar.enabled = false;

// allow vertices to be dropped on the graph at arbitrary points
mxDragSource.prototype.getDropTarget = function(graph, x, y) {
    var cell = graph.getCellAt(x, y);
    if (!graph.isValidDropTarget(cell)) {
        cell = null;
    }
    return cell;
};

// ... with zoom-in/zoom-out buttons
let zoomIn = sidebar.addItem("Zoom In", "/src/images/zoomin.svg",
    function() {
        graph.zoomIn();
});
zoomIn.style.width = '30px';

let zoomOut = sidebar.addItem("Zoom Out", "/src/images/zoomout.svg",
    function() {
        graph.zoomOut();
});
zoomOut.style.width = '30px';

// add the sidebar elements for each of the goals
var addSidebarItem = function(graph, sidebar, image, width, height) {

    // create the prototype cell which will be cloned when a sidebar item
    // is dragged on to the graph
    var prototype = new mxCell(null, new mxGeometry(0, 0, width, height),
        "fontSize=16;fontColor=black;shape=rounded;shape=image;image="+image);
    prototype.setVertex(true);

    // function attached to each dragable sidebar item - this is used
    // to drag an item from the toolbar, then instantiate it in the graph
    var dragAndDrop = function(graph, evnt, cell) {
        graph.stopEditing(false);
        var point = graph.getPointForEvent(evnt);
        var goal = graph.getModel().cloneCell(prototype);
        goal.geometry.x = point.x;
        goal.geometry.y = point.y;
        graph.getSelectionCells(graph.importCells([goal], 0, 0, cell));
    }

    // add a symbol to the sidebar
    var sidebarItem = sidebar.addMode(null, image, dragAndDrop);
    sidebarItem.style.width = "80px";
    mxUtils.makeDraggable(sidebarItem, graph, dragAndDrop);
};

// add sidebar items for each of the goal types
addSidebarItem(graph, sidebar, PATH_FUNCTIONAL,
    SYMBOL_WIDTH, SYMBOL_HEIGHT
);
addSidebarItem(graph, sidebar, PATH_EMOTIONAL,
    SYMBOL_WIDTH*SW_EMOTIONAL, SYMBOL_HEIGHT*SH_EMOTIONAL
);
addSidebarItem(graph, sidebar, PATH_NEGATIVE,
    SYMBOL_WIDTH*SW_NEGATIVE, SYMBOL_HEIGHT*SW_NEGATIVE
);
addSidebarItem(graph, sidebar, PATH_QUALITY,
    SYMBOL_WIDTH*SW_QUALITY, SYMBOL_HEIGHT*SW_QUALITY
);
addSidebarItem(graph, sidebar, PATH_STAKEHOLDER,
    SYMBOL_WIDTH*SW_STAKEHOLDER, SYMBOL_HEIGHT*SW_STAKEHOLDER
);

// key-handler for deletion using Backspace
var keyHandler = new mxKeyHandler(graph);
keyHandler.bindKey(DELETE_KEYBINDING, function(evt) {
  if (graph.isEnabled()) {
    graph.removeCells();
  }
});

/**
 * Renders window.jsonData into a motivational model into graphContainer.
 */
function renderGraph(container) {
    saveJSON();
    console.log("Logging: renderGraph() called.");

    // reset - remove any existing graph if render is called
    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    graph.removeCells(graph.getChildEdges(graph.getDefaultParent()));
    rootGoal = null;

    // reset the accumulators for non-functional goals
    emotionsGlob = {};
    negativesGlob = {};
    qualitiesGlob = {};
    stakeholdersGlob = {};

    // check that browser is supported
    if (!mxClient.isBrowserSupported()) {
        console.log("Logging: browser not supported");
        mxUtils.error("Browser not supported!", 200, false);
        return;
    }

    // disable context menu
    mxEvent.disableContextMenu(container);

    // grab the clusters from window.jsonData
    var clusters = window.jsonData.GoalModelProject.Clusters;

    // render the graph
    graph.getModel().beginUpdate(); // start transaction
    for (var i = 0; i < clusters.length; i++) {
        // grab goal hierarchy from the cluster
        var goals = clusters[i].ClusterGoals;
        // ... then call render
        renderGoals(goals, graph, null);
    }
    layoutFunctions(graph);
    associateNonFunctions(graph);
    graph.getModel().endUpdate(); // end transaction
}

/**
 * Recursively renders the goal hierarchy.
 * : goals, the top-level array of goals
 * : graph, the graph into which goals will be rendered
 * : source, the parent goal of the given array, defaults to null
 */
function renderGoals(goals, graph, source = null) {
    console.log("Logging: renderGoals() called on list: " + goals);

    // accumulate non-functional goals to be rendered into a single symbol
    let emotions = [];
    let qualities = [];
    let concerns = [];
    let stakeholders = [];

    // run through each goal in the given array
    for (let i = 0; i < goals.length; i++) {
        let goal = goals[i];
        let type = goal.GoalType;
        let content = goal.GoalContent;

        // recurse over functional goals
        if (type === TYPE_FUNCTIONAL) {
            renderFunction(goal, graph, source);

        // accumulate non-functional descriptions into buckets
        } else if (type === TYPE_EMOTIONAL) {
            emotions.push(content);
        } else if (type === TYPE_NEGATIVE) {
            concerns.push(content);
        } else if (type === TYPE_QUALITY) {
            qualities.push(content);
        } else if (type === TYPE_STAKEHOLDER) {
            stakeholders.push(content);
        } else {
            console.log("Logging: goal of unknown type received: " + type);
        }
    }

    // render each of the non-functional goals
    var key;
    if (source === null) {
        key = ROOT_KEY;
    } else {
        key = source.value;
    }

    if (emotions.length) {
        emotionsGlob[key] = emotions;
    }
    if (qualities.length) {
        qualitiesGlob[key] = qualities;
    }
    if (concerns.length) {
        negativesGlob[key] = concerns;
    }
    if (stakeholders.length) {
        stakeholdersGlob[key] = stakeholders;
    }
}

/**
 * Renders a functional goal. The most important thing that this
 * does is call renderGoals() over each of the goals children.
 * : goal, the goal to be rendered (a Goal JSON object)
 * : graph, the graph to render the goal into
 * : source, the parent of the goal
 */
function renderFunction(goal, graph, source = null) {

    // styling
    let image = PATH_FUNCTIONAL;
    let width = SYMBOL_WIDTH;
    let height = SYMBOL_HEIGHT;
    if (source != null){
        let geo = graph.getCellGeometry(source);
        width = geo.width * CHILD_SIZE_SCALE;
        height = geo.height * CHILD_SIZE_SCALE;
    }

    // insert new vertex and edge into graph
    let node = graph.insertVertex(
        null,
        null,
        goal.GoalContent,
        SYMBOL_X_COORD,
        SYMBOL_Y_COORD,
        width,
        height,
        "fontSize=16;fontColor=black;shape=image;image=" + image
    );
    let edge = graph.insertEdge(null, null, null, source, node,
        "strokeColor=black;endArrow=none;strokeWidth=2");

    // if no root goal is registered, then store this as root
    if (rootGoal === null) {
        rootGoal = node;
    }

    // then recurse over the goal's children
    renderGoals(goal.SubGoals, graph, node);
}

/**
 * Renders a non-functional goal. No need to recurse here since
 * non-functional goals have no children.
 * : descriptions, the names of the non-functional goals to be
 *      rendered into a single symbol (array of strings)
 * : graph, the graph that the goal will be rendered into
 * : source, the functional goal that the goal will be associated to
 * : type, the type of the non-functional goal (string), this is included
 *      because we need it to know which symbol we are going to render the
 *      goal into
 */
function renderNonFunction(descriptions, graph, source=null, type="None") {

    // fetch parent coordinates
    let geo = graph.getCellGeometry(source);
    let x = 0;
    let y = 0;
    let sourceX = geo.x;
    let sourceY = geo.y;
    let fWidth = geo.width;
    let fHeight = geo.height;
    let width = fWidth;
    let height = fHeight;

    let image = "";
    switch (type) {
        case TYPE_EMOTIONAL:
            image = PATH_EMOTIONAL;
            width = fWidth * SW_EMOTIONAL;
            height = fHeight * SH_EMOTIONAL;
            x = sourceX - width / 2 - fWidth / 4;
            y = sourceY - height / 2 - fHeight / 4;
            break;
        case TYPE_NEGATIVE:
            image = PATH_NEGATIVE;
            width = fWidth * SW_NEGATIVE;
            height = fHeight * SH_NEGATIVE;
            x = sourceX + fWidth * 1.15 - width / 2;
            y = sourceY - height / 2 - fHeight / 4;
            break;
        case TYPE_QUALITY:
            image = PATH_QUALITY;
            width = fWidth * SW_QUALITY;
            height = fHeight * SH_QUALITY;
            x = sourceX - width / 2 - fWidth / 4;
            y = sourceY + fHeight * 1.15 - height / 2;
            break;
        case TYPE_STAKEHOLDER:
            image = PATH_STAKEHOLDER;
            width = fWidth * SW_STAKEHOLDER;
            height = fHeight * SH_STAKEHOLDER;
            x = sourceX + fWidth * 1.05 - width / 2;
            y = sourceY + fHeight * 1.0 - height / 2;
            break;
    }

    // customize vertex style
    let style = "fontSize=16;fontColor=black;shape=image;image=" + image;

    // if stakeholder, text goes at bottom
    if (type === TYPE_STAKEHOLDER) {
        style = style + ";verticalAlign=top;verticalLabelPosition=bottom";
    }

    // insert the vertex
    let node = graph.insertVertex(
        null,
        null,
        descriptions.join(";\n"),
        x,
        y,
        width,
        height,
        style
    );
    let edge = graph.insertEdge(null, null, null, source, node);

    // make the edge invisible - we still want to create the edge
    // the edge is needed when running the autolayout logic
    edge.visible = false;
}

/**
 * Automatically lays-out the functional hierarchy of the graph.
 */
function layoutFunctions(graph) {
    let layout = new mxGoalModelLayout(
        graph, 
        VERTICAL_SPACING,
        HORIZONTAL_SPACING
    );
    layout.execute(graph.getDefaultParent());
}

/**
 * Adds non-functional goals into the hierarchy next to their associated
 * functional goals.
 */
function associateNonFunctions(graph) {

    // fetch all the functional goals
    var goals = graph.getChildVertices();

    for (var i = 0; i < goals.length; i++) {
        let goal = goals[i];
        let value = goal.value;

        // render all emotions
        if (emotionsGlob[value]) {
            renderNonFunction(
                emotionsGlob[goal.value], graph, goal, TYPE_EMOTIONAL
            );
        }
    
        // render all qualities
        if (qualitiesGlob[value]) {
            renderNonFunction(
                qualitiesGlob[goal.value], graph, goal, TYPE_QUALITY
            );
        }

        // render all concerns
        if (negativesGlob[value]) {
            renderNonFunction(
                negativesGlob[goal.value],
                graph, goal, TYPE_NEGATIVE
            );
        }

        // render all stakeholders
        if (stakeholdersGlob[value]) {
            renderNonFunction(
                stakeholdersGlob[goal.value],
                graph, goal, TYPE_STAKEHOLDER
            );
        }
    }

    // render each of the non-functional goals at the root level
    if (emotionsGlob[ROOT_KEY] && rootGoal != null) {
        renderNonFunction(emotionsGlob[ROOT_KEY],
            graph, rootGoal, TYPE_EMOTIONAL
        );
    }
    if (qualitiesGlob[ROOT_KEY] && rootGoal != null) {
        renderNonFunction(qualitiesGlob[ROOT_KEY],
            graph, rootGoal, TYPE_QUALITY
        );
    }
    if (negativesGlob[ROOT_KEY] && rootGoal != null) {
        renderNonFunction(negativesGlob[ROOT_KEY],
            graph, rootGoal, TYPE_NEGATIVE
        );
    }
    if (stakeholdersGlob[ROOT_KEY] && rootGoal != null) {
        renderNonFunction(stakeholdersGlob[ROOT_KEY],
            graph, rootGoal, TYPE_STAKEHOLDER
        );
    }
}
