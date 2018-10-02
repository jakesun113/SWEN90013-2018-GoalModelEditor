/**
 * Extends <mxGraphLayout> to implement auto-layout for Motivaitonal
 * Models.
 *
 * Optional arguments:
 * : levelDistance, default distance between goals at adjacent ranks
 * : nodeDistance, default distance between adjacent nodes at the same rank
 */
function mxGoalModelLayout(graph, levelDistance, nodeDistance) {
    mxGraphLayout.call(this, graph);
    this.levelDistance = levelDistance != null ? levelDistance : 30;
    this.nodeDistance = nodeDistance != null ? nodeDistance : 30;
}
// extend MxGraphLayout
mxGoalModelLayout.prototype = new mxGraphLayout();
mxGoalModelLayout.prototype.constructor = mxGoalModelLayout;

// tracks parents that need to be updated if children are updated
mxGoalModelLayout.prototype.parentsChanged = null;

// tracks cells that have already been visited by the DFS autolayout
mxGoalModelLayout.prototype.visited = null;

// default vertical separation between nodes on adjacent ranks
mxGoalModelLayout.prototype.levelDistance = null;

// default horizontal separation between nodes on the same rank
mxGoalModelLayout.prototype.nodeDistance = null;

// default horiztonal distance between edges exiting a vertex
mxGoalModelLayout.prototype.prefHozEdgeSep = 5;

// default vertical offset between edges exiting a vertex
mxGoalModelLayout.prototype.prefVertEdgeOff = 4;

// root of the tree - this is automatically determined unless passed
// explicitly
mxGoalModelLayout.prototype.root = null;

// internal representation of root cell - DO NOT TOUCH THIS
mxGoalModelLayout.prototype.node = null;

/**
 * Determine whether vertex should be ignored for the purposes of
 * the autolayout algorithm.
 */
mxGoalModelLayout.prototype.isVertexIgnored = function(vertex) {
    return (
        mxGraphLayout.prototype.isVertexIgnored.apply(this, arguments) ||
        this.graph.getConnections(vertex).length == 0
    );
};

/**
 * Executes the autolayout algorithm
 *
 * If the parent has any connected edges, then it is used as the root of
 * the tree. Else, <mxGraph.findTreeRoots> will be used to find a suitable
 * root node within the set of children of the given parent.
 *
 * Parameters:
 *
 * parent - <mxCell> whose children should be laid out.
 * root - Optional <mxCell> that will be used as the root of the tree.
 * Overrides <root> if specified.
 */
mxGoalModelLayout.prototype.execute = function(parent, root) {
    this.parent = parent;
    var model = this.graph.getModel();

    if (root == null) {
        // Takes the parent as the root if it has outgoing edges
        if (this.graph.getEdges(parent, model.getParent(parent),
                false, true, false).length > 0) {
            this.root = parent;
        }

        // Tries to find a suitable root in the parent's children
        else {
            var roots = this.graph.findTreeRoots(parent, true, false);

            if (roots.length > 0) {
                for (var i = 0; i < roots.length; i++) {
                    if (!this.isVertexIgnored(roots[i]) &&
                        this.graph.getEdges(roots[i], null,
                        false, true, false).length > 0
                    ) {
                        this.root = roots[i];
                        break;
                    }
                }
            }
        }
    } else {
        this.root = root;
    }

    // check if we need to resize or change the parent's location
    if (this.root != null) {
        this.parentsChanged = null;

        //  Maintaining parent location
        this.parentX = null;
        this.parentY = null;

        model.beginUpdate(); // start transaction

        try {
            this.visited = new Object();
            this.node = this.dfs(this.root, parent);

            if (this.node != null) {
                this.layout(this.node);
                var x0 = this.graph.gridSize;
                var y0 = x0;

                var bounds = this.verticalLayout(this.node, null, x0, y0);

                if (bounds != null) {
                    var dx = 0;
                    var dy = 0;

                    if (bounds.x < 0) {
                        dx = Math.abs(x0 - bounds.x);
                    }

                    if (bounds.y < 0) {
                        dy = Math.abs(y0 - bounds.y);
                    }

                    if (dx != 0 || dy != 0) {
                        this.moveNode(this.node, dx, dy);
                    }
                }

                // Maintaining parent location
                if (this.parentX != null && this.parentY != null) {
                    var geo = this.graph.getCellGeometry(parent);

                    if (geo != null) {
                        geo = geo.clone();
                        geo.x = this.parentX;
                        geo.y = this.parentY;
                        model.setGeometry(parent, geo);
                    }
                }
            }
        } finally {
            model.endUpdate(); // end transaction
        }
    }
};

