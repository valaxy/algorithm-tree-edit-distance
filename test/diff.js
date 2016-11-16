const diff = require('../lib/diff')
const AddOperation = require('../lib/addOperation')
const DeleteOperation = require('../lib/deleteOperation')
const EditOperation = require('../lib/editOperation')
const TreeNode = require('algorithm-data-structure/dest/tree/ordered/linked-ordered-node')
const assert = require('chai').assert


const createNode = function (v) {
	let node = new TreeNode
	node._value = v
	return node
}

const getValue = function (node) {
	return node._value
}

describe('diff', function () {
	it('_iterateAncestors()', function () {
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


	it('_postOrder()', function () {
		var root = createNode('a')
		var n1 = createNode('b')
		var n2 = createNode('c')
		var n3 = createNode('d')
		var n4 = createNode('e')
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


	it('diff(): case from paper', function () {
		// Tree1
		var f1 = createNode('f')
		var d1 = createNode('d')
		var e1 = createNode('e')
		var a1 = createNode('a')
		var c1 = createNode('c')
		var b1 = createNode('b')
		f1.addChildLast(d1).addChildLast(e1)
		d1.addChildLast(a1).addChildLast(c1)
		c1.addChildLast(b1)


		// Tree2
		var f2 = createNode('f')
		var c2 = createNode('c')
		var e2 = createNode('e')
		var d2 = createNode('d')
		var a2 = createNode('a')
		var b2 = createNode('b')
		f2.addChildLast(c2).addChildLast(e2)
		c2.addChildLast(d2)
		d2.addChildLast(a2).addChildLast(b2)

		var result = diff(f1, f2, {
			// 判断相等
			compare: function (nodeA, nodeB) {
				return nodeA._value == nodeB._value
			}
		})
		assert.equal(result.value, 2)
		assert.deepEqual([result.steps[0].node, result.steps[1].node], [c2, c1])
	})


	it('diff(): insert or remove all nodes', function () {
		// Tree1
		var a1 = createNode('a')
		var b1 = createNode('b')
		var c1 = createNode('c')
		var d1 = createNode('d')
		a1.addChildLast(b1).addChildLast(c1)
		c1.addChildLast(d1)

		// Tree2
		var a2 = createNode('a')

		// remove All
		var result = diff(a1, a2, {
			compare: function (nodeA, nodeB) {
				return nodeA._value == nodeB._value
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
				return nodeA._value == nodeB._value
			}
		})
		assert.equal(result.value, 3)
		assert.equal(result.steps[0].constructor, AddOperation)
		assert.equal(result.steps[0].node, c1)
		assert.equal(result.steps[1].node, d1)
		assert.equal(result.steps[2].node, b1)
	})


	it('diff(): a common case', function () {
		// Tree1
		var a1 = createNode('a')
		var b1 = createNode('b')
		var c1 = createNode('c')
		var d1 = createNode('d')
		a1.addChildLast(b1)
		b1.addChildLast(c1).addChildLast(d1)

		// Tree2
		var e2 = createNode('e')
		var c2 = createNode('c')
		var d2 = createNode('d')
		var f2 = createNode('f')
		e2.addChildLast(c2).addChildLast(d2).addChildLast(f2)

		// test
		var result = diff(a1, e2, {
			compare   : function (nodeA, nodeB) {
				return nodeA._value == nodeB._value
			},
			deleteCost: function (node) {
				return node.parent() ? 0.5 : 1 // assume delete a root node cost more
			}
		})
		assert.equal(result.value, 2.5)
		assert.ok(result.steps[0].equals(new EditOperation(a1, e2)))
		assert.ok(result.steps[1].equals(new DeleteOperation(b1)))
		assert.ok(result.steps[2].equals(new AddOperation(f2)))
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
