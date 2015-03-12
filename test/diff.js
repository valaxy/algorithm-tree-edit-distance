define(function (require) {
	var diff = require('src/diff')
	var TreeNode = require('bower_components/algorithm-data-structure/src/tree/ordered/linked-ordered-node')
	var AddOperation = require('src/operation/add')
	var DeleteOperation = require('src/operation/delete')
	var EditOperation = require('src/operation/edit')


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


	test('diff(): case from paper', function (assert) {
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

		var result = diff(f1, f2, {
			// 判断相等
			compare: function (nodeA, nodeB) {
				return nodeA.value() == nodeB.value()
			}
		})
		assert.equal(result.value, 2)
		assert.deepEqual([result.steps[0].node, result.steps[1].node], [c2, c1])
	})


	test('diff(): insert or remove all nodes', function (assert) {
		// Tree1
		var a1 = new TreeNode('a')
		var b1 = new TreeNode('b')
		var c1 = new TreeNode('c')
		var d1 = new TreeNode('d')
		a1.addChildLast(b1).addChildLast(c1)
		c1.addChildLast(d1)

		// Tree2
		var a2 = new TreeNode('a')

		// remove All
		var result = diff(a1, a2, {
			compare: function (nodeA, nodeB) {
				return nodeA.value() == nodeB.value()
			}
		})
		assert.equal(result.value, 3)
		assert.equal(result.steps[0].constructor, DeleteOperation)
		assert.equal(result.steps[0].node, c1)
		assert.equal(result.steps[1].node, d1)
		assert.equal(result.steps[2].node, b1)


		// test insert all
		var result = diff(a2, a1, {
			compare: function (nodeA, nodeB) {
				return nodeA.value() == nodeB.value()
			}
		})
		assert.equal(result.value, 3)
		assert.equal(result.steps[0].constructor, AddOperation)
		assert.equal(result.steps[0].node, c1)
		assert.equal(result.steps[1].node, d1)
		assert.equal(result.steps[2].node, b1)
	})


})


//test('_initArray()', function (assert) {
//	var ary = diff._initArray()
//	assert.equal(ary, null)
//
//	ary = diff._initArray(3)
//	assert.deepEqual(ary, [null, null, null])
//
//	ary = diff._initArray(2, 2)
//	assert.deepEqual(ary, [[null, null], [null, null]])
//})