/**
 * Moves the specified node and all of its children by the given amount.
 */
mxGoalModelLayout.prototype.moveNode = function(node, dx, dy) {
    node.x += dx;
    node.y += dy;
    this.apply(node);

    var child = node.child;

    while (child != null) {
        this.moveNode(child, dx, dy);
        child = child.next;
    }
};

/**
 * Does a depth first search starting at the specified cell.
 * Makes sure the specified parent is never left by the
 * algorithm.
 */
mxGoalModelLayout.prototype.dfs = function(cell, parent) {
    var id = mxCellPath.create(cell);
    var node = null;

    if (
        cell != null &&
        this.visited[id] == null &&
        !this.isVertexIgnored(cell)
    ) {
        this.visited[id] = cell;
        node = this.createNode(cell);

        var model = this.graph.getModel();
        var prev = null;
        var out = this.graph.getEdges(
            cell,
            parent,
            false,
            true,
            false,
            true
        );
        var view = this.graph.getView();

        for (var i = 0; i < out.length; i++) {
            var edge = out[i];

            if (!this.isEdgeIgnored(edge)) {

                // Checks if terminal in same swimlane
                var state = view.getState(edge);
                var target =
                    state != null
                        ? state.getVisibleTerminal(false)
                        : view.getVisibleTerminal(edge, false);
                var tmp = this.dfs(target, parent);

                if (tmp != null && model.getGeometry(target) != null) {
                    if (prev == null) {
                        node.child = tmp;
                    } else {
                        prev.next = tmp;
                    }

                    prev = tmp;
                }
            } 
        }
    }

    return node;
};

/**
 * Executes compact tree layout algorithm  at the given node.
 */
mxGoalModelLayout.prototype.layout = function(node) {
    if (node != null) {
        var child = node.child;

        while (child != null) {
            this.layout(child);
            child = child.next;
        }

        if (node.child != null) {
            this.attachParent(node, this.join(node));
        } else {
            this.layoutLeaf(node);
        }
    }
};

/**
 * Function: verticalLayout
 */
mxGoalModelLayout.prototype.verticalLayout = function(
    node,
    parent,
    x0,
    y0,
    bounds
) {
    node.x += x0 + node.offsetY;
    node.y += y0 + node.offsetX;
    bounds = this.apply(node, bounds);
    var child = node.child;

    if (child != null) {
        bounds = this.verticalLayout(child, node, node.x, node.y, bounds);
        var siblingOffset = node.x + child.offsetY;
        var s = child.next;

        while (s != null) {
            bounds = this.verticalLayout(
                s,
                node,
                siblingOffset,
                node.y + child.offsetX,
                bounds
            );
            siblingOffset += s.offsetY;
            s = s.next;
        }
    }

    return bounds;
};

/**
 * Function: attachParent
 */
mxGoalModelLayout.prototype.attachParent = function(node, height) {
    var x = this.nodeDistance + this.levelDistance;
    var y2 = (height - node.width) / 2 - this.nodeDistance;
    var y1 = y2 + node.width + 2 * this.nodeDistance - height;

    node.child.offsetX = x + node.height;
    node.child.offsetY = y1;

    node.contour.upperHead = this.createLine(
        node.height,
        0,
        this.createLine(x, y1, node.contour.upperHead)
    );
    node.contour.lowerHead = this.createLine(
        node.height,
        0,
        this.createLine(x, y2, node.contour.lowerHead)
    );
};

/**
 * Function: layoutLeaf
 */
mxGoalModelLayout.prototype.layoutLeaf = function(node) {
    var dist = 2 * this.nodeDistance;

    node.contour.upperTail = this.createLine(node.height + dist, 0);
    node.contour.upperHead = node.contour.upperTail;
    node.contour.lowerTail = this.createLine(0, -node.width - dist);
    node.contour.lowerHead = this.createLine(
        node.height + dist,
        0,
        node.contour.lowerTail
    );
};

/**
 * Function: join
 */
