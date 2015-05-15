> This is under development, API may not be stable

The classical algorithm about tree edit distance which published by ZHANG SHA SHA for AMD/CMD package

# Usage
```javascript
var TreeNode = require('bower_components/algorithm-data-structure/src/tree/ordered/linked-ordered-node')
var diff     = require('bower_components/algorithm-tree-edit-distance/src/diff')

var result = diff(
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