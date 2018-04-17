/**
 * Copyright (c) 2006-2012, JGraph Ltd
 */
/**
 * Construcs a new sidebar for the given editor.
 */
function Sidebar(editorUi, container)
{
	this.editorUi = editorUi;
	this.container = container;
	this.palettes = new Object();
	this.taglist = new Object();
	this.showTooltips = true;
	this.graph = editorUi.createTemporaryGraph(this.editorUi.editor.graph.getStylesheet());
	this.graph.cellRenderer.antiAlias = false;
	this.graph.foldingEnabled = false;
	this.highlightNode = null;
	// Workaround for blank output in IE11-
	if (!mxClient.IS_IE && !mxClient.IS_IE11)
	{
		this.graph.container.style.display = 'none';
	}

	document.body.appendChild(this.graph.container);

	this.pointerUpHandler = mxUtils.bind(this, function()
	{
		this.showTooltips = true;
	});

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerup' : 'mouseup', this.pointerUpHandler);

	this.pointerDownHandler = mxUtils.bind(this, function()
	{
		this.showTooltips = false;
		this.hideTooltip();
	});

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerdown' : 'mousedown', this.pointerDownHandler);

	this.pointerMoveHandler = mxUtils.bind(this, function(evt)
	{
		var src = mxEvent.getSource(evt);

		while (src != null)
		{
			if (src == this.currentElt)
			{
				return;
			}

			src = src.parentNode;
		}

		this.hideTooltip();
	});

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointermove' : 'mousemove', this.pointerMoveHandler);

	// Handles mouse leaving the window
	this.pointerOutHandler = mxUtils.bind(this, function(evt)
	{
		if (evt.toElement == null && evt.relatedTarget == null)
		{
			this.hideTooltip();
		}
	});

	mxEvent.addListener(document, (mxClient.IS_POINTER) ? 'pointerout' : 'mouseout', this.pointerOutHandler);

	// Enables tooltips after scroll
	mxEvent.addListener(container, 'scroll', mxUtils.bind(this, function()
	{
		this.showTooltips = true;
	}));

	this.init();

	// Pre-fetches tooltip image
	if (!mxClient.IS_SVG)
	{
		new Image().src = IMAGE_PATH + '/tooltip.png';
	}
};

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.init = function()
{

	this.addCreatePalette(true);
};

/**
 * Adds all palettes to the sidebar.
 */
Sidebar.prototype.showTooltip = function(elt, cells, w, h, title, showLabel)
{
	if (this.enableTooltips && this.showTooltips)
	{
		if (this.currentElt != elt)
		{
			if (this.thread != null)
			{
				window.clearTimeout(this.thread);
				this.thread = null;
			}

			var show = mxUtils.bind(this, function()
			{
				// Lazy creation of the DOM nodes and graph instance
				if (this.tooltip == null)
				{
					this.tooltip = document.createElement('div');
					this.tooltip.className = 'geSidebarTooltip';
					this.tooltip.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
					document.body.appendChild(this.tooltip);

					this.graph2 = new Graph(this.tooltip, null, null, this.editorUi.editor.graph.getStylesheet());
					this.graph2.resetViewOnRootChange = false;
					this.graph2.foldingEnabled = false;
					this.graph2.gridEnabled = false;
					this.graph2.autoScroll = false;
					this.graph2.setTooltips(false);
					this.graph2.setConnectable(false);
					this.graph2.setEnabled(false);

					if (!mxClient.IS_SVG)
					{
						this.graph2.view.canvas.style.position = 'relative';
					}

					this.tooltipImage = mxUtils.createImage(this.tooltipImage);
					this.tooltipImage.className = 'geSidebarTooltipImage';
					this.tooltipImage.style.zIndex = mxPopupMenu.prototype.zIndex - 1;
					this.tooltipImage.style.position = 'absolute';
					this.tooltipImage.style.width = '14px';
					this.tooltipImage.style.height = '27px';

					document.body.appendChild(this.tooltipImage);
				}

				this.graph2.model.clear();
				this.graph2.view.setTranslate(this.tooltipBorder, this.tooltipBorder);

				if (w > this.maxTooltipWidth || h > this.maxTooltipHeight)
				{
					this.graph2.view.scale = Math.round(Math.min(this.maxTooltipWidth / w, this.maxTooltipHeight / h) * 100) / 100;
				}
				else
				{
					this.graph2.view.scale = 1;
				}

				this.tooltip.style.display = 'block';
				this.graph2.labelsVisible = (showLabel == null || showLabel);
				var fo = mxClient.NO_FO;
				mxClient.NO_FO = Editor.prototype.originalNoForeignObject;
				this.graph2.addCells(cells);
				mxClient.NO_FO = fo;

				var bounds = this.graph2.getGraphBounds();
				var width = bounds.width + 2 * this.tooltipBorder + 4;
				var height = bounds.height + 2 * this.tooltipBorder;

				if (mxClient.IS_QUIRKS)
				{
					height += 4;
					this.tooltip.style.overflow = 'hidden';
				}
				else
				{
					this.tooltip.style.overflow = 'visible';
				}

				this.tooltipImage.style.visibility = 'visible';
				this.tooltip.style.width = width + 'px';

				// Adds title for entry
				if (this.tooltipTitles && title != null && title.length > 0)
				{
					if (this.tooltipTitle == null)
					{
						this.tooltipTitle = document.createElement('div');
						this.tooltipTitle.style.borderTop = '1px solid gray';
						this.tooltipTitle.style.textAlign = 'center';
						this.tooltipTitle.style.width = '100%';

						// Oversize titles are cut-off currently. Should make tooltip wider later.
						this.tooltipTitle.style.overflow = 'hidden';

						if (mxClient.IS_SVG)
						{
							this.tooltipTitle.style.paddingTop = '6px';
						}
						else
						{
							this.tooltipTitle.style.position = 'absolute';
							this.tooltipTitle.style.paddingTop = '6px';
						}

						this.tooltip.appendChild(this.tooltipTitle);
					}
					else
					{
						this.tooltipTitle.innerHTML = '';
					}

					this.tooltipTitle.style.display = '';
					mxUtils.write(this.tooltipTitle, title);

					var ddy = this.tooltipTitle.offsetHeight + 10;
					height += ddy;

					if (mxClient.IS_SVG)
					{
						this.tooltipTitle.style.marginTop = (2 - ddy) + 'px';
					}
					else
					{
						height -= 6;
						this.tooltipTitle.style.top = (height - ddy) + 'px';
					}
				}
				else if (this.tooltipTitle != null && this.tooltipTitle.parentNode != null)
				{
					this.tooltipTitle.style.display = 'none';
				}

				this.tooltip.style.height = height + 'px';
				var x0 = -Math.round(bounds.x - this.tooltipBorder);
				var y0 = -Math.round(bounds.y - this.tooltipBorder);

				var b = document.body;
				var d = document.documentElement;
				var bottom = Math.max(b.clientHeight || 0, d.clientHeight);

				var left = this.container.clientWidth + this.editorUi.splitSize + 3 + this.editorUi.container.offsetLeft;
				var top = Math.min(bottom - height - 20 /*status bar*/, Math.max(0, (this.editorUi.container.offsetTop +
					this.container.offsetTop + elt.offsetTop - this.container.scrollTop - height / 2 + 16)));

				if (mxClient.IS_SVG)
				{
					if (x0 != 0 || y0 != 0)
					{
						this.graph2.view.canvas.setAttribute('transform', 'translate(' + x0 + ',' + y0 + ')');
					}
					else
					{
						this.graph2.view.canvas.removeAttribute('transform');
					}
				}
				else
				{
					this.graph2.view.drawPane.style.left = x0 + 'px';
					this.graph2.view.drawPane.style.top = y0 + 'px';
				}

				// Workaround for ignored position CSS style in IE9
				// (changes to relative without the following line)
				this.tooltip.style.position = 'absolute';
				this.tooltip.style.left = left + 'px';
				this.tooltip.style.top = top + 'px';
				this.tooltipImage.style.left = (left - 13) + 'px';
				this.tooltipImage.style.top = (top + height / 2 - 13) + 'px';
			});

			if (this.tooltip != null && this.tooltip.style.display != 'none')
			{
				show();
			}
			else
			{
				this.thread = window.setTimeout(show, this.tooltipDelay);
			}

			this.currentElt = elt;
		}
	}
};

