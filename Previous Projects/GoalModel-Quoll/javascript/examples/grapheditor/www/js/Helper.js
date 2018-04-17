
// hidden goal taxt color, change to other color, if required
var hiddenColor = "#D3D3D3";

// original text color
var showColor = "black";

var highLightColor = '#ff0000';

var goalLimit = 10;

var subgoalLimit = 10;

var splitSymbol = ",";

var splitIDConnection = "-";

var goalIconString = "images/goal.png";
var subGoalIconString = "images/subgoal.png";
var heartIconString = "images/heart.png";
var negativeIconString = "images/negative_goal.png";
var stakeHolderIconString = "images/stakeholder.png";
var cloudIconString = "images/cloud.png";

var parallelogramWidth = 180;
var parallelogramHeight = 70;
// When to break for a new line in parallelogram
var parallelogramTextWidth = 105/180 * parallelogramWidth;

var cloudWidth = 120;
var cloudHeight = 80;

var heartWidth = 100;
var heartHeight = 90;

var spadeWidth = 88;
var spadeHeight = 80;

var layoutLevelDistance = 90;
var layoutNodeDistance = 10;

/*
	William Zai Pan
*/
var generateXMLAndRefreshCanvas = function(textareaString, editorUi){
	// XML parser (Parses xml input from original graph)
        var parser = new DOMParser();
        var xmlvalue = mxUtils.trim(mxUtils.getXml(editorUi.editor.getGraphXml()));
        var xmlDoc = parser.parseFromString(xmlvalue, "text/xml");
		var rootXML = xmlDoc.getElementsByTagName("root")[0];

		var graphModel = xmlDoc.getElementsByTagName("mxGraphModel")[0];
		graphModel.setAttribute("connect","1");
		graphModel.setAttribute("arrows","1");

		inializeXML(rootXML);

		editorUi.childMap = {};
		editorUi.nodeList = [];

        editorUi.parentMap = {};
        editorUi.levelMap = {};
        editorUi.depthMap = {};
		// Split input list string by new line
		var inputList = textareaString.split(/\r?\n/);
		var valueToID = {};
    var initialNodes=[];
    var childrenArrayls={};
    for (var i=0;i<inputList.length;i++){
      var parentString = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
      if (parentString.length==3){
        initialNodes.push(parentString);
        rootXML.appendChild(parallelogram("id"+parentString[1], parentString[2].replace(/['"]+/g, ''), 354, 60, parentString));
      }
    }
		//var parentString = inputList[0].match(/(?:[^\s"]+|"[^"]*")+/g);

    var initialNode = initialNodes[0];

		// Add initial parallelogram
		//rootXML.appendChild(parallelogram("id"+parentString[1], parentString[2].replace(/['"]+/g, ''), 354, 60, parentString));

        // Find all the children of each node and add as children
		for (var i=0; i<inputList.length; i++){
            var childrenArray = [];
            var parentInput = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
            var pValue = parentInput[1];
            var parraArray = [];
            editorUi.nodeList.push(parentInput);
            for (var j=0; j<inputList.length; j++){
                var childInput = inputList[j].match(/(?:[^\s"]+|"[^"]*")+/g);
                var cParent = childInput[3];
                if (cParent == pValue){
                	childrenArray.push(childInput);
                	//if (childInput[0] == "p" || childInput[0] == "f")
                	parraArray.push(childInput);
                    editorUi.parentMap[childInput] = parentInput;
				}
            }
            // Add all children shapes
            if (childrenArray.length > 0){
                childrenArrayls[parentInput]=childrenArray;
                //addChildren(rootXML, parentInput, childrenArray);
			       }
			// Add to dictionary storing children
			editorUi.childMap[parentInput] = parraArray;
		}
    for (var i=0; i<inputList.length; i++){
      var parentInput = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
      if (childrenArrayls[parentInput]){
          addChildren(rootXML, parentInput, childrenArrayls[parentInput],editorUi.childMap);
       }

    }
        var searchQueue = [];
        var depth = 0;
        searchQueue.push(initialNode);
        // Add inital value to depthMap
        editorUi.depthMap[initialNode] = depth;
        // BFS search to generate data structures
        while(searchQueue.length > 0){
            // Store depth vs nodes
            editorUi.levelMap[depth] = searchQueue;
            var nextQueue = [];
            // Iterate through nodes on current depth
            for (var i=0; i<searchQueue.length; i++){
                var children = editorUi.childMap[searchQueue[i]];
                // Add all children (next depth) to the search list
                for (var j=0; j<children.length; j++){
                    editorUi.depthMap[children[j]] = depth+1;
                    nextQueue.push(children[j]);
                }
            }
            searchQueue = nextQueue;
            depth += 1;
        }

    var xmlArray = Array.prototype.slice.call(rootXML, 0);
    xmlArray.sort(function(a,b) {
      var aCat = a.getAttribute("style");
      var bCat = a.getAttribute("style")
      if (aCat == null) return 1;
      if (bCat == null) return -1;
      if (aCat.indexOf("edgeStyle") >= 0) return -1;
      if (bCat.indexOf("edgeStyle") >= 0) return 1;
      return 0;
    });
    
		// Output xml string
		var xmlString = new XMLSerializer().serializeToString(xmlDoc.documentElement);
		var data = editorUi.editor.graph.zapGremlins(mxUtils.trim(xmlString));


		//setting the graph in a vertical tree
		var layout = new mxCompactTreeLayout(editorUi.editor.graph, false);
		layout.edgeRouting = false;
		layout.levelDistance = layoutLevelDistance;
		layout.nodeDistance = layoutNodeDistance;
		mxGraph.prototype.cellsMovable = true;
		editorUi.editor.graph.model.beginUpdate();
		try
		{
			editorUi.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
			newRepositionTree(editorUi);
			mxGraph.prototype.cellsMovable = false;
			// LATER: Why is hideDialog between begin-/endUpdate faster?
			editorUi.hideDialog();
		}
		catch (e)
		{
            console.log(e);
			error = e;
		}
		finally
		{
			editorUi.editor.graph.model.endUpdate();
		}
        //updateCellSize(editorUi);
		return [initialNodes, editorUi.childMap];

}

/**
 * Reads XML from editor and converts into readable input list
 * @param editorUi Editor containing XML
 * @returns {string} String of readable input list
 */
var readInputList = function (editorUi)
{
    var textarea = document.getElementById('sidebarTextarea');
    return textarea.value;
}

/**
 * Reads XML from editor and converts into readable input list
 * @param InputList Text value of the inputlist
 * @param editorUi Editor containing XML
 */
var updateNodeList = function (InputList,editorUi)
{
    editorUi.nodeList = [];
    var inputList = InputList.split(/\r?\n/);
    for (var i=0; i<inputList.length; i++){
        var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
        var currentNode = [];
        for(var j = 0; j < string.length; j++){
            currentNode.push(string[j]);
        }
        editorUi.nodeList.push(currentNode);
    }
}
var rightShiftvertical=function(rootXML,childMap,node,shift){
    var childlength=0;
    for (var i=0;i<childMap[node].length;i++){
      if (childMap[node][i][0]=="sg"){
        childlength++;
      }
    }
    if (childlength==0){
      return shift;
    }else{
      var maxshift=0;
      for (var i=0;i<childMap[node].length;i++){
        if (childMap[node][i][0]=="sg"){
          var cwidth=parseFloat(findByID(rootXML, "id"+childMap[node][i][1]).childNodes[0].getAttribute("width"));
          var cshift=arguments.callee(rootXML,childMap,childMap[node][i],cwidth+10);
          if (cshift>maxshift){
            maxshift=cshift;
          }
        }
      }
      if (shift==0){
        return maxshift;
      }else{
        return shift-(shift-10)/2+maxshift;
      }
    }
  }
var GoThroughTree=function(rootXML,node,shiftx,shifty,childMap){
	if(childMap[node].length==0){
		return;
	}
	for (var i=0;i<childMap[node].length;i++){
		if(childMap[node][i][0]!="p" && childMap[node][i][0]!="f" && childMap[node][i][0]!="sg"){
			continue;
		}
		arguments.callee(rootXML,childMap[node][i],shiftx,shifty,childMap);
		shifting(rootXML,childMap[node][i],shiftx,shifty);
    if (isVertical(childMap[node],node,childMap,true) && childMap[node][i][0]=="sg"){
      var edgepoint=findByID(rootXML,"id"+node[1]+"id"+childMap[node][i][1]).childNodes[0].childNodes[0].childNodes[0];
      edgeshifting(rootXML,edgepoint,shiftx,shifty);
    }
	}
}
var shifting=function(rootXML,node,shiftx,shifty){
	var x = parseInt(findByID(rootXML,"id"+node[1]).childNodes[0].getAttribute("x"));
	var y = parseInt(findByID(rootXML, "id"+node[1]).childNodes[0].getAttribute("y"));
	findByID(rootXML, "id"+node[1]).childNodes[0].setAttribute("x",x+shiftx);
	findByID(rootXML, "id"+node[1]).childNodes[0].setAttribute("y",y+shifty);
}
var edgeshifting=function(rootXML,edge,shiftx,shifty){
	var x = parseInt(edge.getAttribute("x"));
	var y = parseInt(edge.getAttribute("y"));
	edge.setAttribute("x",x+shiftx);
	edge.setAttribute("y",y+shifty);
}
/**
 * Repositions the tree so that non-functional goals do not overlap
 * @param editorUi Editor containing XML
 */
var newRepositionTree = function(editorUi)
{
    // XML parser (Parses xml input from original graph)
    var parser = new DOMParser();
    var xmlvalue = mxUtils.trim(mxUtils.getXml(editorUi.editor.getGraphXml()));
    var xmlDoc = parser.parseFromString(xmlvalue, "text/xml");
    var rootXML = xmlDoc.getElementsByTagName("root")[0];

    var oldAttributes = {};
    var vertright={};
    // Iterate through every node
    for (var i=0; i<editorUi.nodeList.length; i++){
        var node = editorUi.nodeList[i];
        var nodeValue = findByID(rootXML, "id"+node[1]);
        var nodeXmlGeometry = nodeValue.childNodes[0];

        // Ignore non-functional goals
        if ( node[0] != "p" && node[0] != "f" && node[0]!="sg")
            continue;
            // Ignore root node
        if (node.length != 4 || editorUi.parentMap[node] == null){

        }else{
        var shapes = []
        var count = 0;
        var leftShift = 0
        var rightShift = 0
        // Find non-functional goals to the left and right of node
        for (var j=0; j<editorUi.childMap[node].length;j++){
            var shape = editorUi.childMap[node][j][0];
            // Finds the maximum area to the right of the parallelogram
            if (["h","e","a","s"].indexOf(shape) >= 0){
                var childNode = findByID(rootXML, "id" + editorUi.childMap[node][j][1]);
                var childNodeGeom = childNode.childNodes[0];
                rightShift += parseFloat(childNodeGeom.getAttribute("width"));
                if (editorUi.childMap[node][j][0]=="a" ||editorUi.childMap[node][j][0]=="s" ){
                  var actorlength=editorUi.childMap[node][j][2].split(",").length;
                  if(actorlength>1 && actorlength<4)
                    rightShift += parseFloat(childNodeGeom.getAttribute("width"))*(actorlength-1);
                }else if(actorlength>=4){
                  rightShift += parseFloat(childNodeGeom.getAttribute("width"))*2;
                }
            }
            // Finds the maximum area to the left of the parallelogram
            else if (["c","q","n"].indexOf(editorUi.childMap[node][j][0]) >= 0){
                var childNode = findByID(rootXML, "id" + editorUi.childMap[node][j][1]);
                var childNodeGeom = childNode.childNodes[0];
                leftShift += parseFloat(childNodeGeom.getAttribute("width"));
            }
            shapes.push(shapes);
        }
        var toright=0;

        if (isVertical(editorUi.childMap[node],node,editorUi.childMap,true)){
          var toright=rightShiftvertical(rootXML,editorUi.childMap,node,0)-parseFloat(nodeXmlGeometry.getAttribute("width"))/2;
          if (toright >rightShift){
            rightShift=toright;
          }
        }
        vertright[node[1]]=toright;
        var maxShift = Math.max(leftShift, rightShift);
        if (toright>0 && toright==maxShift){
          oldAttributes[node[1]] = leftShift;
          nodeXmlGeometry.setAttribute("width", parseFloat(nodeXmlGeometry.getAttribute("width")) + toright+leftShift);
          nodeXmlGeometry.setAttribute("x", parseFloat(nodeXmlGeometry.getAttribute("x")) - leftShift);
        }else {
        // Store the shift amount for every parallelogram node
        oldAttributes[node[1]] = 2*maxShift;
        // Increase size to fit on the right and left of node
        nodeXmlGeometry.setAttribute("width", parseFloat(nodeXmlGeometry.getAttribute("width")) + 2*maxShift);
        nodeXmlGeometry.setAttribute("x", parseFloat(nodeXmlGeometry.getAttribute("x")) - (2*maxShift)/2);
        }
      }
    }

    //setting the graph in a vertical tree
    var layout = new mxCompactTreeLayout(editorUi.editor.graph, false);
    layout.edgeRouting = false;
    layout.levelDistance = layoutLevelDistance;
    layout.nodeDistance = layoutNodeDistance;

    // Formats tree to fit surrounding paralleograms
    editorUi.editor.setGraphXml(rootXML);
    var roots=[];
    var cells=editorUi.editor.graph.getChildCells();
    for (var i=0;i<cells.length;i++){
      for (var j=0;j<editorUi.nodeList.length;j++){
        if (editorUi.nodeList[j].length!=3){
          continue;
        }
        if (editorUi.nodeList[j].toString()==cells[i].inputString){
          roots.push(editorUi.nodeList[j]);
          layout.execute(editorUi.editor.graph.getDefaultParent(), cells[i]);
        }
      }
      /*if (cells[i].inputString && cells[i].inputString.split(",").length==3){
        roots.push(cells[i]);
        layout.execute(editorUi.editor.graph.getDefaultParent(), cells[i]);
      }*/
    }
    // Revaluate xml
    xmlvalue = mxUtils.trim(mxUtils.getXml(editorUi.editor.getGraphXml()));
    xmlDoc = parser.parseFromString(xmlvalue, "text/xml");
    rootXML = xmlDoc.getElementsByTagName("root")[0];
    // Iterate through every node
    for (var i=0; i<editorUi.nodeList.length; i++){
        node = editorUi.nodeList[i];
        nodeValue = findByID(rootXML, "id"+node[1]);
        nodeXmlGeometry = nodeValue.childNodes[0];

        // Ignore non-functional goals
        if (node[0] != "p" && node[0] != "f" && node[0]!="sg")
            continue;
            // Ignore root node
        if (node.length != 4 || editorUi.parentMap[node] == null){
        }else{
        if (node[0]!="sg" ||(node[0]=="sg" && isVertical(editorUi.childMap[node],node,editorUi.childMap,true))){
          // Changes parallelograms back to original size and position
          if (vertright[node[1]]>0 && vertright[node[1]]> oldAttributes[node[1]]){
            nodeXmlGeometry.setAttribute("width", parseFloat(nodeXmlGeometry.getAttribute("width")) - oldAttributes[node[1]]-vertright[node[1]]);
            nodeXmlGeometry.setAttribute("x", parseFloat(nodeXmlGeometry.getAttribute("x")) + oldAttributes[node[1]]/2);
          }else{
          nodeXmlGeometry.setAttribute("width", parseFloat(nodeXmlGeometry.getAttribute("width")) - oldAttributes[node[1]]);
          nodeXmlGeometry.setAttribute("x", parseFloat(nodeXmlGeometry.getAttribute("x")) + oldAttributes[node[1]]/2);
          }
        }
        }
        if (isVertical(editorUi.childMap[node],node,editorUi.childMap,true)){
          var childrenbefore=0;
          var height=parseFloat(nodeXmlGeometry.getAttribute("height"));
					var padding=10;
					var firsty=parseInt(findByID(rootXML, "id" +node[1]).childNodes[0].getAttribute("y"))+height+padding;
          if (node[0]=="f"|| node[0]=="p"){
            firsty=parseInt(findByID(rootXML, "id" +node[1]).childNodes[0].getAttribute("y"))+height+layoutLevelDistance;
          }
          var shifty=0;
          var x=parseFloat(nodeXmlGeometry.getAttribute("x"))+parseFloat(nodeXmlGeometry.getAttribute("width")/2+10);
          for (var j=0;j<editorUi.childMap[node].length;j++){
            if (editorUi.childMap[node][j][0]!="sg"){
              continue;
            }
            //shifty=(childrenbefore)*(30+padding);
            //shifty+=childinTotal(rootXML,editorUi.childMap,editorUi.childMap[node][j],0);
            var childValue=findByID(rootXML, "id"+ editorUi.childMap[node][j][1]);
            var childXmlGeometry=childValue.childNodes[0];
            childXmlGeometry.setAttribute("x",x);
            childXmlGeometry.setAttribute("y",firsty+shifty);
            shifty+=childinTotal(rootXML,editorUi.childMap,editorUi.childMap[node][j],0);
            var edgeValue=findByID(rootXML, "id"+ node[1]+"id"+editorUi.childMap[node][j][1]);
            Addpoints(edgeValue.childNodes[0],x-10,parseFloat(childXmlGeometry.getAttribute("y"))+parseFloat(childXmlGeometry.getAttribute("height"))/2);
            //var temp=
          }
        }
    }
    var lowest=0;
    for (var i=0;i<roots.length;i++){
      var rootvalue=roots[i];
      if (i>0){
        for (var j = 0; j < rootXML.children.length; j++){
  		    if (rootXML.childNodes[j].childNodes.length>0){
  			       if (parseFloat(rootXML.childNodes[j].childNodes[0].getAttribute("y"))>lowest){
                 lowest=parseFloat(rootXML.childNodes[j].childNodes[0].getAttribute("y"))+parseFloat(rootXML.childNodes[j].childNodes[0].getAttribute("height"));
               }
  		    }
  	    }
       }
      var diffx=354-findByID(rootXML, "id"+roots[i][1]).childNodes[0].getAttribute("x");
      findByID(rootXML, "id"+roots[i][1]).childNodes[0].setAttribute("x",354);
      findByID(rootXML, "id"+roots[i][1]).childNodes[0].setAttribute("y",lowest+layoutLevelDistance);
      GoThroughTree(rootXML,rootvalue,diffx,lowest-60+layoutLevelDistance,editorUi.childMap);
    }
    editorUi.editor.setGraphXml(rootXML);
    return rootXML;
}
var childinTotal=function(rootXML,childMap,node,height){
  var childValue=findByID(rootXML, "id"+ node[1]);
  var childXmlGeometry=childValue.childNodes[0];
  var cheight=  parseFloat(childXmlGeometry.getAttribute("height"));
	if(childMap[node].length==0){
		return cheight+10;
	}
	for (var i=0;i<childMap[node].length;i++){
		height+=arguments.callee(rootXML,childMap,childMap[node][i],height);
	}
	height+=cheight+10;
	return height;
}
var childinTotalheight=function(rootXML,childMap,node,count){
	if(childMap[node].length==0){
		return 1;
	}
	for (var i=0;i<childMap[node].length;i++){
		count+=arguments.callee(rootXML,childMap,childMap[node][i],count);
	}
	count++;
	return count;
}
  var Addpoints =function(cellgeo,x,y){
    var xmlMXArray=document.createElementNS("","Array");
    xmlMXArray.setAttribute("as","points");
    var xmlMXPoint=document.createElementNS("","mxPoint");
    xmlMXPoint.setAttribute("x",x);
    xmlMXPoint.setAttribute("y",y);
    xmlMXArray.appendChild(xmlMXPoint);
    cellgeo.appendChild(xmlMXArray);
 }

// Finds the pixel length of a string
String.prototype.width = function(font) {
  var f = font || '12px helvetica',
      o = $('<div>' + this + '</div>')
            .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
            .appendTo($('body')),
      w = o.width();

  o.remove();

  return w;
}
var isVertical = function (childrenArray,node,childMap,first){
  var childlength=0;
  for (var i=0;i<childrenArray.length;i++){
    if (childrenArray[i][0]=="f"||childrenArray[i][0]=="p"||childrenArray[i][0]=="sg"){
      childlength++;
    }
  }
	if (childlength>0){
		for (var c = 0; c<childrenArray.length;c++){
      if (childrenArray[c][0]!="f" && childrenArray[c][0]!="p" && childrenArray[c][0]!="sg"){
        continue;
      }
			if (childrenArray[c][0]!="sg"){
			   return false;
			}else{
         if (arguments.callee(childMap[childrenArray[c]],childrenArray[c],childMap,false)){
           continue;
         }else{
           return false;
         }
      }
		}
	}
  if (childlength==0){
    if (first){
      return false;
    }else{
  	   return true;
    }
  }
  return true;
}
/**
 * Constucts an xml document for a parallelogram
 * @param id ID value for the parallelogram
 * @param value Value
 * @param x X coordinate
 * @param y Y coordinate
 * @param parent Parent ID
 * @returns {Element}
 */
var parallelogram = function(id, value, x, y, inputString,isvert)
{
    var valueList = value.replace(/["]+/g,"").split(" ");
    var i = 0;
    while (i+1 < valueList.length-1){
        if (valueList[i].width() + valueList[i+1].width() + " ".width() < parallelogramTextWidth){
            valueList[i] = valueList[i] + " " + valueList[i+1];
            valueList.splice(i+1, 1);
        }
        else{
            i += 1;
        }
    }
    var newTextValue = valueList.join("<div>");
    var longest = valueList.sort(function (a, b) { return b.length - a.length; })[0];
    var height=parallelogramHeight
    if (isvert){
      height=20;
    }
    var newHeight = Math.max(height, 15*valueList.length);
    var newWidth = Math.max(parallelogramWidth, 225/133*(longest.width()));
    var xmlMXCell = document.createElementNS("","mxCell");
    xmlMXCell.setAttribute("id", id);
    xmlMXCell.setAttribute("value", newTextValue);
    xmlMXCell.setAttribute("style", "shape=parallelogram;whiteSpace=nowrap;html=1;perimeter=parallelogramPerimeter");
    xmlMXCell.setAttribute("vertex", "1");
    xmlMXCell.setAttribute("parent", "1");
    xmlMXCell.setAttribute("inputString", inputString);

    var xmlMXGeometry = document.createElementNS("","mxGeometry");
    xmlMXGeometry.setAttribute("x", x);
    xmlMXGeometry.setAttribute("y", y);
    xmlMXGeometry.setAttribute("width", newWidth);
    xmlMXGeometry.setAttribute("height", newHeight);
    xmlMXGeometry.setAttribute("as", "geometry");

    xmlMXCell.appendChild(xmlMXGeometry);

    return xmlMXCell;
}

/**
 * Constucts an xml document for a heart
 * @param id ID value for the heart
 * @param value Value
 * @param x X coordinate
 * @param y Y coordinate
 * @param parent Parent ID
 * @returns {Element}
 */
var heart = function (id, value, x, y, parent, inputString) {
    var valueList = value.replace(/["]+/g,"").split(splitSymbol);
    var sortedValue = valueList;
    sortedValue.sort(function(a, b) {
        return b.width() - a.width() || [a,b].sort()[0]===b;
    });
    var newTextValue = sortedValue.join("<div>");
    var newHeight = Math.max(heartHeight, 25*sortedValue.length);
    var newWidth = Math.max(heartHeight, 3/2*(sortedValue[0].width()));

    var xmlMXCell = document.createElementNS("","mxCell");
    xmlMXCell.setAttribute("id", id);
    xmlMXCell.setAttribute("value", newTextValue);
    xmlMXCell.setAttribute("style", "shape=mxgraph.basic.heart;whiteSpace=nowrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;");
    xmlMXCell.setAttribute("vertex", "1");
    xmlMXCell.setAttribute("parent", parent);
    xmlMXCell.setAttribute("inputString", inputString);

    var xmlMXGeometry = document.createElementNS("","mxGeometry");
    xmlMXGeometry.setAttribute("x", x);
    xmlMXGeometry.setAttribute("y", y);
    xmlMXGeometry.setAttribute("width", newWidth);
    xmlMXGeometry.setAttribute("height", newHeight);
    xmlMXGeometry.setAttribute("as", "geometry");

    xmlMXCell.appendChild(xmlMXGeometry);

    return xmlMXCell;
}

/**
 * Constucts an xml document for a cloud
 * @param id ID value for the cloud
 * @param value Value
 * @param x X coordinate
 * @param y Y coordinate
 * @param parent Parent ID
 * @returns {Element}
 */
var cloud = function (id, value, x, y, parent, inputString) {
    var valueList = value.replace(/["]+/g,"").split(splitSymbol);
    var sortedValue = valueList;
    sortedValue.sort(function(a, b) {
        return b.width() - a.width() || [a,b].sort()[0]===b;
    });
    var newTextValue = valueList.join("<div>");
    var newHeight = Math.max(cloudHeight, 25*sortedValue.length);
    var newWidth = Math.max(cloudWidth, 3/2*(sortedValue[0].width()));
    var newX = x-(newWidth-cloudWidth);

    var xmlMXCell = document.createElementNS("","mxCell");
    xmlMXCell.setAttribute("id", id);
    xmlMXCell.setAttribute("value", newTextValue);
    xmlMXCell.setAttribute("style", "ellipse;shape=cloud;whiteSpace=nowrap;html=1;");
    xmlMXCell.setAttribute("vertex", "1");
    xmlMXCell.setAttribute("parent", parent);
    xmlMXCell.setAttribute("inputString", inputString);

    var xmlMXGeometry = document.createElementNS("","mxGeometry");
    xmlMXGeometry.setAttribute("x", newX);
    xmlMXGeometry.setAttribute("y", y);
    xmlMXGeometry.setAttribute("width", newWidth);
    xmlMXGeometry.setAttribute("height", newHeight);
    xmlMXGeometry.setAttribute("as", "geometry");

    xmlMXCell.appendChild(xmlMXGeometry);

    return xmlMXCell;
}

/**
 * Constucts an xml document for a actor
 * @param id ID value for the actor
 * @param value Value
 * @param x X coordinate
 * @param y Y coordinate
 * @param parent Parent ID
 * @returns {Element}
 */
var actor = function (id, value, x, y, parent, inputString) {
    value = value.replace(/[;]+/g,"<div>").replace(/["]+/g,"<div>");
    var valueList = value.replace(/["]+/g,"").split(splitSymbol);
    var newTextValue = valueList.join("<div>");

    var xmlMXCell = document.createElementNS("","mxCell");
    xmlMXCell.setAttribute("id", id);
    xmlMXCell.setAttribute("value", newTextValue);
    xmlMXCell.setAttribute("style", "shape=umlActor;verticalLabelPosition=bottom;verticalAlign=top;html=1;");
    xmlMXCell.setAttribute("vertex", "1");
    xmlMXCell.setAttribute("parent", parent);
    xmlMXCell.setAttribute("inputString", inputString);

    var xmlMXGeometry = document.createElementNS("","mxGeometry");
    xmlMXGeometry.setAttribute("x", x);
    xmlMXGeometry.setAttribute("y", y);
    xmlMXGeometry.setAttribute("width", 40);
    xmlMXGeometry.setAttribute("height", 80);
    xmlMXGeometry.setAttribute("as", "geometry");

    xmlMXCell.appendChild(xmlMXGeometry);

    return xmlMXCell;
}

/**
 * Constucts an xml document for a spade
 * @param id ID value for the spade
 * @param value Value
 * @param x X coordinate
 * @param y Y coordinate
 * @param parent Parent ID
 * @returns {Element}
 */
var spade = function (id, value, x, y, parent, inputString) {
    var valueList = value.replace(/["]+/g,"").split(splitSymbol);
    var sortedValue = valueList;
    sortedValue.sort(function(a, b) {
        return b.width() - a.width() || [a,b].sort()[0]===b;
    });
    sortedValue.reverse();
    var newTextValue = sortedValue.join("<div>");
    var newHeight = Math.max(spadeHeight, 25*sortedValue.length);
    var newWidth = Math.max(spadeWidth, 3/2*(sortedValue[sortedValue.length-1].width()));

    var xmlMXCell = document.createElementNS("","mxCell");
    xmlMXCell.setAttribute("id", id);
    xmlMXCell.setAttribute("value", newTextValue);
    xmlMXCell.setAttribute("style", "shape=mxgraph.basic.spade;whiteSpace=nowrap;html=1;fillColor=#ffffff;strokeColor=#000000;strokeWidth=1;");
    xmlMXCell.setAttribute("vertex", "1");
    xmlMXCell.setAttribute("parent", parent);
    xmlMXCell.setAttribute("inputString", inputString);


    var xmlMXGeometry = document.createElementNS("","mxGeometry");
    xmlMXGeometry.setAttribute("x", x);
    xmlMXGeometry.setAttribute("y", y);
    xmlMXGeometry.setAttribute("width", newWidth);
    xmlMXGeometry.setAttribute("height", newHeight);
    xmlMXGeometry.setAttribute("as", "geometry");

    xmlMXCell.appendChild(xmlMXGeometry);

    return xmlMXCell;
}

/**
 * Constucts an xml document for an arrow
 * @param id ID for arrow
 * @param fromid ID for where the arrow begins
 * @param toid ID for where the arrow ends
 * @returns {Element}
 */
var arrow=function(id,fromid,toid,isvert)
{
    var xmlMXCell = document.createElementNS("","mxCell");
    xmlMXCell.setAttribute("id", id);
    if (isvert){
      xmlMXCell.setAttribute("style","edgeStyle=orthogonalEdgeStyle;rounded=0;comic=0;jumpStyle=none;html=1;entryX=0;entryY=0.5;endArrow=none;endFill=0;jettySize=auto;orthogonalLoop=1;strokeColor=#000000;");
    }else{
      xmlMXCell.setAttribute("style", "rounded=0;html=1;jettySize=auto;orthogonalLoop=1;endArrow=none;endFill=0;edgeStyle=elbowEdgeStyle;elbow=vertical;");
    }
    xmlMXCell.setAttribute("edge", "1");
    xmlMXCell.setAttribute("parent", "1");
    xmlMXCell.setAttribute("source", fromid);
    xmlMXCell.setAttribute("target", toid);

    var xmlMXGeometry = document.createElementNS("","mxGeometry");
    xmlMXGeometry.setAttribute("relative", "1");
    xmlMXGeometry.setAttribute("as", "geometry");

    xmlMXCell.appendChild(xmlMXGeometry);

    return xmlMXCell;
}
/**
 * Constucts an xml document for dot textbox
 * @param id ID for the dot
 * @param fromid ID for where the dot begins
 * @param toid ID for where the dot ends
 * @returns {Element}
 */
var actordot=function(id, x, y, parent, inputString)
{
  var xmlMXCell = document.createElementNS("","mxCell");
  xmlMXCell.setAttribute("id", id);
  xmlMXCell.setAttribute("value", "...");
  xmlMXCell.setAttribute("style", "text;html=1;resizable=0;points=[];autosize=1;align=left;verticalAlign=top;spacingTop=-4;" );
  xmlMXCell.setAttribute("vertex", "1");
  xmlMXCell.setAttribute("parent", parent);
  xmlMXCell.setAttribute("inputString", inputString);

  var xmlMXGeometry = document.createElementNS("","mxGeometry");
  xmlMXGeometry.setAttribute("x", x);
  xmlMXGeometry.setAttribute("y", y);
  xmlMXGeometry.setAttribute("width", 40);
  xmlMXGeometry.setAttribute("height", 20);
  xmlMXGeometry.setAttribute("as", "geometry");

  xmlMXCell.appendChild(xmlMXGeometry);

  return xmlMXCell;
}

/**
 * Initializes the XML for a new canvas
 * @param rootXML root XML value to initialize
 */
var inializeXML = function(rootXML)
{
	// Delete all children
	rootXML.innerHTML = "";

	var xmlMXCell0 = document.createElementNS("","mxCell");
	xmlMXCell0.setAttribute("id", 0);
	rootXML.appendChild(xmlMXCell0);

	var xmlMXCell1 = document.createElementNS("","mxCell");
	xmlMXCell1.setAttribute("id", 1);
	xmlMXCell1.setAttribute("parent", 0);
	rootXML.appendChild(xmlMXCell1);
  mxGraph.prototype.keepEdgesInBackground=true;
}


/**
 * Add all children to a parent parallelogram
 * @param rootXML Root XML
 * @param valueToID Conversion from value to ID
 * @param parentInput Parent input values
 * @param childrenArray Children input values in array
 */
var addChildren = function (rootXML, parentInput, childrenArray,childMap) {
    var parentID = "id" + parentInput[1];
    var pCount = 0;
    // Total parallelogram count
    for (var i=0; i<childrenArray.length; i++)
        if (childrenArray[i][0] == "p" || childrenArray[i][0] == "f") pCount ++;
    var cCount = 0;
    var shapes = ["p"];
    var shapesID = [parentID];
    for (var i=0; i<childrenArray.length; i++){
        var cShape = childrenArray[i][0];
        var childID = "id" + childrenArray[i][1];
        var cValue = childrenArray[i][2].replace(/['"]+/g, '');
        switch (cShape) {
            case "sg":
                var width = parallelogramWidth;
                var padding = 120;
                var x = (width + padding) * cCount - ((width + padding) * (pCount - 1)) / 2;
                var y = padding;
                if (isVertical(childrenArray,parentInput,childMap,true)){
                  rootXML.appendChild(parallelogram(childID, cValue, x, y, childrenArray[i],true));
                  // Generates unique id by using childID and parentID
                  rootXML.appendChild(arrow(parentID+childID, parentID, childID,true));
                }else{
                  rootXML.appendChild(parallelogram(childID, cValue, x, y, childrenArray[i],false));
                  // Generates unique id by using childID and parentID
                  rootXML.appendChild(arrow(parentID+childID, parentID, childID,false));
                }
                cCount ++;
                break;
            case "p":
            case "f":
                var width = parallelogramWidth;
                var padding = 120;
                var x = (width + padding) * cCount - ((width + padding) * (pCount - 1)) / 2;
                var y = padding;
                //rootXML.appendChild(arrow(parentID+childID, parentID, childID,false));
                rootXML.appendChild(parallelogram(childID, cValue, x, y, childrenArray[i]));
                // Generates unique id by using childID and parentID
                rootXML.appendChild(arrow(parentID+childID, parentID, childID));
                cCount ++;
                break;
            case "h":
            case "e":
                var x = 94;
                var y = -30;
                rootXML.appendChild(heart(childID, cValue, x, y, parentID, childrenArray[i]));
                shapes.push("h");
                shapesID.push(childID);
                break;
            case "c":
            case "q":
                var x = -90;
                var y = 10;
                rootXML.appendChild(cloud(childID, cValue, x, y, parentID, childrenArray[i]));
                shapes.push("c");
                shapesID.push(childID);
                break;
            case "a":
            case "s":
                var x = 182;
                var y = -30;
                var actornum= cValue.split(",").length;
                rootXML.appendChild(actor(childID, cValue, x, y, parentID, childrenArray[i]));
                if (actornum>1){
                  for (var j=1;j<actornum;j++){
                    if (j==3){
                      if (actornum>3){
                        rootXML.appendChild(actordot(childID+"dot", x, y, parentID, childrenArray[i]));
                        shapes.push("ad");
                        shapesID.push(childID+"dot");
                      }
                      break;
                    }
                    if (actornum>=3 && j==2){
                      shapes.push("a");
                      shapesID.push(childID);
                    }else if(actornum<3 && j==1){
                      shapes.push("a");
                      shapesID.push(childID);
                    }
                    var subchildID=childID+"s"+j;
                    rootXML.appendChild(actor(subchildID, "", x+40*j, y, parentID, childrenArray[i]));
                    shapes.push("a");
                    shapesID.push(subchildID);
                  }
                }else{
                  shapes.push("a");
                  shapesID.push(childID);
                }
                break;
            case "n":
                var x = -150;
                var y = -30;
                rootXML.appendChild(spade(childID, cValue, x, y, parentID, childrenArray[i]));
                shapes.push("n");
                shapesID.push(childID);
                break;
        }
    }
    // Shifts the rightmost and leftmost non-functional goals to accomodate for expanded shapes
    var lastactorx=0;
    for (var i=0; i<shapes.length; i++){
        switch (shapes[i]){
            case "h":
                var currNode = findByID(rootXML, shapesID[i]);
                var currNodeGeom = currNode.childNodes[0];
                var parentNode = findByID(rootXML, shapesID[0]);
                var parentNodeGeom = parentNode.childNodes[0];
                // Heart only shifts to the right the size of parallelogram
                currNodeGeom.setAttribute("x", parseFloat(parentNodeGeom.getAttribute("width"))-30);
                break;
            case "c":
                var currNode = findByID(rootXML, shapesID[i]);
                var currNodeGeom = currNode.childNodes[0];
                var parentNode = findByID(rootXML, shapesID[0]);
                var parentNodeGeom = parentNode.childNodes[0];
                // Heart only shifts to the left the size of cloud
                currNodeGeom.setAttribute("x", -parseFloat(currNodeGeom.getAttribute("width"))+30);
                break;
            case "a":
                var index = shapes.indexOf("h");
                var abefore=0;
                for (var a=0;a<i;a++){
                  if (shapes[a]=="a"){
                    abefore++;
                  }
                }
                var currNode = findByID(rootXML, shapesID[i]);
                var currNodeGeom = currNode.childNodes[0];
                var parentNode = findByID(rootXML, shapesID[0]);
                var parentNodeGeom = parentNode.childNodes[0];
                // If heart is present, shift to the right the size of heart and parallelogram
                if (index >= 0){
                    var node = findByID(rootXML, shapesID[index]);
                    var nodeGeom = node.childNodes[0];
                    currNodeGeom.setAttribute("x", parseFloat(parentNodeGeom.getAttribute("width"))+parseFloat(nodeGeom.getAttribute("width"))+40*abefore-30);
                }
                // Otherwise just shift to size of parallelogram
                else{
                    currNodeGeom.setAttribute("x", parseFloat(parentNodeGeom.getAttribute("width"))+40*abefore);
                }
                lastactorx=parseFloat(currNodeGeom.getAttribute("x"));
                break;
            case "ad":
                var currNode = findByID(rootXML, shapesID[i]);
                var currNodeGeom = currNode.childNodes[0];
                currNodeGeom.setAttribute("x",lastactorx+40);
                currNodeGeom.setAttribute("y",40);
                break;
            case "n":
                var index = shapes.indexOf("c");
                var currNode = findByID(rootXML, shapesID[i]);
                var currNodeGeom = currNode.childNodes[0];
                var parentNode = findByID(rootXML, shapesID[0]);
                var parentNodeGeom = parentNode.childNodes[0];
                // If clous is present, shift to the left the size of cloud and current shape
                if (index >= 0){
                    var node = findByID(rootXML, shapesID[index]);
                    var nodeGeom = node.childNodes[0];
                    currNodeGeom.setAttribute("x", -parseFloat(currNodeGeom.getAttribute("width"))-parseFloat(nodeGeom.getAttribute("width"))+50);
                }
                // Otherwise just shift current shape
                else{
                    currNodeGeom.setAttribute("x", -parseFloat(currNodeGeom.getAttribute("width")));
                }
                break;
        }
    }
}

/**
 * Finds the xml node according the ID
 * rootXML XML data structure
 * nodeID ID for the node to find
 */
var findByID = function(rootXML, nodeID){
	for (var i = 0; i < rootXML.children.length; i++){
		if (rootXML.childNodes[i].getAttribute("id") == nodeID){
			return rootXML.childNodes[i];
		}
	}
	return null;
}

/**
 * Checks for any errors from the input list
 * @param inputString String from textbox
 */
var checkError = function(inputString){
    var outputLog = [];
    var inputList = inputString.split(/\r?\n/);
    var idSet = new Set();
    var skipSet = new Set();
    var typeMap = {};
    var childMap = {};

    var noRoot = false;
    for (var i=0; i<inputList.length; i++){
      var parentInput = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
      if (parentInput.length == 3){
        noRoot = true;
        break;
      }
    }

    if (!noRoot){
      outputLog.push("No root node found");
      return outputLog.toString().replace(",","");
    }

    // Checkif arguments <5>
    // Populate set
    for (var i=0; i<inputList.length; i++){
        var parentInput = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
        if (skipSet.has(i))
            continue;
        if (parentInput == null){
            outputLog.push("Line " + (i+1) + " : No input found\n");
            skipSet.add(i);
            continue;
        }
        if ( parentInput.length < 4 && !(parentInput.length == 3)){
            outputLog.push("Line " + (i+1) + " : Not enough arguments (Expected 3(root)/4/5, Found " + parentInput.length + ")\n");
            skipSet.add(i);
            continue;
        }
        if ( parentInput.length > 5){
            outputLog.push("Line " + (i+1) + " : Too many  arguments (Expected 3(first line)/4/5, Found " + parentInput.length + ")\n");
            skipSet.add(i);
            continue;
        }
        if (parentInput[1] == parentInput[3]){
            outputLog.push("Line " + (i+1) + " : ID cannot be the same as the parentID\n");
            skipSet.add(i);
            continue;
        }
        if (inputList[i].includes("<") || inputList[i].includes(">")){
            outputLog.push("Line " + (i+1) + " : Input cannot contain '<' or '>' character\n");
            skipSet.add(i);
            continue;
        }
        if (idSet.has(parentInput[1])){
            outputLog.push("Line " + (i+1) + " : Duplicate ID\n");
            continue;
        }
        if (idSet.has(parentInput[3]) && typeMap[parentInput[3]] != 'f' && typeMap[parentInput[3]] != 'p' && typeMap[parentInput[3]] != 'sg' && parentInput[0] != 'f' && parentInput[0] != 'p' && parentInput[0] != 'sg'){
            outputLog.push("Line " + (i+1) + " : Parent of non-functional goal cannot be non-functional goal\n");
            continue;
        }
        if (idSet.has(parentInput[3]) && typeMap[parentInput[3]] == 'sg' && parentInput[0] != 'sg' && parentInput[0] != 'f' && parentInput[0] != 'p'){
            outputLog.push("Line " + (i+1) + " : SubGoal cannot be parent of non functional goals\n");
            continue;
        }
        if (parentInput[3] in childMap){
            if (childMap[parentInput[3]].indexOf(parentInput[0]) > 0 && parentInput[0]!="sg"){
                outputLog.push("Line " + (i+1) + " : Parent cannot have more than one non-functional goal\n");
                continue;
            }
            else{
                childMap[parentInput[3]].push(parentInput[0]);
            }
        }
        else{
            childMap[parentInput[1]] = [parentInput[0]];
        }
        typeMap[parentInput[1]] = parentInput[0]
        idSet.add(parentInput[1]);
    }
    // Check parent references
    for (var i=1; i<inputList.length; i++){
        if (skipSet.has(i))
            continue;
        var parentInput = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
        if (!idSet.has(parentInput[3]) && parentInput[0]!="f" && parentInput[0]!="p"){
            outputLog.push("Line " + (i+1) + " : Parent ID not found\n");
        }
    }
    outputLog.sort();
    return outputLog.toString().replace(",","");
}

/**
 * Yuwei Bao
 * set elements in inputList to invisible based on element type
 * @param inputList
 * @param editorUi
 * @param types 	array of types(character) that need to hide
 */
var hideOnTypeHelper = function(inputList, editorUi, types){
  var ids = [];
	var text = "";
  if(inputList[0] == ''){
    return []
  }
	for(var i = 0; i < inputList.length; i++){
		var parentInput = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
		if( !types.includes(parentInput[0]) ||  parentInput[4] == 'n'){
			text += inputList[i];
		}else{
			text += inputList[i] + " n";
            for(var j = 0; j < subgoalLimit; j++){
                var shadowNode = document.getElementById(parentInput[1]+ splitIDConnection + j +"_anchor");
                if(shadowNode != null){
                    shadowNode.style.color = hiddenColor;
                }
            }
            ids.push(parentInput[1]);
		}
		text += '\n';

	}
	//updateHelper(text.substring(0, text.length - 1), editorUi, false);
    // update textarea
    var textarea = document.getElementById('sidebarTextarea');
    textarea.value = text.substring(0, text.length - 1);
    return ids;
}
/**
 * Yuwei Bao
 * set elements in inputList to visible based on element type
 * @param inputList
 * @param editorUi
 * @param types 	array of types(character) that need to set visible
 */
var showOnTypeHelper = function(inputList, editorUi, types){
  var ids = [];
	var text = "";
  if(inputList[0] == ''){
    return []
  }
	for(var i = 0; i < inputList.length; i++){
		var parentInput = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
		if(!types.includes(parentInput[0]) ||  parentInput[4] != 'n'){
			text += inputList[i];
		}else{
			text += parentInput  [0] + " " + parentInput  [1]+ " " + parentInput  [2]+ " " + parentInput[3];
            for(var j = 0; j < subgoalLimit; j++){
                var shadowNode = document.getElementById(parentInput[1]+ splitIDConnection + j +"_anchor");
                if(shadowNode != null){
                    shadowNode.style.color = showColor;
                }
            }
            ids.push(parentInput[1]);
		}
		text += '\n';

	}
	//updateHelper(text.substring(0, text.length - 1), editorUi, false);
    // update textarea
    var textarea = document.getElementById('sidebarTextarea');
    textarea.value = text.substring(0, text.length - 1);
    return ids;
}

/**
 * Yuwei Bao
 * toggle visibility of elements in inputList based on element type
 * @param ui        editorUi
 * @param types     array of types(character) that need to change visibility
 */
var showHideToggle = function(ui, types){
    // check current toggle status
    var hide = true;
    for(var i = 0; i < types.length; i++){
        if(ui.hideTypes.includes(types[i])){
            hide = false;
            break;
        }
    }
    if(hide){
        // add toggle type
        for(var i = 0; i < types.length; i++){
            var index = ui.hideTypes.indexOf(types[i]);
            if(index == -1){
                ui.hideTypes.push(types[i]);
            }
        }
        // update textare, jstree and canvas
        var ids = hideOnTypeHelper(readInputList(ui).split(/\r?\n/), ui, types);
        canvasVisibilityHelper(ui, false, ids);
    }else{
        // remove toggle type
        for(var i = 0; i < types.length; i++){
            var index = ui.hideTypes.indexOf(types[i]);
            if(index != -1){
                ui.hideTypes.splice(index, 1);
            }
        }
        // update textare, jstree and canvas
        var ids = showOnTypeHelper(readInputList(ui).split(/\r?\n/), ui, types);
        canvasVisibilityHelper(ui, true, ids);
    }
}
/**
 * Yuwei Bao
 * modify input text in canvas by remove <br> and too many lines
 * @param cellStyle     current cell's style
 * @param textValue     user's input text
 */
var textConverter = function(cellStyle, textValue){
    // remove empty line in user input
    var newTextValue = textValue.replace(/<div><br><\/div>/g, "");
    // remove </div> to prepare for split
    newTextValue = newTextValue.replace(/<\/div>/g, "");
    var texts = newTextValue.split("<div>");
    newTextValue = "";
    // return empty string if only empty lines has been inputed
    if(texts.length == 0){
        return newTextValue;
    }
    newTextValue += texts[0];
    var limit = texts.length;
    // if it is non-functional goal, set limit to minimum of input length and non-functional goal limit
    if(cellStyle.indexOf("parallelogram") < 0){
        // not goal also check number of subgoal
        limit = Math.min(subgoalLimit, texts.length);
    }
    // reconstruct user input
    for(var i = 1; i < limit; i++){
        if(texts[i] != ""){
            if(cellStyle.indexOf("parallelogram") < 0){
                newTextValue += "<div>" + texts[i] + "<\/div>"
            }else{
                newTextValue += " " + texts[i];
            }
        }
    }
    return newTextValue;
}

/**
 * Yuwei Bao
 * toggle visibility of elements in inputList based on element type
 * @param editorUi  editorUi
 * @param visible   boolean to show whether set to be visible or hidden
 * @param ids       ids of cell to show/hide
 */
var canvasVisibilityHelper = function(editorUi, visible, ids){
    var graph = editorUi.editor.graph;
    var layout = new mxCompactTreeLayout(editorUi.editor.graph, false);
    layout.edgeRouting = false;
    layout.levelDistance = layoutLevelDistance;
    layout.nodeDistance = layoutNodeDistance;
    mxGraph.prototype.cellsMovable = true;
    graph.model.beginUpdate();
    try
    {
        // set visible/hidden to each cell based on id
        for(var i = 0; i < ids.length; i++){
            var cell = graph.getModel().getCell('id' + ids[i])
            var cell_1 = graph.getModel().getCell('id' + ids[i] + 's1')
            var cell_2= graph.getModel().getCell('id' + ids[i] + 's2')
            var cell_dot = graph.getModel().getCell('id' + ids[i] + 'dot')
            if(cell != undefined){
              cell.setVisible(visible);
            }
            if(cell_1 != undefined){
            	cell_1.setVisible(visible);
            }
            if(cell_2 != undefined){
            	cell_2.setVisible(visible);
            }
            if(cell_dot != undefined){
            	cell_dot.setVisible(visible);
            }


        }
        //layout.execute(editorUi.editor.graph.getDefaultParent(), editorUi.editor.graph.findTreeRoots(editorUi.editor.graph.getDefaultParent())[0]);
        mxGraph.prototype.cellsMovable = false;

        // not sure why need this line to trigger graph update
        var vertex = graph.insertVertex();
    }
    finally{
        graph.getModel().endUpdate();
    }
}
/**
 * Yuwei Bao
 * check if the input value from user is valid (can only contain alphets, numbers and space)
 * @param text text to check
 */
var singleElementErrorCheck = function(text, inGraphEditing){
  // remove new line syntax
  var  newText = text
  if(inGraphEditing){
    newText = newText.replace(/<div><br><\/div>/g, "");
    newText = newText.replace(/<\/div>/g, "");
    newText = newText.replace(/<div>/g, "");
  }
  // check input
  var valid = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/.test(newText)
  if(!valid){
    window.alert("Please use only alphabetical characters or numbers for the goal's name");
  }
  return valid
}
