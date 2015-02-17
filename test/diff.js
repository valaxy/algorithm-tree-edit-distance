define(function (require) {
	var diff = require('src/diff')
	var TreeNode = require('bower_components/algorithm-data-structure/src/tree/ordered/linked-ordered-node')

	module('diff')


	test('_iterateAncestors()', function (assert) {
		var root = new TreeNode
		var n1 = new TreeNode
		var n2 = new TreeNode
		root.addChildLast(n1)
		n1.addChildLast(n2)
		root.index = 0
		n1.index = 1
		n2.index = 2


		// case 1
		var indexes = []
		diff._iterateAncestors(root, function (index) {
			indexes.push(index)
		})
		assert.deepEqual(indexes, [0])


		// case 2
		indexes = []
		diff._iterateAncestors(n1, function (index) {
			indexes.push(index)
		})
		assert.deepEqual(indexes, [1, 0])


		// case 3
		indexes = []
		diff._iterateAncestors(n2, function (index) {
			indexes.push(index)
		})
		assert.deepEqual(indexes, [2, 1, 0])
	})


	test('_postOrder()', function (assert) {
		var root = new TreeNode('a')
		var n1 = new TreeNode('b')
		var n2 = new TreeNode('c')
		var n3 = new TreeNode('d')
		var n4 = new TreeNode('e')
		root.addChildLast(n1).addChildLast(n2)
		n1.addChildLast(n3)
		n2.addChildLast(n4)

		assert.deepEqual(diff._postOrder(root), [n3, n1, n4, n2, root])
		assert.equal(n3.index, 0)
		assert.equal(n1.index, 1)
		assert.equal(n4.index, 2)
		assert.equal(n2.index, 3)
		assert.equal(root.index, 4)
	})


	//test('_initStates()', function (assert) {
	//	var states = diff._initStates(10, 20)
	//	assert.equal(states[0][0][0][0], -1)
	//	assert.equal(states[9][9][19][19], -1)
	//})


	test('diff: case from paper', function (assert) {
		// Tree1
		var f1 = new TreeNode('f')
		var d1 = new TreeNode('d')
		var e1 = new TreeNode('e')
		var a1 = new TreeNode('a')
		var c1 = new TreeNode('c')
		var b1 = new TreeNode('b')
		f1.addChildLast(d1).addChildLast(e1)
		d1.addChildLast(a1).addChildLast(c1)
		c1.addChildLast(b1)


		// Tree2
		var f2 = new TreeNode('f')
		var c2 = new TreeNode('c')
		var e2 = new TreeNode('e')
		var d2 = new TreeNode('d')
		var a2 = new TreeNode('a')
		var b2 = new TreeNode('b')
		f2.addChildLast(c2).addChildLast(e2)
		c2.addChildLast(d2)
		d2.addChildLast(a2).addChildLast(b2)

		assert.equal(diff(f1, f2), 2)
	})

})