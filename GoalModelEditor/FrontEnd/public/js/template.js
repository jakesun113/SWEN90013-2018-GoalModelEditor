"use strict";

// TODO: text styling
// TODO: sidebar aesthetic
// TODO: symbol sizing
// TODO: connective lines
// TODO: save/load


// paths to images to be rendered
const PATH_FUNCTIONAL = "/src/images/Function.png";
const PATH_EMOTIONAL = "/src/images/Heart.png";
const PATH_NEGATIVE = "/src/images/Risk.png";
const PATH_QUALITY = "/src/images/Cloud.png";
const PATH_STAKEHOLDER = "/src/images/Stakeholder.png";

// default width/height of a functional goal
const SYMBOL_WIDTH = 145;
const SYMBOL_HEIGHT = 110;

// default width/height scale factors of non-functional goals
const SW_EMOTIONAL = 1.0;
const SH_EMOTIONAL = 1.0;
const SW_QUALITY = 1.0;
const SH_QUALITY = 1.0;
const SW_NEGATIVE = 1.0;
const SH_NEGATIVE = 1.0;
const SW_STAKEHOLDER = 0.75;
const SH_STAKEHOLDER = 1.0;


/**
 * Graph
 */
var model = new mxGraphModel();
var graph = new mxGraph(document.getElementById("graphContainer"), model);
graph.setPanning(true);
graph.panningHandler.useLeftButtonForPanning = true;
graph.dropEnabled = true;
graph.setConnectable(true);
graph.setMultigraph(true);


/**
 * Sidebar
 */

// create the sidebar object
var sidebar = new mxToolbar(document.getElementById("sidebarContainer"));
sidebar.enabled = false;

// add zoom-in / zoom-out to sidebar
let zoomIn = sidebar.addItem("ZoomIn", "/src/images/zoomin.svg",
    function () {
        graph.zoomIn();
    }
);
zoomIn.style.width = "30px";

let zoomOut = sidebar.addItem("ZoomOut", "/src/images/zoomout.svg",
    function () {
        graph.zoomOut();
    }
);
zoomOut.style.width = "30px";

// allow vertices to be dropped on the graph at arbitrary points
mxDragSource.prototype.getDropTarget = function (graph, x, y) {
    var cell = graph.getCellAt(x, y);
    if (!graph.isValidDropTarget(cell)) {
        cell = null;
    }
    return cell;
};

// add the sidebar elements for each of the goals
var addSidebarItem = function (graph, sidebar, image, width, height) {

    // create the prototype cell which will be cloned when a sidebar item
    // is dragged on to the graph
    var prototype = new mxCell(null, new mxGeometry(0, 0, width, height),
        "shape=rounded;shape=image;image=" + image);
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
    sidebarItem.style.width = "80px";
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
    SYMBOL_WIDTH * SW_STAKEHOLDER, SYMBOL_HEIGHT * SW_STAKEHOLDER
);
