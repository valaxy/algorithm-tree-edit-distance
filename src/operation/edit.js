define(function () {

	/** Edit operation must change a node at 'from' tree to
	 ** a node in `to` tree */
	var EditOperation = function (fromNode, toNode) {
		this.fromNode = fromNode
		this.toNode = toNode
	}

	EditOperation.prototype.equals = function (op) {
		return op.constructor == this.constructor &&
			this.fromNode === op.fromNode &&
			this.toNode === op.toNode
	}


	return EditOperation
})