/**
 * Hides the current tooltip.
 */
Sidebar.prototype.hideTooltip = function()
{
	if (this.thread != null)
	{
		window.clearTimeout(this.thread);
		this.thread = null;
	}

	if (this.tooltip != null)
	{
		this.tooltip.style.display = 'none';
		this.tooltipImage.style.visibility = 'hidden';
		this.currentElt = null;
	}
};


/**
 * YUWEI BAO
 * Adds the create palette to the sidebar.
 */
Sidebar.prototype.addCreatePalette = function(expand)
{
	var editorUi = this.editorUi;
	/*var elt = document.createElement('div');
	elt.style.visibility = 'hidden';
	this.container.appendChild(elt);*/
	// Default text box displaying current XML (Used only for testing currently)
	var div = document.createElement('div');
	div.className = 'geSidebar';
	div.style.boxSizing = 'border-box';
	div.style.overflow = 'hidden';
	div.style.width = '100%';
	div.style.padding = '5px';

	var promptDiv = document.createElement('div');
	promptDiv.style.padding = '5px';

	var userprompt = document.createTextNode('[type] [ID] [name] [parentID] [visibility]');
	promptDiv.appendChild(userprompt);
	div.appendChild(promptDiv);

	var textarea = document.createElement('textarea');
	textarea.setAttribute('wrap', 'off');
	textarea.setAttribute('spellcheck', 'false');
	textarea.setAttribute('autocorrect', 'off');
	textarea.setAttribute('autocomplete', 'off');
	textarea.setAttribute('autocapitalize', 'off');
	textarea.style.overflow = 'auto';
	textarea.style.resize = 'none';
	textarea.style.width = '100%';
	textarea.style.boxSizing = 'border-box';
	textarea.style.height = '150px';
	textarea.className = 'lined';
	textarea.id = 'sidebarTextarea';

	// Workaround for blocked text selection in Editor
    mxEvent.addListener(textarea, 'mousedown', function(evt)
    {
    	if (evt.stopPropagation)
    	{
    		evt.stopPropagation();
    	}
    	evt.cancelBubble = true;
    });

     // Workaround for blocked text selection in Editor
    mxEvent.addListener(textarea, 'selectstart', function(evt)
    {
    	if (evt.stopPropagation)
    	{
    		evt.stopPropagation();
    	}

    	evt.cancelBubble = true;
    });

	div.appendChild(textarea);
    var data = "Please read the help information (In the menu bar) to for more details"
    textarea.setAttribute('placeholder', data);

	this.container.appendChild(div);

	var elt = this.createTitle('Refresh Goal Model/Sort Goals');
	this.container.appendChild(elt);
	//mxEvent.addListener(elt, 'click', this.editorUi.actions.get('editDiagram').funct);
	mxEvent.addListener(elt, 'click', function(){
		var log = checkError(textarea.value.toString());
		if (log != ""){
			window.alert(log);
			return;
		}
		updateHelper(textarea.value.toString(), editorUi, true);
	});

	var treeDiv = document.createElement("div");
	treeDiv.setAttribute("id", "frmt");
	this.container.appendChild(treeDiv);

};


