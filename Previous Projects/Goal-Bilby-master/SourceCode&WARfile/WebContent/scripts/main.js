/**
 * Controlling major interactions in the index page.
 * Created by Zheping Liu.
 */

/**
 * Global variables
 */
// the image id that is ready to be drawn
var imageId;
// the stored Json of the current graph
var json;
// the text on the shape that is ready to be drawn
var shapeName;

/**
 * Change the height of canvas fit to the window using JQeury
 */
$(function () {
	$("#myCanvas").css({
		height: $("#outerCanvas").innerHeight()
	});
	$(window).resize(function () {
		$("#myCanvas").css({
			height: $("#outerCanvas").innerHeight(),
            width: $("#outerCanvas").width()
		})
        ;
	});
});

/**
 * Initializing the Graph and Paper
 */
// Graph object from JointJS
var graph = new joint.dia.Graph();
// Paper object from JointJS
var paper = new joint.dia.Paper({
	el: $("#myCanvas"),
	width: $("#outerCanvas").width(),
	height: $("#outerCanvas").height(),
	model: graph,
	gridSize: 10,
	drawGrid: "mesh", // Make the grid visible in mesh style
	interactive: false, // Make the paper non-interactive
});

$(".marker-arrowhead").css("fill", "none");
$(".tool-remove").css("fill", "none");
$(".tool-options").css("fill", "none");
$(".marker-vertices").css("fill", "none");

var editMode = false;
/**
 * Turning on/off the edit mode
 */
function edit() {
	const self = this;
	this.graph.getCells().forEach(function (cell) {
		const c = cell.findView(self.paper);
		if (editMode == false) {
			c.setInteractivity(true);
			editMode = true;
		} else {
			c.setInteractivity(false);
			editMode = false;
		}
	})
}

/**
 * Paper Scale and Zoom in, Zoom out
 */
// Default Graph scale
var graphScale = 1.3;
// Change the scale of the Paper
var paperScale = function (sx, sy) {
	paper.scale(sx, sy);
};
// Zoom out the Paper
var zoomOut = function () {
	graphScale -= 0.1;
	paperScale(graphScale, graphScale);
};
// Zoom in the Paper
var zoomIn = function () {
	graphScale += 0.1;
	paperScale(graphScale, graphScale);
};
// Reset the scale of the Paper
var resetScale = function () {
	graphScale = 1.3;
	paperScale(graphScale, graphScale);
};

paper.scale(1.3, 1.3);


/**
 * Use mousewheel for zoom in and zoom out
 */
this.paper.$el.on('mousewheel DOMMouseScroll', function onMouseWheel(e) {

	e.preventDefault();
	e = e.originalEvent;

	var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) / 50;
	var offsetX = (e.offsetX || e.clientX - $(this).offset().left);

	var offsetY = (e.offsetY || e.clientY - $(this).offset().top);
	var p = offsetToLocalPoint(offsetX, offsetY);
	var newScale = V(paper.viewport).scale().sx + delta;

	if (newScale > 0.4 && newScale < 2) {
		paper.scale(newScale,newScale,0,0);
	}
});

var dragStartPosition

/**
 * Below three events are all about move the canvas First one is setting drag
 * start position by clicking the blank area
 */
paper.on('blank:pointerdown', function (event, x, y) {
	var scale = V(paper.viewport).scale();
	dragStartPosition = {
		x: x * scale.sx,
		y: y * scale.sy
	};
});


paper.on('blank:pointerdown', function (event, x, y) {
	var scale = V(paper.viewport).scale();
	dragStartPosition = {
		x: x * scale.sx,
		y: y * scale.sy
	};
});

/**
 * Second one is deleting drag start position by clicking a Cell or blank area
 * again
 */
paper.on('cell:pointerup blank:pointerup', function (cellView, x, y) {
	dragStartPosition = null;
});

/**
 * Third one is moving the canvas to on mousemove event
 */
