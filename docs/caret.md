# CodeX Editor Caret Module

The `Caret` module contains methods working with caret. Uses [Range](https://developer.mozilla.org/en-US/docs/Web/API/Range) methods to navigate caret
between blocks. 

Caret class implements basic Module class that holds User configuration
and default CodeX Editor instances

## Properties

## Methods

### setToBlock

```javascript
Caret.setToBlock(block, offset, atEnd)
```

> Method gets Block instance and puts caret to the text node with offset

#### params

| Param        | Type | Description|
| -------------|------ |:-------------:|
| block        | Object | Block instance that BlockManager created|
| offset       | Number | caret offset regarding to the text node (Default: 0)|
| atEnd        | Boolean | puts caret at the end of last text node|


### setToTheLastBlock

```javascript
Caret.setToTheLastBlock()
```

> sets Caret at the end of last Block
If last block is not empty, inserts another empty Block which is passed as initial