/**
    Reaload Sidebar from XML
*/
var reloadSidebar = function(editorUi){
// XML parser (Parses xml input from original graph)
    var parser = new DOMParser();
    var xmlvalue = mxUtils.trim(mxUtils.getXml(editorUi.editor.getGraphXml()));
    var xmlDoc = parser.parseFromString(xmlvalue, "text/xml");
    var rootXML = xmlDoc.getElementsByTagName("root")[0];
    var inputList = "";

    var newChildMap = {}

    // Initialise the childmap for all nodes
    for (var i = 0; i < rootXML.children.length; i++){
        var childInputString = rootXML.childNodes[i].getAttribute("inputString");
        if (childInputString == null){
            continue;
        }

        var childArray = childInputString.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
        if (!(childArray in newChildMap)){
        	newChildMap[childArray] = [];
			// Start generating input list
        	inputList += childArray.join(" ") + "\n";
        }
    }

    // Read inputstring and generate childmap
    for (var i = 0; i < rootXML.children.length; i++){
        var childInputString = rootXML.childNodes[i].getAttribute("inputString");
        if (childInputString == null){
            continue;
        }

        var childArray = childInputString.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

        var parentNode = findByID(rootXML, "id"+childArray[3]);
        if (parentNode == null){
            continue;
        }

        var parentInputString = parentNode.getAttribute("inputString");
        var parentArray = parentInputString.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);

        newChildMap[parentArray].push(childArray);
    }

    // Reload the sidebar
    editorUi.childMap = newChildMap;
    updateHelper(inputList.substring(0, inputList.length - 1), editorUi , true);
}


/**
 * Yuwei Bao
 * Updates the jstree in sidebar to display input list
 * @para parentString 	current parent
 * @para childMap		map from parent to children
 */
