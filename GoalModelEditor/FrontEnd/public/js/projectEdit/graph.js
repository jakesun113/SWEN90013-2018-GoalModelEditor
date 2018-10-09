"use strict";

/**
 * Constants
 */

// id of the html div to contain the canvas
const GRAPH_DIV_ID = "graphContainer";

// id of the html div to contain the graph sidebar
const SIDEBAR_DIV_ID = "sidebarContainer";

// different types of goals to be rendered
const TYPE_FUNCTIONAL = "Functional";
const TYPE_EMOTIONAL = "Emotional";
const TYPE_NEGATIVE = "Negative";
const TYPE_QUALITY = "Quality";
const TYPE_STAKEHOLDER = "Stakeholder";

// default x,y coordinates of the root goal in the graph
const SYMBOL_X_COORD = 0;
const SYMBOL_Y_COORD = 0;

// default width/height of the root goal in the graph
const SYMBOL_WIDTH = 145;
const SYMBOL_HEIGHT = 110;

// scale factor for sizing child goals in the functional hierarchy; functional
//   goals at each layer should be slightly smaller than their parents
const CHILD_SIZE_SCALE = 0.8;

// scale factors for non-functional goals; these scale factors are relative
//   to the size of the associated functional goal
const SW_EMOTIONAL = 1;
const SH_EMOTIONAL = 1;
const SW_QUALITY = 1;
const SH_QUALITY = 1;
const SW_NEGATIVE = 1;
const SH_NEGATIVE = 1;
const SW_STAKEHOLDER = 0.40;
const SH_STAKEHOLDER = 0.8;

// preferred vertical and horizontal spacing between functional goals; note
//   the autolayout won't always accomodate these - it will depend on the
//   topology of the model you are trying to render
const VERTICAL_SPACING = 60;
const HORIZONTAL_SPACING = 60;

// paths to the images of the different types of goal
const PATH_FUNCTIONAL = "/src/images/Function.png";
const PATH_EMOTIONAL = "/src/images/Heart.png";
const PATH_NEGATIVE = "/src/images/Risk.png";
const PATH_QUALITY = "/src/images/Cloud.png";
const PATH_STAKEHOLDER = "/src/images/Stakeholder.png";

// path to the image used for the edge-creation icon
const PATH_EDGE_HANDLER_ICON = "/img/link.png";

// size of the edge-creation icon
const ICON_WIDTH = 14;
const ICON_HEIGHT = 14;

// keybinding for the 'delete' key on MacOS; this is used in the implementation
//   of the delete function
const DELETE_KEYBINDING = 8;

// random string, used to store unassociated non-functions in accumulators
const ROOT_KEY = "0723y450nv3-2r8mchwouebfioasedfiadfg";


/**
 * Canvas Setup
 *
 * This section contains all functions required to set up the graph:
 * (1) Inserting the mxGraph graph into the specified div
 * (2) Configuring the graph
 *
 */

// create the graph in the specified container
var graph = new mxGraph(document.getElementById(GRAPH_DIV_ID));

// config: allow drag-panning using left click on empty canvas space
graph.setPanning(true);
graph.panningHandler.useLeftButtonForPanning = true;

// config: allow symbols to be dropped into the graph (used for sidebar)
graph.dropEnabled = true;

// config: permit vertices to be connected by edges
graph.setConnectable(true);

// config: set default style for edges inserted into graph
var style = graph.getStylesheet().getDefaultEdgeStyle();
style['strokeColor'] = 'black';
style['fontColor'] = 'black';
style['endArrow'] = 'none';
style['strokeWidth'] = '2';


/**
 * Sidebar
 */

// config: allow cells to be dropped into the graph canvas at arbitrary points
//   This is necessary for the drag-and-drop functionality of the sidebar
mxDragSource.prototype.getDropTarget = function (graph, x, y) {
    var cell = graph.getCellAt(x, y);
    if (!graph.isValidDropTarget(cell)) {
        cell = null;
    }
    return cell;
};

// create the sidebar in the specified container
var sidebar = new mxToolbar(document.getElementById(SIDEBAR_DIV_ID));
sidebar.enabled = false; // turn off 'activated' aesthetic

// zoom-in and zoom-out buttons
sidebar.addLine(); // purely aesthetic
let zoomIn = sidebar.addItem(
    "Zoom In",
    "/src/images/zoomin.svg",
    function () { graph.zoomIn(); }
);
zoomIn.style.width = '20px'; // set width of the zoom icon

let zoomOut = sidebar.addItem(
    "Zoom Out",
    "/src/images/zoomout.svg",
    function () { graph.zoomOut(); }
);
zoomOut.style.width = '20px';
sidebar.addLine();

