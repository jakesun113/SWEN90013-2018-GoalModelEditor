"use strict";

// default width/height of MM symbols
const SYMBOL_WIDTH = 120;
const SYMBOL_HEIGHT = 80;

// default x and y coord of the MM symbols 
const SYMBOL_X_COORD = 0;
const SYMBOL_Y_COORD = 0;

// different types of goals to be rendered
const TYPE_FUNCTIONAL = "Functional";
const TYPE_EMOTIONAL = "Emotional";
const TYPE_NEGATIVE = "Negative";
const TYPE_QUALITY = "Quality";
const TYPE_STAKEHOLDER = "Stakeholder";

// paths to the images of the different types
const PATH_FUNCTIONAL = "/src/images/Function.png";
const PATH_EMOTIONAL = "/src/images/Heart.png";
const PATH_NEGATIVE = "/src/images/heartshape.jpg";
const PATH_QUALITY = "/src/images/Cloud.png";
const PATH_STAKEHOLDER = "/src/images/Stakeholder.png";

// default spacing for auto-layout algorithm
const VERTICAL_SPACING = 100;
const HORIZONTAL_SPACING = 100;

// it is necessary to store the variable pointing to the graph object
// in the global scope - this is so that consecutive calls to render()
// are able to access (and hence destroy) any existing graph
var graph = new mxGraph(document.getElementById('graphContainer'));

/**
 * Renders window.jsonData into a motivational model into graphContainer.
 */
function renderGraph(container) {
    console.log("Logging: renderGraph() called.");

    // reset - remove any existing graph if render is called
    graph.destroy();
    graph = new mxGraph(container);

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
    autolayout(graph);
    graph.getModel().endUpdate(); // end transaction
}

/**
 * Recursively renders the goal hierarchy.
 * : goals, the top-level array of goals
 * : graph, the graph into which goals will be rendered
 * : source, the parent goal of the given array, defaults to null
 */

function renderGoals(goals, graph, source=null) {

    console.log("Logging: renderGoals() called on list: " + goals);

    // accumulate non-functional goals to be rendered into a single symbol
    var emotions = [];
    var qualities = [];
    var concerns = [];
    var stakeholders = [];

    // run through each goal in the given array
    for (var i = 0; i < goals.length; i++) {
        var goal = goals[i];
        var type = goal.GoalType;
        var content = goal.GoalContent;

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
        renderNonFunction(emotions, graph, source, TYPE_EMOTIONAL);
    }
    if (qualities.length) {
        renderNonFunction(qualities, graph, source, TYPE_QUALITY);
    }
    if (concerns.length) {
        renderNonFunction(concerns, graph, source, TYPE_NEGATIVE);
    }
    if (stakeholders.length) {
        renderNonFunction(stakeholders, graph, source, TYPE_STAKEHOLDER);
    }
}

/**
 * Renders a functional goal. The most important thing that this
 * does is call renderGoals() over each of the goals children.
 * : goal, the goal to be rendered (a Goal JSON object)
 * : graph, the graph to render the goal into
 * : source, the parent of the goal
 */
function renderFunction(goal, graph, source=null) {
    let image = PATH_FUNCTIONAL;

    // insert new vertex and edge into graph
    var node = graph.insertVertex(
        null, null, 
        goal.GoalContent,
        SYMBOL_X_COORD, SYMBOL_Y_COORD,
        SYMBOL_WIDTH, SYMBOL_HEIGHT,
        "shape=image;image="+image
    );
    var edge = graph.insertEdge(
        null, null, null,
        source, node
    );

    // then recurse over the goal's children
    renderGoals(goal.SubGoals, graph, node)
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
    let image = '';
    switch (type) {
        case TYPE_EMOTIONAL:
            image = PATH_EMOTIONAL;
            break;
        case TYPE_NEGATIVE:
            image = PATH_NEGATIVE;
            break;
        case TYPE_QUALITY:
            image = PATH_QUALITY;
            break;
        case TYPE_STAKEHOLDER:
            image = PATH_STAKEHOLDER;
    }
    // insert new vertex and edge into graph
    var node = graph.insertVertex(
        null, null, 
        descriptions.join(";\n"),
        SYMBOL_X_COORD, SYMBOL_Y_COORD,
        SYMBOL_WIDTH, SYMBOL_HEIGHT,
        "shape=image;image="+image
    );
    var edge = graph.insertEdge(
        null, null, null,
        source, node
    );

    // make the edge invisible - we still want to create the edge
    // the edge is needed when running the autolayout logic
    edge.visible = false;
}

/**
 * Automatically lays out the graph.
 */
function autolayout(graph) {
    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
    layout.execute(graph.getDefaultParent());
}

/**
 * Parses the graph to XML, to be saved/loaded in a differenct session.
 */
function parseToXML(graph) {
    let encoder = new mxCodec();
    let node = encoder.encode(graph.getModel());
    let xml = mxUtils.getPrettyXml(node);
    return xml;
}

/**
 * Renders the graph from a (saved) XML file.
 */
function renderFromXML(xml) {
    console.log(xml);
    var doc = mxUtils.parseXml(xml);
    console.log(doc);
    var codec = new mxCodec(doc);
    var elt = doc.documentElement.firstChild;
    var cells = [];

    console.log(codec);
    while (elt != null)
    {
        console.log(elt);
        cells.push(codec.decode(elt));
        elt = elt.nextSibling;
    }

    graph.addCells(cells);
}