var updateSidebarTree = function(parentStrings, childMap, editorUi){
	// destory old jstree
	$('#frmt').jstree("destroy");
	var parents = [];
	var dataValue=[];
	// remove "" in paret text
	for (var p =0; p<parentStrings.length;p++){
		var newParentText = parentStrings[p][2];
		if(newParentText.substring(0,1) == "\""){
			newParentText = newParentText.substring(1, newParentText.length-1);
		}
	// add root goal
	 	dataValue.push({ "id" : parentStrings[p][1], "parent" : "#", "text" : newParentText,  "state" : { "opened" : true }, "icon":goalIconString});
    //var rootCount = 1;
    parents.push(parentStrings[p]);
	}
    // add rest subgoals based on order : stakeholder, emotional goal, quality goal, negative goal, functional goal
    var types = ['a', 's', 'h', 'e', 'c', 'q', 'n', 'sg','p', 'f'];
    var shadowID = [];
    while(parents.length > 0){
    	var newparents = []
		for (var i=0; i<parents.length; i++){
			var children = childMap[parents[i]];
			for(var t = 0; t < types.length; t++){
				var type = types[t];
				for (var j=0; j<children.length; j++){
					var child = children[j];
					if(child[0] != type){
						continue;
					}
					if(child[0] == "p" || child[0] == "f" ){
						// remove "" in text
						var textTrimed = child[2];
						if(textTrimed.substring(0,1) == '\"'){
							textTrimed = textTrimed.substring(1, textTrimed.length-1);
						}
						dataValue.push({ "id" : child[1], "parent" : child[3], "text" : textTrimed  ,"state" : { "opened" : true}, "icon":goalIconString});
					}else if(child[0] == "sg"){
						// remove "" in text
						var textTrimed = child[2];
						if(textTrimed.substring(0,1) == '\"'){
							textTrimed = textTrimed.substring(1, textTrimed.length-1);
						}																																						
						dataValue.push({ "id" : child[1], "parent" : child[3], "text" : textTrimed  ,"state" : { "opened" : true}, "icon":subGoalIconString});
					}else if(child[0] == "h" || child[0] == "e"){
						dataValue = dataValueAddHelper(dataValue, heartIconString, child[1], child[3], child[2]);
					}else if(child[0] == "c" || child[0] == "q"){
						dataValue = dataValueAddHelper(dataValue, cloudIconString, child[1], child[3], child[2]);
					}else if(child[0] == "a" || child[0] == "s"){
						dataValue = dataValueAddHelper(dataValue, stakeHolderIconString, child[1], child[3], child[2]);
					}else if(child[0] == "n" ){
						dataValue = dataValueAddHelper(dataValue, negativeIconString, child[1], child[3], child[2]);
					}
					if((child[0] != "p" && child[0] != "f" ) && child[4] == 'n' ){
						shadowID.push(child[1]);
					}
					newparents.push(children[j]);
				}
			}
		}
		parents = newparents;
    }
	$(function () {
		$('#frmt').on('select_node.jstree', function (e, data) {
			// highlight goal in canvas when selected in jstree
			if (this.highlightNode != null){
				// remove previous highlight shape if exist
				for(var i = 0; i < this.highlightNode.length; i++){
					this.highlightNode[i].shape.destroy();
				}
			}
			this.highlightNode = [];
			// get id of corresponding cell
			id = "id" + $("#frmt").jstree("get_selected").toString().split(splitIDConnection)[0];

			// set highlight color
	        highlight = new mxCellHighlight(editorUi.editor.graph, highLightColor, 2, true);
	        // get cell to be highlighted
			var cell = editorUi.editor.graph.getModel().getCell(id)
            var cell_1 = editorUi.editor.graph.getModel().getCell(id+ 's1')
            var cell_2= editorUi.editor.graph.getModel().getCell(id + 's2')
            var cell_dot = editorUi.editor.graph.getModel().getCell(id + 'dot')
            // apply highlight
            if(cell != undefined){
            	var highlight = new mxCellHighlight(editorUi.editor.graph, highLightColor, 2, true);
            	highlight.highlight(editorUi.editor.graph.view.getState(cell));
            	this.highlightNode.push(highlight);
            }
            if(cell_1 != undefined){
            	var highlight_1 = new mxCellHighlight(editorUi.editor.graph, highLightColor, 2, true);
            	highlight_1.highlight(editorUi.editor.graph.view.getState(cell_1));
            	this.highlightNode.push(highlight_1);
            }
            if(cell_2 != undefined){
            	var highlight_2 = new mxCellHighlight(editorUi.editor.graph, highLightColor, 2, true);
            	highlight_2.highlight(editorUi.editor.graph.view.getState(cell_2));
            	this.highlightNode.push(highlight_2);
            }
	    })
		.jstree({
		  "core" : {
		    "animation" : 0,
		    "check_callback" : true,
		    "themes" : { "stripes" : false, "dots" : false},
		    'data' : dataValue
		  },
		  "plugins" : [
		    "contextmenu", "type"
		  ],
		  "contextmenu":{
		    	"items": function($node) {
		        var tree = $("#frmt").jstree(true);
		        items = {
		            "Create": {
		                "separator_before"	: 	false,
		                "separator_after"	: 	false,
		                "label"				: 	"Add",
		                "action" 			: 	false,
		                "submenu" :{
		                	"create_goal" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Add Goal",
		                		"action": function (obj) {
			                    $node = tree.create_node($node);
			                    tree.edit($node,  'goal', function (node, status, is_cancel) {
			                    	// if action cancelled, delete new created node
		         					if(!status || is_cancel) {
		         						tree.delete_node(node);
		         					}else {
		         						// if user input text is invalid, convert to default one
		         						var inputText = node.text
		         						if(!singleElementErrorCheck(inputText, false)){
		         							inputText = 'goal'
		         							tree.rename_node(node.id, inputText);
		         						}
		         						// find the largest id in input list and then put a formulated id with 1 above it
		         						var text = readInputList(editorUi);
					                    var inputList = text.split(/\r?\n/);
					   					var id = parseInt(-1);
					   					for(var i = 0; i < inputList.length; i++){
					   						var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
					   						if(parseInt(string [1]) >= id){
					   							id = parseInt(string [1]);
					   						}
					   					}
					   					// get new input list
					   					if(inputText.indexOf(' ') >= 0){
					   						text += "\np " + (id+1) + " \"" + inputText+ "\" " + (tree.get_parent($node));
					   					}else{
					   						text += "\np " + (id+1) + " " + inputText+ " " + (tree.get_parent($node));
					   					}
					                   	// call helper method to update textarea and refresh canvas
					                    updateHelper(text, editorUi, true);
				          			}
          						});
		                		}
		                	},
		                	"create_subgoal" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Add Subgoal",
		                		"action": function (obj) {
			                    $node = tree.create_node($node);
			                    $node.icon = goalIconString;
			                    tree.edit($node,  'subgoal', function (node, status, is_cancel) {
			                    	// if action cancelled, delete new created node
		         					if(!status || is_cancel) {
		         						tree.delete_node(node);
		         					}else {
		         						// if user input text is invalid, convert to default one
		         						var inputText = node.text
		         						if(!singleElementErrorCheck(inputText,false)){
		         							inputText = 'subgoal'
		         							tree.rename_node(node.id, inputText);
		         						}
		         						// find the largest id in input list and then put a formulated id with 1 above it
		         						var text = readInputList(editorUi);
					                    var inputList = text.split(/\r?\n/);
					   					var id = parseInt(-1);
					   					for(var i = 0; i < inputList.length; i++){
					   						var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
					   						if(parseInt(string [1]) >= id){
					   							id = parseInt(string [1]);
					   						}
					   					}
					   					// get new input list
					   					if(inputText.indexOf(' ') >= 0){
					   						text += "\nsg " + (id+1) + " \"" + inputText+ "\" " + (tree.get_parent($node));
					   					}else{
					   						text += "\nsg " + (id+1) + " " + inputText+ " " + (tree.get_parent($node));
					   					}
					                   	// call helper method to update textarea and refresh canvas
					                    updateHelper(text, editorUi, true);
				          			}
          						});
		                		}
		                	},
		                	"create_stakeholder" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Add Stakeholder",
		                		"action": function (obj) {
			                    $node = tree.create_node($node);
			                    tree.edit($node,  'stakeholder', function (node, status, is_cancel) {
			                    	// if action cancelled, delete new created node
		         					if(!status || is_cancel) {
		         						tree.delete_node(node);
		         					}else {
		         						// if user input text is invalid, convert to default one
		         						var inputText = node.text
		         						if(!singleElementErrorCheck(inputText, false)){
		         							inputText = 'stakeholder'
		         							tree.rename_node(node.id, inputText);
		         						}
		         						jstreeCreateHelper(inputText, tree.get_parent($node), stakeHolderIconString, "s", $('#frmt').jstree(true).get_json('#', {flat:true}),editorUi);
				          			}
          						});
		                		}
		                	},
		                	"create_emotional_goal" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Add Emotional Goal",
		                		"action": function (obj) {
			                    $node = tree.create_node($node);
			                    tree.edit($node,  'emotional_goal', function (node, status, is_cancel) {
			                    	// if action cancelled, delete new created node
		         					if(!status || is_cancel) {
		         						tree.delete_node(node);
		         					}else {
		         						// if user input text is invalid, convert to default one
		         						var inputText = node.text
		         						if(!singleElementErrorCheck(inputText, false)){
		         							inputText = 'emotional_goal'
		         							tree.rename_node(node.id, inputText);
		         						}
		         						jstreeCreateHelper(inputText, tree.get_parent($node), heartIconString, "e", $('#frmt').jstree(true).get_json('#', {flat:true}),editorUi);
				          			}
          						});
		                		}
		                	},
		                	"create_quality_goal" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Add Quality Goal",
		                		"action": function (obj) {
			                    $node = tree.create_node($node);
			                    tree.edit($node,  'quality_goal', function (node, status, is_cancel) {
			                    	// if action cancelled, delete new created node
		         					if(!status || is_cancel) {
		         						tree.delete_node(node);
		         					}else {
		         						// if user input text is invalid, convert to default one
		         						var inputText = node.text
		         						if(!singleElementErrorCheck(inputText, false)){
		         							inputText = 'quality_goal'
		         							tree.rename_node(node.id, inputText);
		         						}
		         						jstreeCreateHelper(inputText, tree.get_parent($node), cloudIconString, "q",$('#frmt').jstree(true).get_json('#', {flat:true}),editorUi);
				          			}
          						});
		                		}
		                	},
		                	"create_negative_goal" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Add Negative Goal",
		                		"action": function (obj) {
			                    $node = tree.create_node($node);
			                    tree.edit($node,  'negative_goal', function (node, status, is_cancel) {
			                    	// if action cancelled, delete new created node
		         					if(!status || is_cancel) {
		         						tree.delete_node(node);
		         					}else {
		         						// if user input text is invalid, convert to default one
		         						var inputText = node.text
		         						if(!singleElementErrorCheck(inputText, false)){
		         							inputText = 'negative_goal'
		         							tree.rename_node(node.id, inputText);
		         						}
		         						jstreeCreateHelper(inputText, tree.get_parent($node), negativeIconString, "n",$('#frmt').jstree(true).get_json('#', {flat:true}),editorUi);
				          			}
          						});
		                		}
		                	},

		                }

		            },
		            "Rename": {
		                "separator_before": false,
		                "separator_after": false,
		                "label": "Rename",
		                "action": function (obj) {
		                	var perviousText = $node.text;
                             tree.edit($node, obj.text,function (node, status, is_cancel) {
                             	// if action cancelled, do nothing
	         					if(!status || is_cancel) {
	         						return;
	         					}else {
	         						// if user input text is invalid, convert to previous one
	         						if(!singleElementErrorCheck(node.text, false)){
	         							tree.rename_node(node.id, perviousText);
	         							return;
	         						}
	         						// find the corresponding line in input list and replace it wit new text value
	         						var inputList = readInputList(editorUi).split(/\r?\n/);
				   					var index = -1;
				   					var value = "";
				   					for(var i = 0; i < inputList.length; i++){
				   						var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
				   						// check if it is the line that needs to be changed
				   						if(string [1] == $node.id.split(splitIDConnection)[0]){
				   							index = i;
				   							var newText = "";

				   							// get data value in current jstree
				   							var data = $('#frmt').jstree(true).get_json('#', {flat:true});

				   							// construct new text in this line use new input text and previous goals
				   							for(var j = 0; j < data.length; j++){
				   								var jsonNode = data[j];
				   								if(jsonNode["id"] == $node.id){
				   									newText += node.text + splitSymbol;
				   									data[j]["text"] = node.text;
				   								}else if(jsonNode["id"].split(splitIDConnection)[0] == $node.id.split(splitIDConnection)[0]){
				   									newText += jsonNode["text"] + splitSymbol;
				   								}
				   							}
				   							newText = newText.substring(0, newText.length - 1);

				   							// if goal is hidden, set text color & construct proper line of input list
				   							if(newText.indexOf(' ') >= 0){
				   								newText = '\"' + newText + '\"';
				   							}
				   							if(string[4] =='n'){
				   								value = string [0] + " " +string [1]+ " " + newText+ " " + string [3] + " " + string[4];
				   								var shadowNode = document.getElementById($node.id +"_anchor");
												if(shadowNode != null){
													shadowNode.style.color = hiddenColor;
												}
				   							}else{
				   								value = string [0] + " " +string [1]+ " " + newText
				   								if(string [3] != undefined){
				   									value+= " " + string [3]
				   								}
				   							}
				   							break;
				   						}
				   					}

				   					// construct new input list
				   					var text = "";
				   					for(var i = 0; i < inputList.length; i++){
				   						if(i == index){
				   							text += value;
				   						}else{
				   							text += inputList[i];
				   						}
				   						text += "\n";
				   					}

				                    // call helper method to update textarea and refresh canvas
					                updateHelper(text.substring(0, text.length - 1), editorUi, false);

	         					}
	         				});

		                }
		            },
		            "Remove": {
		                "separator_before": false,
		                "separator_after": false,
		                "label": "Remove",
		                "action": function (obj) {
		                    tree.delete_node($node);
		                    var text = "";

		                    if($node.icon != goalIconString && $node.icon != subGoalIconString){
		                    	// find deleted goal in inputlist
		                    	var inputList = readInputList(editorUi).split(/\r?\n/);
			   					var index = -1;
			   					for(var i = 0; i < inputList.length; i++){
					   				var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
					   				if(string [1] == $node.id.split(splitIDConnection)[0]){
					   					index = i;
					   					break;
					   				}
				   				}
				   				// construct new inputlist
				   				for(var i = 0; i < inputList.length; i++){
				   					if(index == i){
				   						var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
				   						var newText = "";
				   						var strings = string[2].split(splitSymbol);
				   						if(string[2].substring(0,1) == "\""){
				   							strings = string[2].substring(1,string[2].length-1).split(splitSymbol);
				   						}
				   						var found = false;
				   						for(var j = 0; j < strings.length; j++){
				   							if(strings[j] != $node.text || found){
				   								newText += strings[j] + splitSymbol;
				   							}else{
				   								found = true;
				   							}
				   						}

				   						newText = newText.substring(0, newText.length - 1);
				   						if(newText.indexOf(' ') >= 0){
				   							newText = '\"' + newText + '\"';
				   						}
				   						if(newText != ""){
				   							// if goal is hidden, set text color & construct proper line of input list
				   							if(string[4] == 'n'){
				   								for(var j = 0; j < subgoalLimit; j++){
													var shadowNode = document.getElementById(string[1]+ splitIDConnection + j +"_anchor");
													if(shadowNode != null){
														shadowNode.style.color = hiddenColor;
													}
												}
												text += string [0] + " " +string [1]+ " " + newText + " " + string [3] + " " + string[4]+ "\n";
				   							}else{
				   								text += string [0] + " " +string [1]+ " " + newText + " " + string [3] + "\n";
				   							}
				   						}
				   					}else{
				   						text += inputList[i] + "\n";
				   					}
				   				}
		                    }else{
			                    // find deleted goal in inputlist
			   					var inputList = readInputList(editorUi).split(/\r?\n/);
			   					var index = [];
			   					for(var i = 0; i < inputList.length; i++){
					   				var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
					   				if(string [1] == $node.id){
					   					index.push(i);
					   					break;
					   				}
				   				}
				   				// find all elements under deleted goal in inputlist
			   					var removedIDs = [];
			   					removedIDs.push($node.id);
			   					while(removedIDs.length>0){
			   						var newRemovedIDs = [];
			   						for(var j = 0; j < removedIDs.length; j++){
				   						for(var i = 0; i < inputList.length; i++){
					   						var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
					   						if(string [3] == removedIDs[j]){
					   							index.push(i);
					   							newRemovedIDs.push(string [1]);
					   						}
				   						}
			   						}
			   						removedIDs = newRemovedIDs;
			   					}
			   					// remove all elements under deleted goal from inputlist
			   					for(var i = 0; i < inputList.length; i++){
			   						var check = true;
			   						for(var j = 0; j < index.length; j++){
			   							if(i == index[j]){
			   								check = false;
			   								break;
			   							}
			   						}
			   						if(check){
			   							text += inputList[i] + "\n";
			   						}
			   					}
			   				}
		   					// call helper method to update textarea and refresh canvas
					        updateHelper(text.substring(0, text.length - 1), editorUi, false);
		                }
		            },
		            "Hide": {
		                "separator_before"	: 	false,
		                "separator_after"	: 	false,
		                "label"				: 	"Hide",
		                "action" 			: 	false,
		                "submenu" :{
		                	"hide all" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Hide All",
		                		"action": function (obj) {
					                jstreeHideHelper($node.id, ['a', 's', 'h', 'e', 'c', 'q', 'n'], editorUi)

          						}
		                	},
		                	"hide stakeholder" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Hide Stakeholder",
		                		"action": function (obj) {
		                			jstreeHideHelper($node.id, ['a', 's'], editorUi)

          						}
		                	},
		                	"hide emotional" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Hide Emotional Goal",
		                		"action": function (obj) {
		                			jstreeHideHelper($node.id, ['h', 'e'], editorUi)

          						}
		                	},
		                	"hide quality" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Hide Quality Goal",
		                		"action": function (obj) {
		 							jstreeHideHelper($node.id, ['c', 'q'], editorUi);
          						}
		                	},
		                	"hide negative" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Hide Negative Goal",
		                		"action": function (obj) {
		                			jstreeHideHelper($node.id, ['n'], editorUi)

          						}
		                	}
		               	}

		            },
		            "Show": {
		                "separator_before"	: 	false,
		                "separator_after"	: 	false,
		                "label"				: 	"Show",
		                "action" 			: 	false,
		                "submenu" :{
		                	"hidden all" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Show All",
		                		"action": function (obj) {
									jstreeShowHelper($node.id, ['a', 's', 'h', 'e', 'c', 'q', 'n'], editorUi);

          						}
		                	},
		                	"show stakeholder" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Show Stakeholder",
		                		"action": function (obj) {
		                			jstreeShowHelper($node.id, ['a', 's'], editorUi);

          						}
		                	},
		                	"show emotional" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Show Emotional Goal",
		                		"action": function (obj) {
		                			jstreeShowHelper($node.id, ['h', 'e'], editorUi);
          						}
		                	},
		                	"show quality" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Show Quality Goal",
		                		"action": function (obj) {
		                			jstreeShowHelper($node.id, ['c', 'q'], editorUi);

          						}
		                	},
		                	"show negative" : {
		                		"separator_before"	: 	false,
		                		"separator_after"	: 	false,
		                		"label"				: 	"Show Negative Goal",
		                		"action": function (obj) {
									jstreeShowHelper($node.id, ['n'], editorUi);
          						}
		                	}
		               	}

		            }
		        };
		        if($node.icon == subGoalIconString){
		        	delete items.Hide;
		        	delete items.Show;
		        	delete items.Create.submenu.create_goal;
		        	delete items.Create.submenu.create_quality_goal;
		        	delete items.Create.submenu.create_emotional_goal;
		        	delete items.Create.submenu.create_negative_goal;
		        	delete items.Create.submenu.create_stakeholder;

		        }else if ($node.icon != goalIconString) {
		        	delete items.Create;
		        	delete items.Hide;
		        	delete items.Show;
		        }else{
		        	// remove create menu & submenu if too much has been created
		        	var count = 0;
		        	if(!checkCountHelper($node.id, goalIconString, goalLimit, $('#frmt').jstree(true).get_json('#', {flat:true}))){
		        		delete items.Create.submenu.create_goal;
		        		count++;
		        	}
		        	if(!checkCountHelper($node.id,cloudIconString, subgoalLimit, $('#frmt').jstree(true).get_json('#', {flat:true}))){
		        		delete items.Create.submenu.create_quality_goal;
		        		count++;
		        	}
		        	if(!checkCountHelper($node.id,heartIconString, subgoalLimit, $('#frmt').jstree(true).get_json('#', {flat:true}))){
		        		delete items.Create.submenu.create_emotional_goal;
		        		count++;
		        	}
		        	if(!checkCountHelper($node.id,negativeIconString, subgoalLimit, $('#frmt').jstree(true).get_json('#', {flat:true}))){
		        		delete items.Create.submenu.create_negative_goal;
		        		count++;
		        	}
		        	if(!checkCountHelper($node.id,stakeHolderIconString, subgoalLimit, $('#frmt').jstree(true).get_json('#', {flat:true}))){
		        		delete items.Create.submenu.create_stakeholder;
		        		count++;
		        	}
		        	// if all submenu deleted, also delete create menu
		        	if(count == 5){
		        		delete items.Create;
		        	}

		        }
		        if($node.parent == '#'){
		        	delete items.Remove;
		        }
		        return items;
    			}

			}
		})
	});
	canvasVisibilityHelper(editorUi, false, shadowID)
	// set color for hidden goals after loaded
	$('#frmt').on('loaded.jstree',function (e, data) {
		for(var i = 0; i < shadowID.length; i++){
			for(var j = 0; j < subgoalLimit; j++){
				var shadowNode = document.getElementById(shadowID[i]+ splitIDConnection + j + "_anchor");
				if(shadowNode != null){
					shadowNode.style.color = hiddenColor;
				}
			}
		}
	})
}