mxGoalModelLayout.prototype.join = function(node) {
    var dist = 2 * this.nodeDistance;

    var child = node.child;
    node.contour = child.contour;
    var h = child.width + dist;
    var sum = h;
    child = child.next;

    while (child != null) {
        var d = this.merge(node.contour, child.contour);
        child.offsetY = d + h;
        child.offsetX = 0;
        h = child.width + dist;
        sum += d + h;
        child = child.next;
    }

    return sum;
};

/**
 * Function: merge
 */
mxGoalModelLayout.prototype.merge = function(p1, p2) {
    var x = 0;
    var y = 0;
    var total = 0;

    var upper = p1.lowerHead;
    var lower = p2.upperHead;

    while (lower != null && upper != null) {
        var d = this.offset(x, y, lower.dx, lower.dy, upper.dx, upper.dy);
        y += d;
        total += d;

        if (x + lower.dx <= upper.dx) {
            x += lower.dx;
            y += lower.dy;
            lower = lower.next;
        } else {
            x -= upper.dx;
            y -= upper.dy;
            upper = upper.next;
        }
    }

    if (lower != null) {
        var b = this.bridge(p1.upperTail, 0, 0, lower, x, y);
        p1.upperTail = b.next != null ? p2.upperTail : b;
        p1.lowerTail = p2.lowerTail;
    } else {
        var b = this.bridge(p2.lowerTail, x, y, upper, 0, 0);

        if (b.next == null) {
            p1.lowerTail = b;
        }
    }

    p1.lowerHead = p2.lowerHead;

    return total;
};

/**
 * Function: offset
 */
mxGoalModelLayout.prototype.offset = function(p1, p2, a1, a2, b1, b2) {
    var d = 0;

    if (b1 <= p1 || p1 + a1 <= 0) {
        return 0;
    }

    var t = b1 * a2 - a1 * b2;

    if (t > 0) {
        if (p1 < 0) {
            var s = p1 * a2;
            d = s / a1 - p2;
        } else if (p1 > 0) {
            var s = p1 * b2;
            d = s / b1 - p2;
        } else {
            d = -p2;
        }
    } else if (b1 < p1 + a1) {
        var s = (b1 - p1) * a2;
        d = b2 - (p2 + s / a1);
    } else if (b1 > p1 + a1) {
        var s = (a1 + p1) * b2;
        d = s / b1 - (p2 + a2);
    } else {
        d = b2 - (p2 + a2);
    }

    if (d > 0) {
        return d;
    } else {
        return 0;
    }
};

/**
 * Function: bridge
 */
mxGoalModelLayout.prototype.bridge = function(line1, x1, y1, line2, x2, y2) {
    var dx = x2 + line2.dx - x1;
    var dy = 0;
    var s = 0;

    if (line2.dx == 0) {
        dy = line2.dy;
    } else {
        s = dx * line2.dy;
        dy = s / line2.dx;
    }

    var r = this.createLine(dx, dy, line2.next);
    line1.next = this.createLine(0, y2 + line2.dy - dy - y1, r);

    return r;
};

/**
 * Function: createNode
 */
mxGoalModelLayout.prototype.createNode = function(cell) {
    var node = new Object();
    node.cell = cell;
    node.x = 0;
    node.y = 0;
    node.width = 0;
    node.height = 0;

    var geo = this.getVertexBounds(cell);

    if (geo != null) {
        node.width = geo.width;
        node.height = geo.height;
    }

    node.offsetX = 0;
    node.offsetY = 0;
    node.contour = new Object();

    return node;
};

/**
 * Function: apply
 */
mxGoalModelLayout.prototype.apply = function(node, bounds) {
    var model = this.graph.getModel();
    var cell = node.cell;
    var g = model.getGeometry(cell);

    if (cell != null && g != null) {
        if (this.isVertexMovable(cell)) {
            g = this.setVertexLocation(cell, node.x, node.y);
        }

        if (bounds == null) {
            bounds = new mxRectangle(g.x, g.y, g.width, g.height);
        } else {
            bounds = new mxRectangle(
                Math.min(bounds.x, g.x),
                Math.min(bounds.y, g.y),
                Math.max(bounds.x + bounds.width, g.x + g.width),
                Math.max(bounds.y + bounds.height, g.y + g.height)
            );
        }
    }

    return bounds;
};

/**
 * Function: createLine
 */
mxGoalModelLayout.prototype.createLine = function(dx, dy, next) {
    var line = new Object();
    line.dx = dx;
    line.dy = dy;
    line.next = next;

    return line;
};