$('#myCanvas').mousemove(
	function (event) {
		if (dragStartPosition != null) {
			paper.translate(event.offsetX - dragStartPosition.x,
				event.offsetY - dragStartPosition.y);
		}

	});

/**
 * Press Ctrl to select multiple cells in the paper
 */
this.paper.on("cell:pointerdown", function (cellView, evt) {
	// Select an element if CTRL/Meta key is pressed while the element is
	// clicked.
	if ((evt.ctrlKey || evt.metaKey) &&
		!(cellView.model instanceof joint.dia.Link)) {
		this.selectionView.createSelectionBox(cellView); // Note here how
		// they create
		// selection box
		this.selection.add(cellView.model);
	}
}, this);

function offsetToLocalPoint(x, y) {
	var svgPoint = paper.svg.createSVGPoint();
	svgPoint.x = x;
	svgPoint.y = y;

	var pointTransformed = svgPoint.matrixTransform(paper.viewport.getCTM()
		.inverse());
	return pointTransformed;
}

/**
 * Create a cell with Goal shape
 * 
 * @param {*}
 *            positionX specified position x
 * @param {*}
 *            positionY specified position y
 */
function shapesGoal(positionX, positionY, text) {
	var cell = new joint.shapes.basic.Path({
		position: {
			x: positionX,
			y: positionY
		},
		size: {
			width: 120,
			height: 90
		},
		attrs: {
			path: {
				d: 'M 30 0 L 120 0 90 10 0 10 z'
			},
			text: {
				text: text,
				fill: 'black',
				'ref-y': -65,
				magnet: true
			}
		}
	})
	return cell;
}

/**
 * Create a cell with Heart shape
 * 
 * @param {*}
 *            positionX specified position x
 * @param {*}
 *            positionY specified position y
 */
function shapesHeart(positionX, positionY, text) {
	var cell = new joint.shapes.basic.Path({
		position: {
			x: positionX,
			y: positionY
		},
		size: {
			width: 150,
			height: 100
		},
		attrs: {
			path: {
				d: "M 272.70141,238.71731\
            				C 206.46141,238.71731 152.70146,292.4773 152.70146,358.71731 \
            				C 152.70146,493.47282 288.63461,528.80461 381.26391,662.02535 \
            				C 468.83815,529.62199 609.82641,489.17075 609.82641,358.71731 \
            				C 609.82641,292.47731 556.06651,238.7173 489.82641,238.71731 \
            				C 441.77851,238.71731 400.42481,267.08774 381.26391,307.90481 \
            				C 362.10311,267.08773 320.74941,238.7173 272.70141,238.71731 \
            				z"
			},
			text: {
				text: text,
				fill: 'black',
				'ref-y': -185,
				magnet: true
			}
		}
	});
	return cell;
}

/**
 * Create a cell with Cloud shape
 * 
 * @param {*}
 *            positionX specified position x
 * @param {*}
 *            positionY specified position y
 */
function shapeCloud(positionX, positionY, text) {
	var cell = new joint.shapes.basic.Path({
		position: {
			x: positionX,
			y: positionY
		},
		size: {
			width: 150,
			height: 100
		},
		attrs: {
			path: {
				d: "M 406.1 227.63c-8.23-103.65-144.71-137.8-200.49-49.05 \
              				-36.18-20.46-82.33 3.61-85.22 45.9C80.73 229.34 50 263.12 \
              				50 304.1c0 44.32 35.93 80.25 80.25 80.25h251.51c44.32 0 \
              				80.25-35.93 80.25-80.25C462 268.28 438.52 237.94 406.1 227.63 \
              				z"
			},
			text: {
				text: text,
				'ref-y': -65,
			}
		}
	});
	return cell;
}

/**
 * Create a cell with Actor shape
 * 
 * @param {*}
 *            positionX specified position x
 * @param {*}
 *            positionY specified position y
 */