/**
 * Yuwei Bao
 * Helper method to helper jstree create non-functional subgoals
 * @para dataValue  current data value to put into jstree
 * @para iconString specify type of subgoal
 * @para id 		id of current goal to be added
 * @para parentID 	id of parent of current goal
 * @para text 		goal text in inputlist(e.g 1;2;3 or "1")
 */
var dataValueAddHelper = function(dataValue, iconString, id, parentID, text){
	// remove "" if there is one
	var textTrimed = text;
	if(textTrimed.substring(0,1) == '\"'){
		textTrimed = textTrimed.substring(1, textTrimed.length-1);
	}
	// split text and add them to data value
	var goals = textTrimed.split(splitSymbol);
	for(var k = 0; k < goals.length; k++){
		dataValue.push({ "id" : id+splitIDConnection+k, "parent" : parentID, "text" : goals[k] ,"state" : { "opened" : true }, "icon":iconString});
	}
	return dataValue;
}

/**
 * Yuwei Bao
 * Helper method to update textarea and refresh canvas based on new input list
 * @para text 			new line of input list
 * @para editorUi		Editor containing XML
 * @para refreshTree	whether refresh true
 */
var updateHelper = function(text, editorUi, refreshTree){
	var textarea = document.getElementById('sidebarTextarea');
	textarea.value = text;
	updateNodeList(text, editorUi);
	var values = generateXMLAndRefreshCanvas(textarea.value,editorUi);
	// update jstree in sidebar
	if(refreshTree){
		updateSidebarTree(values[0], values[1], editorUi);
	}
}
/**
 * Yuwei Bao
 * Helper method to check whether number of goal within limit
 * @para parentID 	id of parent to check subgoals
 * @para iconString specify type of subgoal
 * @para limit      limit number of this type of subgoals
 * @para dataValue  current data value in the jstree
 */
