[![dependencies Status](https://david-dm.org/valaxy/algorithm-tree-edit-distance/status.svg?style=flat-square)](https://david-dm.org/valaxy/algorithm-tree-edit-distance)
[![devDependencies Status](https://david-dm.org/valaxy/algorithm-tree-edit-distance/dev-status.svg?style=flat-square)](https://david-dm.org/valaxy/algorithm-tree-edit-distance?type=dev)

The classical algorithm about tree edit distance which published by ZHANG SHA SHA for CommonJS package

# Usage
```javascript
const TreeNode = require('algorithm-data-structure/dest/tree/ordered/linked-ordered-node')
const diff     = require('algorithm-tree-edit-distance')

const result = diff(
    new TreeNode, 
    new TreeNode,
    {
        compare: function (nodeA, nodeB) { ... },
        addCost: function (node) { ... },
        deleteCost: function (node) { ... },
        editCost: function (nodeA, nodeB) { ... }
    }
)

console.log(result.value)
console.log(result.steps)
```

Check the unit test for more details and examples