function shapeActor(positionX, positionY, text) {
	var cell = new joint.shapes.basic.Image({
		position: {
			x: positionX,
			y: positionY
		},
		size: {
			width: 150,
			height: 100
		},
		attrs: {
			image: {
				"xlink:href": "Images/Actor.svg",
				width: 150,
				height: 100
			},
			text: {
				text: text,
				fill: 'black',
			}
		}
	});
	return cell;
}

/**
 * Change the colour to 'purple'
 * 
 * @param {*}
 *            id the specified id
 */
function changeColour(id) {
	document.getElementById(id).style.color = "purple";
}

/**
 * Find the image source file for the specified id.
 * 
 * @param {*}
 *            id the specified id
 */
function findImage(id) {
	var image = document.getElementById(id).getAttribute("src");
	return image;
}

/**
 * Function to get the mouse position when mousemove event happens
 */
function getMousePosition(canvas, event) {
	var pageX, pageY;
	var rect = canvas.getBoundingClientRect();

	event = event || window.event;

	// If pageX/Y aren't available and clientX/Y are,
	// calculate pageX/Y - logic taken from jQuery.
	// (This is to support old IE)
	if (event.pageX == null && event.clientX != null) {
		eventDoc = (event.target && event.target.ownerDocument) || document;
		doc = eventDoc.documentElement;
		body = eventDoc.body;

		event.pageX = event.clientX +
			((doc && doc.scrollLeft) || (body && body.scrollLeft) || 0) -
			((doc && doc.clientLeft) || (body && body.clientLeft) || 0);
		event.pageY = event.clientY +
			((doc && doc.scrollTop) || (body && body.scrollTop) || 0) -
			((doc && doc.clientTop) || (body && body.clientTop) || 0);
	}

	var mousePos = {
		x: event.pageX - rect.left,
		y: event.pageY - rect.top
	};

	return mousePos;
}

/**
 * Get the centre position of the canvas
 */
function getCanvasCentrePosition() {
	var canvas = document.getElementById("myCanvas");

	return {
		x: canvas.width / 2,
		y: canvas.height / 2
	};
}

/**
 * Draw cells on the JointJs Canvas
 * 
 * @param {*}
 *            id specified shape (cell) id
 */
function drawJointJS(id) {

	if (id == "goal" || id == "subGoal") {
		var cell = shapesGoal(100, 100, shapeName);
	} else if (id == "heart") {
		var cell = shapesHeart(100, 100, shapeName);
		cell.scale(1, 1.5);
	} else if (id == "spade") {
		var cell = shapesHeart(100, 100, shapeName);
		cell.scale(1, 1.5);
		cell.rotate(180);
	} else if (id == "quality") {
		var cell = shapeCloud(100, 100, shapeName);
	} else if (id == "actor") {
		var cell = shapeActor(100, 100, shapeName);
	}

	graph.addCell(cell);

}

// one click to highlight the element
paper.on("cell:pointerclick", function (cellView, evt, x, y) {
	var cell = cellView.model;
	cellView.highlight();
	cell.toFront();
});

// double click to unhighlight the element
paper.on("cell:pointerdblclick", function (cellView, evt, x, y) {
	cellView.unhighlight();
});

/**
 * Event of linking two elements by overlapping them
 */
// paper.on("cell:pointerup", function(cellView, evt, x, y) {
// // Find the first element below that is not a link nor the dragged element
// // itself.
// var elementBelow = graph.get("cells").find(function(cell) {
// if (cell instanceof joint.dia.Link)
// return false; // Not interested in links.
// if (cell.id === cellView.model.id)
// return false; // The same element as the dropped one.
// if (cell.getBBox().containsPoint(g.point(x, y))) {
// return true;
// }
// return false;
// });

// // If the two elements are connected already, don't
// // connect them again (this is application specific though).
// if (elementBelow
// && !_.contains(graph.getNeighbors(elementBelow), cellView.model)) {
// graph.addCell(new joint.dia.Link({
// source : {
// id : cellView.model.id
// },
// target : {
// id : elementBelow.id
// },
// attrs : {
// ".marker-source" : {
// d : "M 10 0 L 0 5 L 10 10 z"
// }
// }
// }));
// // Move the element a bit to the side.
// cellView.model.translate(-200, 0);
// }
// });

