"use strict";

// default width/height of MM symbols
const SYMBOL_WIDTH = 145;
const SYMBOL_HEIGHT = 110;

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
const SW_STAKEHOLDER = 0.25;
const SH_STAKEHOLDER = 0.7;

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

// it is necessary to store the variable pointing to the graph object
// in the global scope - this is so that consecutive calls to render()
// are able to access (and hence destroy) any existing graph
var graph = new mxGraph(document.getElementById("graphContainer"));
graph.setPanning(true);
graph.panningHandler.useLeftButtonForPanning = true;

console.log(graph.container)

var emotionsGlob = {};
var negativesGlob = {};
var qualitiesGlob = {};
var stakeholdersGlob = {};

// add graph sidebar
var sidebar = new mxToolbar(document.getElementById("sidebarContainer"));
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


/**
 * Renders window.jsonData into a motivational model into graphContainer.
 */
function renderGraph(container) {
    saveJSON();
    console.log("Logging: renderGraph() called.");

    // reset - remove any existing graph if render is called
    graph.removeCells(graph.getChildVertices(graph.getDefaultParent()));
    graph.removeCells(graph.getChildEdges(graph.getDefaultParent()));


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
    if (emotions.length) {
        emotionsGlob[source.value] = emotions;
    }
    if (qualities.length) {
        qualitiesGlob[source.value] = qualities;
    }
    if (concerns.length) {
        negativesGlob[source.value] = concerns;
    }
    if (stakeholders.length) {
        stakeholdersGlob[source.value] = stakeholders;
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

    if (source == null){
        return;
    }

    // fetch parent coordinates
    var geo = graph.getCellGeometry(source);
    var x = 0;
    var y = 0;
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
            x = sourceX - width / 2;
            y = sourceY - height / 2;
            break;
        case TYPE_NEGATIVE:
            image = PATH_NEGATIVE;
            width = fWidth * SW_NEGATIVE;
            height = fHeight * SH_NEGATIVE;
            x = sourceX + fWidth - width / 2;
            y = sourceY - height / 2;
            break;
        case TYPE_QUALITY:
            image = PATH_QUALITY;
            width = fWidth * SW_QUALITY;
            height = fHeight * SH_QUALITY;
            x = sourceX - width / 2;
            y = sourceY + fHeight - height / 2;
            break;
        case TYPE_STAKEHOLDER:
            image = PATH_STAKEHOLDER;
            width = fWidth * SW_STAKEHOLDER;
            height = fHeight * SH_STAKEHOLDER;
            x = sourceX + fWidth - width / 2;
            y = sourceY + fHeight - height / 2;
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
    console.log(type + " Symbol w, h: " + SYMBOL_WIDTH + ", " + SYMBOL_HEIGHT);
    console.log(node.getGeometry());
    console.log(node.getStyle());
    let edge = graph.insertEdge(null, null, null, source, node);
    // console.log(edge);

    // make the edge invisible - we still want to create the edge
    // the edge is needed when running the autolayout logic
    edge.visible = false;
}

/**
 * Automatically lays-out the functional hierarchy of the graph.
 */
function layoutFunctions(graph) {
    let layout = new mxGoalModelLayout(graph);
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
}