// add the sidebar elements for each of the goals
var addSidebarItem = function (graph, sidebar, image, width, height) {

    // create the prototype cell which will be cloned when a sidebar item
    // is dragged on to the graph
    let style = "fontSize=16;fontColor=black;shape=rounded;shape=image;image=" + image;
    if (image === PATH_STAKEHOLDER) {
        style = style + ";verticalAlign=top;verticalLabelPosition=bottom";
    }
    var prototype = new mxCell(null, new mxGeometry(0, 0, width, height), style);
    prototype.setVertex(true);

    // function attached to each dragable sidebar item - this is used
    // to drag an item from the toolbar, then instantiate it in the graph
    var dragAndDrop = function (graph, evnt, cell) {
        graph.stopEditing(false);
        var point = graph.getPointForEvent(evnt);
        var goal = graph.getModel().cloneCell(prototype);
        goal.geometry.x = point.x;
        goal.geometry.y = point.y;
        graph.getSelectionCells(graph.importCells([goal], 0, 0, cell));
    }

    // add a symbol to the sidebar
    var sidebarItem = sidebar.addMode(null, image, dragAndDrop);
    sidebarItem.style.width = "60px";
    if (image == PATH_STAKEHOLDER) {
        sidebarItem.style.width = "30px";
    }
    mxUtils.makeDraggable(sidebarItem, graph, dragAndDrop);
};

// add sidebar items for each of the goal types
addSidebarItem(graph, sidebar, PATH_FUNCTIONAL,
    SYMBOL_WIDTH, SYMBOL_HEIGHT
);
addSidebarItem(graph, sidebar, PATH_EMOTIONAL,
    SYMBOL_WIDTH * SW_EMOTIONAL, SYMBOL_HEIGHT * SH_EMOTIONAL
);
addSidebarItem(graph, sidebar, PATH_NEGATIVE,
    SYMBOL_WIDTH * SW_NEGATIVE, SYMBOL_HEIGHT * SW_NEGATIVE
);
addSidebarItem(graph, sidebar, PATH_QUALITY,
    SYMBOL_WIDTH * SW_QUALITY, SYMBOL_HEIGHT * SW_QUALITY
);
addSidebarItem(graph, sidebar, PATH_STAKEHOLDER,
    SYMBOL_WIDTH * SW_STAKEHOLDER * 1.5, SYMBOL_HEIGHT * SW_STAKEHOLDER * 1.5
);
sidebar.addLine();


/**
 * Edge Handler
 *
 * This manifests an icon that appears in the middle of a vertex when you
 * hover over it with the mouse; the icon can be used to create edges out
 * of the vertex by click-and-drag.
 */
mxConstants.DEFAULT_HOTSPOT = 0.15;
mxConnectionHandler.prototype.connectImage = new mxImage(
    PATH_EDGE_HANDLER_ICON,
    ICON_WIDTH,
    ICON_HEIGHT
);


/**
 * Support Functions
 *
 * These are functions added to the renderer largely for the convenience
 * of the user. They're primarily to assist with manually adjusting the
 * model after it's been rendererd.
 * (1) Delete
 * (2) Undo
 */

// delete: add key-handler that listens for 'delete' key
var keyHandler = new mxKeyHandler(graph);
keyHandler.bindKey(DELETE_KEYBINDING, function (evt) {
    if (graph.isEnabled()) {
        graph.removeCells();
    }
});

// undo: add undo manager, this is the object that keeps track of the
//   history of changes made to the graph
var undoManager = new mxUndoManager();
var listener = function(sender, evt) {
    undoManager.undoableEditHappened(evt.getProperty('edit'));
};

// undo: for some reason the undo listener has to be added to both the view
//   and the model
graph.getModel().addListener(mxEvent.UNDO, listener);
graph.getView().addListener(mxEvent.UNDO, listener);

// undo: add key-handler that listens for 'command'+'z' to execute undo
var undoKeyHandler = new mxKeyHandler(graph);
undoKeyHandler.getFunction = function(evt) {

  // if mac command key pressed ... 
  if (mxClient.IS_MAC && evt.metaKey) {

    // ... and z pressed
    if (evt.code == "KeyZ") {

      // ... and provided that we have some history to undo
      //   DO NOT DELETE : removing this guard can crash the web browser
      if (undoManager.indexOfNextAdd > 1) {
        // ... then we can execute undo
        undoManager.undo();
      }
    }
  }
}


/**
 * Autolayout
 *
 * The following functions are used to run generate and autolayout the graph
 * using the goal list provided by the editor.
 */

// variable, stores the identity of the root function
var rootGoal = null;

// maps from function_id -> associated non-functional goals
//    A bug that arises from this implementation is that if a functional goal
//    of identical name appears in multiple places in the goal hierarchy, then
//    every instance of the goal will be rendered with non-functional goals
//    pertaining to all instances of the functional goal/
var emotionsGlob = {};
var negativesGlob = {};
var qualitiesGlob = {};
var stakeholdersGlob = {};


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
    if (source != null) {
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
    let edge = graph.insertEdge(null, null, null, source, node);

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
    layout.execute(graph.getDefaultParent(), rootGoal);
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