/**
 * Link two elements
 * 
 * @param {*}
 *            source
 * @param {*}
 *            target
 */
function link(source, target) {
	var cell = new joint.shapes.org.Arrow({
		source: {
			id: source.id
		},
		target: {
			id: target.id
		}
	});

	graph.addCell(cell);
}

/**
 * Draw images on Canvas, and reset the imageId to null
 */
function drawCanvas() {
	if (imageId != null) {
		drawJointJS(imageId);
		imageId = null;
	}
}

/**
 * Setting the global variable imageId to id
 * 
 * @param {*}
 *            id
 */
function setImageId(id) {
	imageId = id;
	shapeName = prompt("Object Name:");

	if (shapeName == null) {
		shapeName = "default";
	}
}

/**
 * Clear the graph
 */
function clearCanvas() {
	graph.clear();
}

/**
 * Save the current graph to JSON String
 */
function toJson() {
	json = JSON.stringify(graph);
	var blob = new Blob([json], {
		type: "text/plain;charset=utf-8"
	});
	saveAs(blob, "save" + ".json");
}

/**
 * Load the graph from the saved JSON String
 */
function toGraph() {
	graph.fromJSON(JSON.parse(json));
}

function requestJSON(treeJSON) {

	var xhr = new XMLHttpRequest();
	xhr.open( /* method */ "POST",
		/* target url */
		"/GoalModelEditor/requestJointJSON"
		/* , async, default to true */
	);
	xhr.overrideMimeType("application/octet-stream");
	console.log(treeJSON);
	xhr.send(treeJSON);
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				console.log("upload complete");
				console.log("response: " + xhr.responseText);
				/*var text = $("#textarea").val();
				  var filename = $("#input-fileName").val()*/
				graph.fromJSON(JSON.parse(xhr.responseText));
			}
		}
	}
}

// sent the treeJSON to server to convert it to XML format and save the data as
// a file.
function requestXML() {
	var fileType = $("#fileType option:selected").text();
	
	var filename = $("#txtBoxExportFilename").val();
	if (!filename) {
		filename = "save";
	}
	
	if (fileType == "XML") {
		var treeJSONOBJ = eachchild(root);
		var treeJSON = JSON.stringify(treeJSONOBJ);
		var xhr = new XMLHttpRequest();
		xhr.open( /* method */ "POST",
			/* target url */
			"/GoalModelEditor/requestXML"
			/* , async, default to true */
		);
		xhr.overrideMimeType("application/octet-stream");
		xhr.send(treeJSON);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					console.log("upload complete");
					console.log("response: " + xhr.responseText);
					/*
					 * var text = $("#textarea").val(); var filename =
					 * $("#input-fileName").val()
					 */
					var blob = new Blob([xhr.responseText], {
						type: "text/plain;charset=utf-8"
					});
					saveAs(blob, filename + ".xml");
				}
			}
		}
	} else if (fileType == "PNG") {
		exportPNG(filename);
	}
};


/**
 * D3 input list tree
 */
var margin = {
		top: 30,
		right: 20,
		bottom: 30,
		left: 20
	},
	width = 960 - margin.right - margin.left,
	height = 8000 - margin.top - margin.bottom,
	barHeight = 30,
	barWidth = width * 0.15;

var i = 0,
	duration = 300,
	root;

var svg = d3.selectAll(".input-list-tree")
	.append("svg")
	.attr("width", width + margin.right + margin.left)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var treeData;
var root;

var tree = d3.tree().nodeSize([0, 30]); // Invokes tree

