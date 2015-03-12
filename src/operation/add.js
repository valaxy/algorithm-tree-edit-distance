define(function () {

	/** Add operation must add a node in 'to' tree to 'from' tree */
	var AddOperation = function (node) {
		this.node = node
	}

	AddOperation.prototype.equals = function (op) {
		return op.constructor == this.constructor &&
			this.node === op.node
	}

	return AddOperation
})