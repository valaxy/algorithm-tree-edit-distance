/** Add operation must add a node in 'to' tree to 'from' tree */
module.exports = class AddOperation {
	constructor(node) {
		this.node = node
	}

	equals(op) {
		return op.constructor == this.constructor &&
			this.node === op.node
	}
}