function update(source) {
	// Compute the flattened node list. TODO use d3.layout.hierarchy.
	nodes = tree(root); // returns a single node with the properties of
	// d3.tree()
	nodesSort = [];

	d3.select("svg").transition().duration(duration); // transition to make
	// svg looks smoother

	// returns all nodes and each descendant in pre-order traversal (sort)
	nodes.eachBefore(function (n) {
		nodesSort.push(n);
	});

	// Compute the "layout".
	nodesSort.forEach(function (n, i) {
		n.x = i * barHeight;
	});

	// Update the nodes…
	var node = svg.selectAll("g.node").data(nodesSort, function (d) {
		return d.id || (d.id = ++i);
	}); // assigning id for each node

	var nodeEnter = node.enter().append("g").attr("class", "node").attr(
		"transform",
		function (d) {
			return "translate(" + source.y + "," + source.x + ")";
		}).style("opacity", 1e-6);

	// Enter any new nodes at the parent's previous position.
	nodeEnter.append("rect").attr("y", -barHeight / 2)
		.attr("height", barHeight).attr("width", barWidth).style("fill",
			color).on("dblclick", dblclick).on("click", display)

	nodeEnter.append("text").attr("dy", 3.5).attr("dx", 5.5).text(
		function (d) {
			return d.depth == 0 ? d.data.name : d.depth == 1 ? d.data.name :
				d.data.name;
		});

	// Transition nodes to their new position.
	nodeEnter.transition().duration(duration).attr("transform", function (d) {
		return "translate(" + d.y + "," + d.x + ")";
	}).style("opacity", 1);

	node.transition().duration(duration).attr("transform", function (d) {
		return "translate(" + d.y + "," + d.x + ")";
	}).style("opacity", 1).select("rect").style("fill", color);

	// Transition exiting nodes to the parent's new position.
	node.exit().transition().duration(duration).attr("transform", function (d) {
		return "translate(" + source.y + "," + source.x + ")";
	}).style("opacity", 1e-6).remove();

	nodes.eachBefore(function (d) {
		d.x0 = d.x;
		d.y0 = d.y;
	});
}

var loaded = false;
var loadedD;

function display(d) {

	document.getElementById("inputListForm").reset();
	document.getElementById("txtBoxGoal").value = d.data.name;
	document.getElementById("txtBoxActors").value = d.data.roles ? d.data.roles : "";
	document.getElementById("txtBoxQualities").value = d.data.qualities ? d.data.qualities : "";
	document.getElementById("txtBoxLikes").value = d.data.hearts ? d.data.hearts : "";
	document.getElementById("txtBoxDislikes").value = d.data.spades ? d.data.spades : "";
	document.getElementById("txtBoxSubGoals").value = "";

	loadedD = d;
	loaded = true;

}

function cleanInputList(){
	document.getElementById("txtBoxGoal").value="";
	document.getElementById("txtBoxActors").value="";
	document.getElementById("txtBoxQualities").value="";
	document.getElementById("txtBoxLikes").value="";
	document.getElementById("txtBoxDislikes").value="";
	document.getElementById("txtBoxSubGoals").value="";
}

// To update the JSON Object form the tree
function createTree() {
	treeData = {
		"roles": document.getElementById("txtBoxActors").value,
		"qualities": document.getElementById("txtBoxQualities").value,
		"hearts": document.getElementById("txtBoxLikes").value,
		"spades": document.getElementById("txtBoxDislikes").value,
		"children": [],
		"name": document.getElementById("txtBoxGoal").value
	};
	var subGoals = document.getElementById("txtBoxSubGoals").value.split(",");
	for (var i = 0; i < subGoals.length; i++) {
		myObj = {
			"roles": "",
			"qualities": "",
			"hearts": "",
			"spades": "",
			"children": [],
			"name": subGoals[i]
		};
		if (myObj.name != "") {
			treeData["children"].push(myObj);
		}
	}
	root = d3.hierarchy(treeData);
	update(root);
}