var checkCountHelper = function(parentID, iconString, limit, dataValue){
	var count = 0;
	for(var i = 0; i < dataValue.length; i++){
		var node = dataValue[i];
		if(node["parent"] == parentID && node["icon"] == iconString){
			count += 1;
		}
	}
	if(count >= limit){
		return false;
	}else{
		return true;
	}
}

/**
 * Yuwei Bao
 * Helper method to help jstree create non-functional subgoals
 * @pare inputText 	user input text
 * @para parentID 	id of parent to check subgoals
 * @para iconString specify type of subgoal
 * @para typeSymbol symbol for type of subgoal
 * @para dataValue  current data value in the jstree
 * @para editorUi	Editor containing XML
 */
var jstreeCreateHelper = function(inputText, parentID,iconString, typeSymbol, dataValue,editorUi){
	// get all this type of subgoal of this parent
	var id = "";
	var goalText = "";
	for(var i = 0; i < dataValue.length; i++){
		var jsonNode = dataValue[i];
		if(jsonNode["parent"] == parentID && jsonNode["icon"] == iconString){
			id = jsonNode["id"].split(splitIDConnection)[0];
			goalText += jsonNode["text"] +splitSymbol;
		}
	}
	var text = readInputList(editorUi);
	if(goalText == ""){
		// find the largest id in input list and then put a formulated id with 1 above it
		var inputList = text.split(/\r?\n/);
		var newID = parseInt(-1);
		for(var i = 0; i < inputList.length; i++){
			var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
			if(parseInt(string [1]) >= newID){
				newID = parseInt(string [1]);
			}
		}
		if(inputText.indexOf(' ') >= 0){
			inputText = '\"' + inputText + '\"';
		}
		// get new input list
		text += "\n"+ typeSymbol + " "+ (newID+1) + " " + inputText+ " " + parentID;
	}else{
		var inputList = text.split(/\r?\n/);
		text = "";
		for(var i = 0; i < inputList.length; i++){
			var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
			if(string[1] == id){
				var inputText = goalText + inputText
				if(inputText.indexOf(' ') >= 0){
					inputText = '\"' + inputText + '\"';
				}
				text += typeSymbol + " " + id + " " + inputText + " " + parentID;
			}else{
				text += inputList[i];
			}
				text += "\n";
		}
		text = text.substring(0, text.length - 1);
	}
	// call helper method to update textarea and refresh canvas
	updateHelper(text, editorUi, true);
}

