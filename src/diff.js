define(function (require) {
	var states = [] // 所有的状态
	var nodes1 = []
	var nodes2 = []

	var setState = function (i1, i, j1, j, value) {
		states[i1][i][j1][j] = value
		return value
	}

	var initState2 = function (i1, i, j1) {
		if (!Array.isArray(states[i1])) {
			states[i1] = []
		}
		if (!Array.isArray(states[i1][i])) {
			states[i1][i] = []
		}
		if (!Array.isArray(states[i1][i][j1])) {
			states[i1][i][j1] = []
		}
	}


	var getState = function (i1, i, j1, j) {
		initState2(i1, i, j1)
		if (typeof states[i1][i][j1][j] != 'undefined') {
			return states[i1][i][j1][j]
		}

		var ii = nodes1[i1].leftmostDescendant().index
		var jj = nodes2[j1].leftmostDescendant().index
		var result

		if (ii > i) {
			if (jj > j) { // 空 && 空
				result = 0
			} else { // 空 && 非空
				result = getState(i1, i, j1, j - 1) + 1
			}
		} else {
			if (jj > j) { // 非空 && 空
				result = getState(i1, i - 1, j1, j) + 1
			} else { // 非空 && 非空
				var v1 = getState(i1, i - 1, j1, j) + 1
				var v2 = getState(i1, i, j1, j - 1) + 1
				var v3 = getState(i1, nodes1[i].leftmostDescendant().index - 1, j1, nodes2[j].leftmostDescendant().index - 1)
					+ getState(i, i - 1, j, j - 1)
					+ (compare(nodes1[i], nodes2[j]) ? 0 : 1)
				result = Math.min(v1, v2, v3)
			}
		}

		return setState(i1, i, j1, j, result)
	}

	// 判断相等
	var compare = function (nodeA, nodeB) {
		return nodeA.value() == nodeB.value()
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


	// 初始化状态
	var initStates = function (n1, n2) {
		var states = []
		for (var ia = 0; ia < n1; ia++) {
			states[ia] = []
			for (var ib = 0; ib < n1; ib++) {
				states[ia][ib] = []
				for (var ja = 0; ja < n2; ja++) {
					states[ia][ib][ja] = []
					for (var jb = 0; jb < n2; jb++) {
						states[ia][ib][ja][jb] = -1
					}
				}
			}
		}
		return states
	}


	// 算法来自那篇论文
	// - 构造两棵树
	// - 计算每棵树的后序遍历编号,
	// - 从小到大枚举i, 从近到远枚举anc(i)=ii, 枚举同j, jj, 得到状态(ii, i, jj, j)
	// - 计算该状态
	// - 求state(0, root1, 0, root2)
	var diff = function (root1, root2) {
		// post order
		nodes1 = postOrder(root1)
		nodes2 = postOrder(root2)
		var n1 = nodes1.length // 节点个数
		var n2 = nodes2.length


		// calc
		//states = initStates(n1, n2)
		for (var i = 0; i < n1; i++) {
			for (var j = 0; j < n2; j++) {
				iterateAncestors(nodes1[i], function (ii) {
					iterateAncestors(nodes2[j], function (jj) {
						getState(ii, i, jj, j)
					})
				})
			}
		}

		return getState(n1 - 1, n1 - 1, n2 - 1, n2 - 1)
	}

	// private method for test
	diff._iterateAncestors = iterateAncestors
	diff._postOrder = postOrder
	diff._initStates = initStates

	return diff
})