function updateTree() {
	loadedD.data.roles = document.getElementById("txtBoxActors").value;
	loadedD.data.qualities = document.getElementById("txtBoxQualities").value;
	loadedD.data.hearts = document.getElementById("txtBoxLikes").value;
	loadedD.data.spades = document.getElementById("txtBoxDislikes").value;
	loadedD.data.name = document.getElementById("txtBoxGoal").value;
	var temp;
	var subGoals = document.getElementById("txtBoxSubGoals").value.split(",");
	for (var i = 0; i < subGoals.length; i++) {
		myObj = {
			"roles": "",
			"qualities": "",
			"hearts": "",
			"spades": "",
			"children": [],
			"name": subGoals[i]
		};
		if (myObj.name != "") {
			temp = d3.hierarchy(myObj);
			temp.depth = loadedD.depth + 1;
			temp.height = loadedD.height - 1;
			temp.parent = loadedD;
			// temp.id = loaded.data.name;
			if (!loadedD.children) {
				loadedD.children = [];
				loadedD.data.children = [];
			}
			loadedD.data.children.push(temp.data);
			loadedD.children.push(temp);
		}
	}
	update(loadedD);
}

function deleteButton() {
	console.log("In delete button function");
	
	// this is the links target node which you want to remove
	var target = loadedD;
	var tempParent = target.parent;

	if(tempParent!= null){



	// make new set of children
	var children = [];
	
	// iterate through the children
	var childList = tempParent.children;
	

	if (childList) {
		var i = 0;
		if(childList.length>1){
			for (i = 0; i < childList.length; i++) {
				if(childList[i].id != target.id){
					children.push(childList[i]);
					
				}
				
			}
			tempParent.children = children;
		}else if(childList.length == 1){
			tempParent.children = null;
		}
	}

	// set the target parent with new set of children sans the one which is
	// removed


	update(tempParent);
}else{
	cleanInputList();
	createTree();

}
}

function updateButton() {
	if (loaded == false) {
		createTree();
	} else {
		updateTree();
	}
    document.getElementById("txtBoxSubGoals").value = "";
}

// Toggle children on click.
function dblclick(d) {
	if (d.children) {
		d._children = d.children;
		d.children = null;
	} else {
		d.children = d._children;
		d._children = null;
	}
	update(d);
}

function color(d) {
	return d._children ? "#3182bd" : d.children ? "#c6dbef" : "lightgreen";
}

function treeJSON2JointJSON() {
	var treeJSON = eachchild(root);
	requestJSON(JSON.stringify(treeJSON));
}

/**
 * Scroll bar
 */
var svg_scroll = d3.select("svg").node(),
	$parent = $('.inputListTree'),
	$parent_document_height = $(document),
	w = $parent.width(),
	h = $parent_document_height.height(),
	sL = $parent.scrollLeft(),
	sT = $parent_document_height.scrollTop();

var coordinates = d3.mouse(svg_scroll),
	x = coordinates[0],
	y = coordinates[1];

if (x > w + sL) {
	$parent.scrollLeft(x - w);
} else if (x < sL) {
	$parent.scrollLeft(x);
}
if (y > sT) {
	$parent_document_height.scrollTop(y);
} else if (y < sT) {
	$parent_document_height.scrollTop(y);
}

d3.select(this).attr({
	x: x - 50,
	y: y - 25
});

function eachchild(root) {
	var myObject = {};


	if (root.data.roles != "")
		myObject["roles"] = root.data.roles;
	if (root.data.qualities != "")
		myObject["qualities"] = root.data.qualities;
	if (root.data.hearts != "")
		myObject["hearts"] = root.data.hearts;
	if (root.data.spades != "")
		myObject["spades"] = root.data.spades;
	if (root.data.name != "")
		myObject["name"] = root.data.name;

	var childList = root.children;
	if (childList) {
		myObject["children"] = [];
		var i = 0;
		for (i = 0; i < childList.length; i++) {
			var child = eachchild(childList[i]);
			myObject["children"].push(child);
		}
	}
	return myObject;
};

/**
 * Exporting to Images
 */

