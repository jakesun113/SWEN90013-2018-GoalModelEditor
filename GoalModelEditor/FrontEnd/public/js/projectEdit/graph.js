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
const SW_EMOTIONAL = 0.8;
const SH_EMOTIONAL = 0.8;
const SW_QUALITY = 0.8;
const SH_QUALITY = 0.8;
const SW_NEGATIVE = 0.8;
const SH_NEGATIVE = 0.8;
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

// offset for non-emotional goals
const DX_EMOTIONAL = -SYMBOL_WIDTH * 0.8;
const DY_EMOTIONAL = -SYMBOL_HEIGHT * 0.3;
const DX_QUALITY = -SYMBOL_WIDTH * 0.9;
const DY_QUALITY = SYMBOL_HEIGHT * 0.3;
const DX_NEGATIVE = SYMBOL_WIDTH * 1.0;
const DY_NEGATIVE = -SYMBOL_HEIGHT * 0.25;
const DX_STAKEHOLDER = SYMBOL_WIDTH * 0.6;
const DY_STAKEHOLDER = SYMBOL_HEIGHT * 0.25;

// it is necessary to store the variable pointing to the graph object
// in the global scope - this is so that consecutive calls to render()
// are able to access (and hence destroy) any existing graph
var graph = new mxGraph(document.getElementById("graphContainer"));
graph.setPanning(true);
graph.panningHandler.useLeftButtonForPanning = true;

var emotionsGlob = {};
var negativesGlob = {};
var qualitiesGlob = {};
var stakeholdersGlob = {};

var zoomInBtn = mxUtils.button('+', function() {
    graph.zoomIn();
});
document.getElementById("zoomButtons").append(zoomInBtn);

var zoomOutBtn = mxUtils.button('-', function() {
    graph.zoomOut();
});
document.getElementById("zoomButtons").append(zoomOutBtn);

/**
 * Renders window.jsonData into a motivational model into graphContainer.
 */
function renderGraph(container) {
    saveJSON();
    console.log("Logging: renderGraph() called.");

    // reset - remove any existing graph if render is called
    graph.destroy();
    graph = new mxGraph(container);
    graph.setPanning(true);
    graph.panningHandler.useLeftButtonForPanning = true;

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
        renderGoals(goals, graph, SYMBOL_WIDTH, SYMBOL_HEIGHT, null);
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

function renderGoals(goals, graph, width, height, source = null) {
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
            renderFunction(goal, graph, width, height, source);

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
function renderFunction(goal, graph, width, height, source = null) {
    let image = PATH_FUNCTIONAL;

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
    renderGoals(goal.SubGoals, graph, width * CHILD_SIZE_SCALE,
        height * CHILD_SIZE_SCALE, node);
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
    let widthScale = 1;
    let heightScale = 1;
    let fWidth = SYMBOL_WIDTH;
    let fHeight = SYMBOL_HEIGHT;
    var sourceX = 0;
    var sourceY = 0;

    // fetch parent coordinates
    if (source != null) {
        var geo = graph.getCellGeometry(source);
        var dX = 0;
        var dY = 0;
        sourceX = geo.x;
        sourceY = geo.y;
        fWidth = geo.width;
        fHeight = geo.height;
    }


    let image = "";
    switch (type) {
        case TYPE_EMOTIONAL:
            dX = DX_EMOTIONAL;
            dY = DY_EMOTIONAL;
            image = PATH_EMOTIONAL;
            widthScale = SW_EMOTIONAL;
            heightScale = SH_EMOTIONAL;
            break;
        case TYPE_NEGATIVE:
            dX = DX_NEGATIVE;
            dY = DY_NEGATIVE;
            image = PATH_NEGATIVE;
            widthScale = SW_NEGATIVE;
            heightScale = SH_NEGATIVE;
            break;
        case TYPE_QUALITY:
            dX = DX_QUALITY;
            dY = DY_QUALITY;
            image = PATH_QUALITY;
            widthScale = SW_QUALITY;
            heightScale = SH_QUALITY;
            break;
        case TYPE_STAKEHOLDER:
            dX = DX_STAKEHOLDER;
            dY = DY_STAKEHOLDER;
            image = PATH_STAKEHOLDER;
            widthScale = SW_STAKEHOLDER;
            heightScale = SH_STAKEHOLDER;
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
        sourceX + dX,
        sourceY + dY,
        fWidth * widthScale,
        fHeight * heightScale,
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
