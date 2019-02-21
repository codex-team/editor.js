# Editor.js Caret Module

The `Caret` module contains methods working with caret. Uses [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) methods to navigate caret
between blocks. 

Caret class implements basic Module class that holds User configuration
and default Editor.js instances

## Properties

## Methods

### setToBlock

```javascript
Caret.setToBlock(block, position, offset)
```

> Method gets Block instance and puts caret to the text node with offset

#### params

| Param        | Type | Description|
| -------------|------ |:-------------:|
| block        | Object | Block instance that BlockManager created|
| position     | String | Can be 'start', 'end' or 'default'. Other values will be treated as 'default'. Shows position of the caret regarding to the Block.|
| offset       | Number | caret offset regarding to the text node (Default: 0)|


### setToTheLastBlock

```javascript
Caret.setToTheLastBlock()
```

> sets Caret at the end of last Block
If last block is not empty, inserts another empty Block which is passed as initial