// converting the paper to SVG format and export to PNG
function exportPNG(filename) {

	$(".connection").css("fill", "none");
	$(".link-tools").css("display", "none");
	$(".link-tools").css("fill", "none");
	
	var svgDoc = paper.svg;
	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgDoc);

	var canvas = document.getElementById("canvas");
	var context = canvas.getContext('2d');
	
	canvg(canvas, svgString);
	
	destinationCanvas = document.createElement("canvas");
	destinationCanvas.width = canvas.width;
	destinationCanvas.height = canvas.height;

	destCtx = destinationCanvas.getContext('2d');
	
	destCtx.fillStyle = "#FFFFFF";
	destCtx.fillRect(0, 0, canvas.width, canvas.height);
	
	destCtx.drawImage(canvas, 0, 0);
	
	var img = destinationCanvas.toDataURL("image/png");
	
	var downloadLink = document.createElement("a");
	downloadLink.href = img;
	downloadLink.download = filename + ".png";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}

function exportPNG2(filename) {
	
	$(".connection").css("fill", "none");
	$(".link-tools").css("display", "none");
	$(".link-tools").css("fill", "none");
	
	var canvas = document.getElementById('canvas');
	var svg = paper.svg;
	var context = canvas.getContext('2d');
	
	context.fillStyle = "white";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	var data = (new XMLSerializer()).serializeToString(svg);
	var encodedData = window.btoa(data);

	ctx.drawSvg('data:image/svg+xml;base64,' + encodedData);

	var DOMURL = window.URL || window.webkitURL || window;

	var img = new Image();
	var svgBlob = new Blob([data], {
		type: 'image/svg+xml;charset=utf-8'
	});
	
	var url = DOMURL.createObjectURL(svgBlob);

	img.onload = function () {
		ctx.drawImage(img, 0, 0);
		DOMURL.revokeObjectURL(url);

		var imgURI = canvas
			.toDataURL('image/png')
			.replace('image/png', 'image/octet-stream');
	};
	
	img.src = url;

	saveAs(svgBlob, filename + ".png");
}

function exportSVG() {
	$(".marker-arrowhead").css("display", "none");
	$(".tool-remove").css("display", "none");
	$(".tool-options").css("display", "none");
	$(".marker-vertices").css("display", "none");
	$(".connection-wrap").css("display", "none");

	$(".connection").css("fill", "none");
	$(".link-tools").css("display", "none");
	$(".link-tools").css("fill", "none");
	
	var svgDoc = paper.svg;
	var serializer = new XMLSerializer();
	var svgString = serializer.serializeToString(svgDoc);
	
	svgString = '<?xml version="1.0" standalone="no"?>\r\n' + svgString;
	
	var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgString);
	
	var downloadLink = document.createElement("a");
	downloadLink.href = url;
	downloadLink.download = "model.svg";
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}


// load the local file and sent it to server to convert it to JSON struture.
function uploadAndSubmit() {
	var form = document.forms["demoForm"];

	if (form["inputfile"].files.length > 0) {
		var file = form["inputfile"].files[0];
		// try sending
		var reader = new FileReader();

		reader.onloadstart = function () {
			console.log("onloadstart");
		};
		reader.onprogress = function (p) {
			console.log("onprogress");
		};

		reader.onload = function () {
			console.log("load complete");
		};

		reader.onloadend = function () {
			if (reader.error) {
				console.log(reader.error);
			} else {
				// create xml object to sent request.
				var xhr = new XMLHttpRequest();
				xhr.open(
					/* method */
					"POST",
					/* target url */
					"/GoalModelEditor/XMLUpload?fileName=" + file.name
					/* , async, default to true */
				);
				xhr.overrideMimeType("application/octet-stream");
				console.log(reader.result);
				xhr.send(reader.result);
				xhr.onreadystatechange = function () {
					if (xhr.readyState == 4) {
						if (xhr.status == 200) {
							console.log("upload complete");
							console.log("response: " + xhr.responseText);
							data = xhr.responseText;
							root = d3.hierarchy(JSON.parse(data));
							// Initalize function
							update(root);
							treeJSON2JointJSON();
						}
					}
				};
			}
		};

		reader.readAsBinaryString(file);
	} else {
		alert("Please choose a file.");
	}
}