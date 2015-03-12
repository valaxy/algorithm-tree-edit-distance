define(function () {

	/** Delete operation must delete a node at `from` tree */
	var DeleteOperation = function (node) {
		this.node = node
	}

	DeleteOperation.prototype.equals = function (op) {
		return op.constructor == this.constructor &&
			this.node === op.node
	}

	return DeleteOperation
})