define(function (require) {
	var AddOperation = require('./operation/add')
	var DeleteOperation = require('./operation/delete')
	var EditOperation = require('./operation/edit')


	var compare, states, nodes1, nodes2
	var addCost, deleteCost, editCost


	var defaultAddCost = function () {
		return 1
	}

	var defaultDeleteCost = function () {
		return 1
	}

	var defaultEditCost = function () {
		return 1
	}

	var init = function () {
		compare = null  // compare(nodeA, nodeB)函数, 相等返回true
		states = []     // 所有的状态
		nodes1 = []
		nodes2 = []
	}

	var initArrayElement = function (states, i, j, k) {
		if (!Array.isArray(states[i])) {
			states[i] = []
		}
		if (!Array.isArray(states[i][j])) {
			states[i][j] = []
		}
		if (!Array.isArray(states[i][j][k])) {
			states[i][j][k] = []
		}
	}

	var setState = function (i1, i, j1, j, result) {
		states[i1][i][j1][j] = result
		return result
	}


	var getValue = function (i1, i, j1, j) {
		return getState(i1, i, j1, j).value
	}


	var getState = function (i1, i, j1, j) {
		initArrayElement(states, i1, i, j1)

		if (typeof states[i1][i][j1][j] != 'undefined') {
			return states[i1][i][j1][j]
		}

		var ii = nodes1[i1].leftmostDescendant().index
		var jj = nodes2[j1].leftmostDescendant().index
		var result

		if (ii > i) {
			if (jj > j) { // 空 && 空
				result = {
					op: null,
					state: null,
					value: 0
				}
			} else { // 空 && 非空
				result = {
					op: new AddOperation(nodes2[j]),
					state: {
						i1: i1,
						i: i,
						j1: j1,
						j: j - 1
					}
				}
				result.value = getValue(result.state.i1, result.state.i, result.state.j1, result.state.j) + addCost(nodes2[j])
			}
		} else {
			if (jj > j) { // 非空 && 空
				result = {
					op: new DeleteOperation(nodes1[i]),
					state: {
						i1: i1,
						i: i - 1,
						j1: j1,
						j: j
					}
				}
				result.value = getValue(result.state.i1, result.state.i, result.state.j1, result.state.j) + deleteCost(nodes1[i])
			} else { // 非空 && 非空
				var result1 = {
					op: new DeleteOperation(nodes1[i]),
					state: {
						i1: i1,
						i: i - 1,
						j1: j1,
						j: j
					}
				}
				result1.value = getValue(result1.state.i1, result1.state.i, result1.state.j1, result1.state.j) + deleteCost(nodes1[i])


				var result2 = {
					op: new AddOperation(nodes2[j]),
					state: {
						i1: i1,
						i: i,
						j1: j1,
						j: j - 1
					}
				}
				result2.value = getValue(result2.state.i1, result2.state.i, result2.state.j1, result2.state.j) + addCost(nodes2[j])


				var isSame = compare(nodes1[i], nodes2[j])
				var result3 = {
					op: isSame ? null : new EditOperation(nodes1[i], nodes2[j]),
					state: [{
						i1: i1,
						i: nodes1[i].leftmostDescendant().index - 1,
						j1: j1,
						j: nodes2[j].leftmostDescendant().index - 1
					}, {
						i1: i,
						i: i - 1,
						j1: j,
						j: j - 1
					}]
				}
				result3.value = getValue(result3.state[0].i1, result3.state[0].i, result3.state[0].j1, result3.state[0].j)
				+ getValue(result3.state[1].i1, result3.state[1].i, result3.state[1].j1, result3.state[1].j)
				+ (isSame ? 0 : editCost(nodes1[i], nodes2[j]))


				var minValue = Math.min(result1.value, result2.value, result3.value)
				if (minValue == result1.value) {
					result = result1
				} else if (minValue == result2.value) {
					result = result2
				} else {
					result = result3
				}
			}
		}

		return setState(i1, i, j1, j, result)
	}


	var getSteps = function (steps, state) {
		var result = getState(state.i1, state.i, state.j1, state.j)
		if (result.state === null) {
			return
		}

		if (result.op != null) {
			steps.push(result.op)
		}
		if (Array.isArray(result.state)) {
			getSteps(steps, result.state[0])
			getSteps(steps, result.state[1])
		} else {
			getSteps(steps, result.state)
		}
	}


	// 后续遍历, 并为每个节点给予一个编号, 同时获取编号对应的值
	var postOrder = function (root) {
		var index = 0
		var nodes = []
		root.postorderWalk(function (node) {
			node.index = index++
			nodes.push(node)
		})
		return nodes
	}


	// 迭代节点node的祖父节点, 由近至远, 包括自己
	// operation(index): 处理祖宗节点
	var iterateAncestors = function (node, operation) {
		while (true) {
			operation(node.index)
			node = node.parent()
			if (!node) {
				break
			}
		}
	}


	// 算法来自ZHANG SHA SHA的论文
	// - 构造两棵树
	// - 计算每棵树的后序遍历编号,
	// - 从小到大枚举i, 从近到远枚举anc(i)=ii, 枚举同j, jj, 得到状态(ii, i, jj, j)
	// - 计算该状态
	// - 求state(0, root1, 0, root2)


	/** root1: the root of old tree, which is OrderedTree
	 ** root2: the root of new tree, which is OrderedTree
	 ** options:
	 **     - compare(nodeA, nodeB): must, if equal returns true, else return false
	 **     - [addCost(node)]: if add `node` which only exist in new tree, what is the cost
	 **     - [deleteCost(node)]: if delete `node` which only exist in old tree, what is the cost
	 **     - [editCost(nodeA, nodeB)]: if change `nodeA` to `nodeB`, what is the cost */
	var diff = function (root1, root2, options) {
		init()
		compare = options.compare
		addCost = options.addCost || defaultAddCost
		deleteCost = options.deleteCost || defaultDeleteCost
		editCost = options.editCost || defaultEditCost


		// post order
		nodes1 = postOrder(root1)
		nodes2 = postOrder(root2)
		var n1 = nodes1.length // 节点个数
		var n2 = nodes2.length


		// calc
		for (var i = 0; i < n1; i++) {
			for (var j = 0; j < n2; j++) {
				iterateAncestors(nodes1[i], function (ii) {
					iterateAncestors(nodes2[j], function (jj) {
						getState(ii, i, jj, j)
					})
				})
			}
		}

		var state = {
			i1: n1 - 1,
			i: n1 - 1,
			j1: n2 - 1,
			j: n2 - 1
		}
		var steps = []
		getSteps(steps, state)
		return {
			steps: steps,
			value: getValue(n1 - 1, n1 - 1, n2 - 1, n2 - 1)
		}
	}


	// private method for test
	diff._iterateAncestors = iterateAncestors
	diff._postOrder = postOrder

	return diff
})


//// slice a arguemnts
//var slice = function (args, from) {
//	var ary = []
//	for (var i = from; i < args.length; i++) {
//		ary.push(args[i])
//	}
//	return ary
//}


//var initArray = function (/* ... */) {
//	if (arguments.length == 0) {
//		return null
//	}
//
//	var ary = []
//	for (var i = 0, n = arguments[0]; i < n; i++) {
//		ary[i] = initArray.apply(this, slice(arguments, 1))
//	}
//	return ary
//}
