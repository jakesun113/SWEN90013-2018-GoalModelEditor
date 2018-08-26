"use strict";

const SYMBOL_WIDTH = 120;
const SYMBOL_HEIGHT = 80;

const TYPE_FUNCTIONAL = "Functional";
const TYPE_EMOTIONAL = "Emotional";
const TYPE_NEGATIVE = "Negative";
const TYPE_QUALITY = "Quality";
const TYPE_STAKEHOLDER = "Stakeholder";

// create the graph object and configure
let graph = new mxGraph(document.getElementById('graphContainer'));
// let graph = new mxGraph();

/* Renders the window.jsonData into a symbolic goal model.
 *
 */
function renderGraph(container) {
    console.log("Logging: renderGraph() called.");
    graph.destroy();
    graph = new mxGraph(document.getElementById('graphContainer'));
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

    // create the graph object and configure
    // graph = new mxGraph(container);

    // render the graph
    graph.getModel().beginUpdate(); // start transaction
    for (var i = 0; i < clusters.length; i++) {
        renderCluster(clusters[i], graph);
    }
    autolayout(graph);
    graph.getModel().endUpdate(); // end transaction
}

/* Renders a cluster.
 *
 */
function renderCluster(cluster, graph) {
    console.log("Logging: renderCluster() called on cluster: " + cluster);

    // retrieve the graph's default parent - this effectively becomes the
    // parent of all "root" goals in the hierarchy
    var parent = graph.getDefaultParent();

    // render each goal in the cluster
    var goal;
    for (var i = 0; i < cluster.ClusterGoals.length; i++) {
        goal = cluster.ClusterGoals[i];
        if (goal.GoalType == TYPE_FUNCTIONAL) {
            renderFunctionalGoal(null, goal, graph);
        }
    }
}

/* Renders a goal subtree.
 *
 */
function renderFunctionalGoal(supergoal, goal, graph) {
    console.log("Logging: renderGoal() called with goal: " + goal);

    // fetch the default mxGraph cell parent
    var parent = graph.getDefaultParent();

    // render the functional goal
    var node = graph.insertVertex(
        parent,
        null,
        goal.GoalContent,
        0,
        0,
        SYMBOL_WIDTH,
        SYMBOL_HEIGHT
    );
    if (supergoal != null) {
        var edge = graph.insertEdge(parent, null, "", supergoal, node);
    }

    // accumulate the goal's associated non-functional subgoals
    var subgoals = goal.SubGoals;
    var qualities = "";
    var emotions = "";
    var concerns = "";
    var stakeholders = "";

    var subgoal;
    var type;
    for (var i = 0; i < subgoals.length; i++) {
        subgoal = subgoals[i];
        type = subgoal.GoalType;
        let content = subgoal.GoalContent;

        if (type == TYPE_EMOTIONAL) {
            console.log(type);
            emotions += ";\n" + content;
        } else if (type == TYPE_QUALITY) {
            qualities += ";\n" + content;
        } else if (type == TYPE_NEGATIVE) {
            concerns += ";\n" + content;
        } else if (type == TYPE_STAKEHOLDER) {
            stakeholders += ";\n" + content;
        } else if (type == TYPE_FUNCTIONAL) {
            renderFunctionalGoal(node, subgoal, graph);
        }
    }

    // render separate symbols for each non-functional group
    if (qualities) {
        var node = graph.insertVertex(
            parent,
            null,
            qualities,
            0,
            0,
            SYMBOL_WIDTH,
            SYMBOL_HEIGHT
        );
    }

    if (emotions) {
        var node = graph.insertVertex(
            parent,
            null,
            emotions,
            0,
            0,
            SYMBOL_WIDTH,
            SYMBOL_HEIGHT
        );
    }

    if (concerns) {
        var node = graph.insertVertex(
            parent,
            null,
            concerns,
            0,
            0,
            SYMBOL_WIDTH,
            SYMBOL_HEIGHT
        );
    }

    if (stakeholders) {
        var node = graph.insertVertex(
            parent,
            null,
            stakeholders,
            0,
            0,
            SYMBOL_WIDTH,
            SYMBOL_HEIGHT
        );
    }
}

/* Auto-layout for graph
 *
 */
function autolayout(graph) {
    var layout = new mxHierarchicalLayout(graph, mxConstants.DIRECTION_NORTH);
    layout.execute(graph.getDefaultParent());
}

function parseToXML(graph) {
    let encoder = new mxCodec();
    let node = encoder.encode(graph.getModel());
    let xml = mxUtils.getPrettyXml(node);
    return xml;
}

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