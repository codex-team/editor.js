# CodeX Editor API

Blocks have access to the public methods provided by CodeX Editor API Module. Plugin and Tune Developers 
can use Editor API as they want.
 
## Api object description

Common API interface.

```js
export interface IAPI {
   blocks: IBlocksAPI;
   caret: ICaretAPI;
   sanitizer: ISanitizerAPI;
   toolbar: IToolbarAPI;
 }
 ```

#### IBlocksAPI

Methods that working with Blocks

```swap(fromIndex, toIndex)``` - swaps two Blocks by their positions

```delete(blockIndex?: Number)``` - deletes block with passed index 

```getCurrentBlockIndex()``` - current block index

```getBlockByIndex(index: Number)``` - returns block with passed index

#### ISanitizerAPI

```clean(taintString, config)``` - method uses HTMLJanitor to clean taint string.
CodeX Editor provides basic config without attributes, but you can inherit by passing your own config.

Usage:

```js
let taintString = '<div><p style="font-size: 5em;"><b></b>BlockWithText<a onclick="void(0)"></div>'
let customConfig = {
  b: true,
  p: {
    style: true,
  },
}
this.api.sanitizer.clean(taintString, customConfig);
```

### IToolbarAPI

Methods that working with Toolbar

```open()``` - Opens toolbar

```close()``` - Closes toolbar, toolbox and blockSettings if they are opened

### IEventsAPI

Methods that allows to subscribe on CodeX Editor events

```on(eventName: string, callback: Function)``` - subscribe callback on event

```off(eventName: string, callback: Function)``` - unsubscribe callback from event

```emit(eventName: string, data: object)``` - fires all subscribed callbacks with passed data

### IListenerAPI

Methods that allows to work with DOM listener. Useful when you forgot to remove listener.
Module collects all listeners and destroys automatically 

```on(element: HTMLElement, eventType: string, handler: Function, useCapture?: boolean)``` - add event listener to HTML element

```off(element: HTMLElement, eventType: string, handler: Function)``` - remove event handler from HTML element 
