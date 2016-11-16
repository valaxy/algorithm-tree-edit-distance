/** Edit operation must change a node at 'from' tree to
 ** a node in `to` tree */

module.exports = class EditOperation {
	constructor(fromNode, toNode) {
		this.fromNode = fromNode
		this.toNode = toNode
	}

	equals(op) {
		return op.constructor == this.constructor &&
			this.fromNode === op.fromNode &&
			this.toNode === op.toNode
	}
}