/**
 * Yuwei Bao
 * Helper method to help jstree hide non-functional subgoals
 * @para currentID 		id of cuurent parent to hide subgoals
 * @para typeSymbols 	symbols for type of subgoal
 * @para editorUi		Editor containing XML
 */
var jstreeHideHelper = function(currentID, typeSymbols, editorUi){
	var ids = [];
	var inputList = readInputList(editorUi).split(/\r?\n/);
	var text = "";
	for(var i = 0; i < inputList.length; i++){
		var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
		var typeMatch = false;
		for(var t = 0; t < typeSymbols.length; t++){
			if(string[0] == typeSymbols[t]){
				typeMatch = true;
				break;
			}
		}
		if(string [3] == currentID && typeMatch &&string [4] != 'n'){
			// update input list and add new goals to hide
			text += inputList[i] + " n"
			for(var j = 0; j < subgoalLimit; j++){
				var shadowNode = document.getElementById(string[1]+ splitIDConnection + j +"_anchor");
				if(shadowNode != null){
					shadowNode.style.color = hiddenColor;
				}
			}
			ids.push(string[1]);
		}else{
			if(string[4] == 'n'){
				// add previous hide goal
				//ids.push(string[1]);
			}
			text += inputList[i];
		}
		text += "\n";
	}
	// update textarea
	var textarea = document.getElementById('sidebarTextarea');
	textarea.value = text.substring(0, text.length - 1);
	// update canvas
	canvasVisibilityHelper(editorUi, false, ids);
}

