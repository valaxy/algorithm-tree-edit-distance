/** Delete operation must delete a node at `from` tree */

module.exports = class DeleteOperation {
	constructor(node) {
		this.node = node
	}

	equals(op) {
		return op.constructor == this.constructor && this.node === op.node
	}
}