/**
 * Yuwei Bao
 * Helper method to help jstree show non-functional subgoals
 * @para currentID 		id of cuurent parent to show subgoals
 * @para typeSymbols 	symbols for type of subgoal
 * @para editorUi		Editor containing XML
 */
var jstreeShowHelper = function(currentID, typeSymbols, editorUi){
	var ids = [];
	var inputList = readInputList(editorUi).split(/\r?\n/);
	var text = "";
	for(var i = 0; i < inputList.length; i++){
		var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
		var typeMatch = false;
		for(var t = 0; t < typeSymbols.length; t++){
			if(string[0] == typeSymbols[t]){
				typeMatch = true;
				break;
			}
		}
		if(string [3] == currentID && typeMatch){
			text += string [0] + " " +string [1]+ " " + string [2]+ " " + string [3];
			for(var j = 0; j < subgoalLimit; j++){
				var shadowNode = document.getElementById(string[1]+ splitIDConnection + j +"_anchor");
				if(shadowNode != null){
					shadowNode.style.color = showColor;
				}
			}
			ids.push(string[1]);
		}else{
			text += inputList[i];
		}
		text += "\n";
	}
	// update textarea
	var textarea = document.getElementById('sidebarTextarea');
	textarea.value = text.substring(0, text.length - 1);
	// update canvas
	canvasVisibilityHelper(editorUi, true, ids);
}
/**
 * Yuwei Bao
 * Updates the single node in jstree based on id and new text
 * @para id 		id of node to change
 * @para cellStyle  style of changed cell
 * @para newText	changed text
 */
var updateSidebarSingle = function(id, cellStyle,newText){
	var id = id.substring(2,id.length);
	newText = newText.replace(/<\/div>/g, "");
	newText = newText.replace(/<br>/g, "");
	var texts = newText.split("<div>");
	$('#frmt').on('hide_dots.jstree',function (e, data) {
		if(cellStyle.indexOf("parallelogram") >= 0){
			$("#frmt").jstree(true).rename_node(id, newText);
			return;
		}
		var parentID = "";
		var iconString = "";
		// remove old node
		for(var i = 0; i < subgoalLimit; i++){
			if(data.instance.get_node(id + splitIDConnection + i) != false){
				parentID = data.instance.get_node(id + splitIDConnection + i).parent;
			}
			if(data.instance.get_node(id + splitIDConnection + i) != false){
				iconString = data.instance.get_node(id + splitIDConnection + i).icon;
			}
			$("#frmt").jstree(true).delete_node(data.instance.get_node(id + splitIDConnection + i));
		}
		// add new node
		var count = 0;
		for(var i = 0; i < texts.length && count < subgoalLimit; i++){
			if(texts[i] != ""){
				$('#frmt').jstree('create_node', parentID, { "id" : id + splitIDConnection + count, "parent" : parentID, "text" : texts[i]  ,"state" : { "opened" : true }, "icon": iconString}, 'last');
				count ++;
			}
		}
	})
	$('#frmt').jstree().hide_dots();

	//update textarea
	var textarea = document.getElementById('sidebarTextarea');
	var inputList = textarea.value.split(/\r?\n/);
	var newTexts = "";
	var count = 0;
	for(var i = 0; i < texts.length && count < subgoalLimit; i++){
		if(texts[i] != ""){
			newTexts += texts[i] + splitSymbol;
		}
	}
	newTexts = newTexts.substring(0, newTexts.length-1);
	if(newTexts.indexOf(" ") >= 0){
		newTexts = "\"" + newTexts + "\"" ;
	}
	var text = "";
	for(var i = 0; i < inputList.length; i++){
		var string = inputList[i].match(/(?:[^\s"]+|"[^"]*")+/g);
		if(string [1] == id){
			if(string [3]!= undefined){
				text += string [0] + " " + string [1]+ " " + newTexts + " " + string [3];
			}else{
				text += string [0] + " " + string [1]+ " " + newTexts
			}
		}else{
			text += inputList[i];
		}
		text += "\n";
	}
	textarea.value = text.substring(0, text.length - 1);
}

/**
 * Creates and returns the given title element.
 */
Sidebar.prototype.createTitle = function(label)
{
	var elt = document.createElement('a');
	elt.setAttribute('href', 'javascript:void(0);');
	elt.setAttribute('title', mxResources.get('sidebarTooltip'));
	elt.className = 'geTitle';
	mxUtils.write(elt, label);

	return elt;
};

